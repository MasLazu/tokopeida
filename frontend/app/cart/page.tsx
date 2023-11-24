import Navbar from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import StoreItems from "@/components/cart/store-items"
import { Button } from "@/components/ui/button"
import PageTransition from "@/components/page-pransition"
import ProductSlider from "@/components/product-slider"
import { product, productApiResponse } from "@/interfaces/product"
import { useServerFetch } from "@/hooks/useServerFetch"
import { cartItem, cartItemApiResponse } from "@/interfaces/cart-item"
import { cartStoreItem } from "@/app/cart-provider"
import { store, storeApiResponse } from "@/interfaces/store"
import CartMain from "./cartMain"

export default async function StorePage() {
  let products: product[] = []
  try {
    const result = (
      await useServerFetch.get<productApiResponse[]>(`/api/product/explore/14`)
    )?.data
    products = result.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      sold: product.sold,
      images: product.images,
      storeId: product.store_id,
      createdAt: new Date(product.created_at),
      updatedAt: new Date(product.updated_at),
    }))
  } catch (err) {
    console.log(err)
  }

  let cartItems: cartStoreItem[] = []
  try {
    const res = (
      await useServerFetch.get<cartItemApiResponse[] | null>(
        "/api/cart/current"
      )
    ).data
    if (res) {
      for (const cartItem of res) {
        if (
          cartItems.find(
            (cartStoreItem) =>
              cartStoreItem.store.id === cartItem.product.store_id
          )
        ) {
          let cartStoreItem = cartItems.find(
            (cartStoreItem) =>
              cartStoreItem.store.id === cartItem.product.store_id
          )
          cartStoreItem?.items.push({
            product: {
              id: cartItem.product.id,
              name: cartItem.product.name,
              description: cartItem.product.description,
              price: cartItem.product.price,
              stock: cartItem.product.stock,
              sold: cartItem.product.sold,
              images: cartItem.product.images,
              storeId: cartItem.product.store_id,
              createdAt: new Date(cartItem.product.created_at),
              updatedAt: new Date(cartItem.product.updated_at),
            },
            quantity: cartItem.quantity,
          })
        } else {
          let storeApiResponse = (
            await useServerFetch.get<storeApiResponse>(
              `/api/store/${cartItem.product.store_id}`
            )
          ).data
          let store: store = {
            id: storeApiResponse.id,
            name: storeApiResponse.name,
            city: storeApiResponse.city,
            createdAt: new Date(storeApiResponse.created_at),
            updatedAt: new Date(storeApiResponse.updated_at),
          }
          cartItems.push({
            store,
            items: [
              {
                product: {
                  id: cartItem.product.id,
                  name: cartItem.product.name,
                  description: cartItem.product.description,
                  price: cartItem.product.price,
                  stock: cartItem.product.stock,
                  sold: cartItem.product.sold,
                  images: cartItem.product.images,
                  storeId: cartItem.product.store_id,
                  createdAt: new Date(cartItem.product.created_at),
                  updatedAt: new Date(cartItem.product.updated_at),
                },
                quantity: cartItem.quantity,
              },
            ],
          })
        }
      }
      cartItems = cartItems
    }
  } catch (err) {
    console.log(err)
  }

  return (
    <>
      <Navbar />
      <PageTransition>
        <div className="flex justify-center md:p-5 sm:p-3 mt-4">
          <CartMain cartInit={cartItems} products={products} />
        </div>
      </PageTransition>
    </>
  )
}

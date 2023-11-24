import { useServerFetch } from "./useServerFetch"
import { user, userApiResponse } from "@/interfaces/user"
import { store, storeApiResponse } from "@/interfaces/store"
import { product, productApiResponse } from "@/interfaces/product"
import { cartStoreItem } from "@/app/cart-provider"
import { cartItemApiResponse } from "@/interfaces/cart-item"

export async function useGetServerContext() {
  let wishlists: product[] = []
  let wishlistsResponse: productApiResponse[] | null = null

  try {
    wishlistsResponse = (
      await useServerFetch.get<productApiResponse[]>("/api/wishlist/current")
    ).data
  } catch (err) {
    console.log(err)
  }

  if (wishlistsResponse) {
    wishlists = wishlistsResponse.map((product) => ({
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
  }

  let user: user | null = null
  let userResponse: userApiResponse | null = null

  try {
    userResponse = (
      await useServerFetch.get<userApiResponse>("/api/user/current")
    ).data
  } catch (err) {
    console.log(err)
  }

  if (userResponse) {
    user = {
      email: userResponse.email,
      firstName: userResponse.first_name,
      lastName: userResponse.last_name,
      balance: userResponse.balance,
      createdAt: new Date(userResponse.created_at),
      updatedAt: new Date(userResponse.updated_at),
    }
  }

  let store: store | null = null
  let storeResponse: storeApiResponse | null = null

  try {
    storeResponse = (
      await useServerFetch.get<storeApiResponse>("/api/store/current")
    ).data
  } catch (err) {
    console.log(err)
  }

  if (storeResponse) {
    store = {
      id: storeResponse.id,
      name: storeResponse.name,
      city: storeResponse.city,
      createdAt: new Date(storeResponse.created_at),
      updatedAt: new Date(storeResponse.updated_at),
    }
  }

  let cartItems: cartStoreItem[] = []
  const res = (
    await useServerFetch.get<cartItemApiResponse[] | null>("/api/cart/current")
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
  }

  return { user, store, wishlists, cartItems }
}

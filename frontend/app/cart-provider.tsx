"use client"

import { createContext } from "react"
import { useState } from "react"
import { useClientFetch } from "@/hooks/useClientFetch"
import { useEffect } from "react"
import { store, storeApiResponse } from "@/interfaces/store"
import { cartItem, cartItemApiResponse } from "@/interfaces/cart-item"

export type cartStoreItem = {
  store: store
  items: cartItem[]
}

type cartContext = {
  cart: cartStoreItem[]
  setCart: (cart: cartStoreItem[]) => void
  refetchCart: () => void
}

export const CartContext = createContext<cartContext>({
  cart: [],
  setCart: (cart: cartStoreItem[]) => {},
  refetchCart: () => {},
})

export default function CartProvider({
  children,
  initialCart,
}: {
  children: React.ReactNode
  initialCart: cartStoreItem[]
}) {
  const [cart, setCart] = useState<cartStoreItem[]>(initialCart)

  async function refetchCart() {
    const res = (
      await useClientFetch.get<cartItemApiResponse[] | null>(
        "/api/cart/current"
      )
    ).data
    if (res) {
      let cartItems: cartStoreItem[] = []
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
            await useClientFetch.get<storeApiResponse>(
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
      console.log(cartItems)
      setCart(cartItems)
    }
  }

  useEffect(() => {
    refetchCart()
  }, [])

  return (
    <CartContext.Provider value={{ cart, setCart, refetchCart }}>
      {children}
    </CartContext.Provider>
  )
}

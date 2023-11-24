"use client"

import { createContext } from "react"
import { useState } from "react"
import { useClientFetch } from "@/hooks/useClientFetch"
import { useEffect } from "react"
import { product, productApiResponse } from "@/interfaces/product"

type userContext = {
  wishlists: product[]
  setWishlists: (wishlist: product[]) => void
}

export const WishlistsContext = createContext<userContext>({
  wishlists: [],
  setWishlists: (wishlist: product[]) => {},
})

export default function WishlistsProvider({
  children,
  initialWishlists,
}: {
  children: React.ReactNode
  initialWishlists: product[]
}) {
  const [wishlists, setWishlists] = useState<product[]>(initialWishlists)

  async function getWIshlist() {
    try {
      return (
        await useClientFetch.get<productApiResponse[] | null>(
          "/api/wishlist/current"
        )
      ).data
    } catch (err) {
      console.log(err)
      return []
    }
  }

  useEffect(() => {
    getWIshlist().then((res) => {
      if (res) {
        setWishlists(
          res.map((wishlist) => ({
            id: wishlist.id,
            name: wishlist.name,
            description: wishlist.description,
            price: wishlist.price,
            stock: wishlist.stock,
            sold: wishlist.sold,
            images: wishlist.images,
            storeId: wishlist.store_id,
            createdAt: new Date(wishlist.created_at),
            updatedAt: new Date(wishlist.updated_at),
          }))
        )
      }
    })
  }, [])

  return (
    <WishlistsContext.Provider value={{ wishlists, setWishlists }}>
      {children}
    </WishlistsContext.Provider>
  )
}

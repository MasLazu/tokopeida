"use client"

import { createContext } from "react"
import { useState } from "react"
import { useClientFetch } from "@/hooks/useClientFetch"
import { useEffect } from "react"
import { store, storeApiResponse } from "@/interfaces/store"

type storeContext = {
  store: store | null | undefined
  setStore: (store: store | null) => void
}

export const StoreContext = createContext<storeContext>({
  store: null,
  setStore: (store: store | null) => {},
})

export default function StoreProvider({
  children,
  initialStore,
}: {
  children: React.ReactNode
  initialStore: store | null
}) {
  const [store, setStore] = useState<store | null | undefined>(initialStore)

  const storeSetter = (store: store | null) => setStore(store)

  async function getStore() {
    try {
      return (await useClientFetch.get<storeApiResponse>("/api/store/current"))
        .data
    } catch (err) {
      console.log(err)
      return null
    }
  }

  useEffect(() => {
    getStore().then((res) => {
      if (res) {
        setStore({
          id: res.id,
          name: res.name,
          createdAt: new Date(res.created_at),
          updatedAt: new Date(res.updated_at),
        })
      }
    })
  }, [])

  return (
    <StoreContext.Provider value={{ store: store, setStore: storeSetter }}>
      {children}
    </StoreContext.Provider>
  )
}

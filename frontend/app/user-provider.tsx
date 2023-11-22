"use client"

import { createContext } from "react"
import { useState } from "react"
import { useClientFetch } from "@/hooks/useClientFetch"
import { useEffect } from "react"
import { userApiResponse, user } from "@/interfaces/user"

type userContext = {
  user: user | null | undefined
  setUser: (user: user | null) => void
}

export const UserContext = createContext<userContext>({
  user: null,
  setUser: (user: user | null) => {},
})

export default function UserProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode
  initialUser: user | null
}) {
  const [user, setUser] = useState<user | null | undefined>(initialUser)

  async function getUser() {
    try {
      return (await useClientFetch.get<userApiResponse>("/api/user/current"))
        .data
    } catch (err) {
      console.log(err)
      return null
    }
  }

  useEffect(() => {
    getUser().then((res) => {
      if (res) {
        setUser({
          email: res.email,
          firstName: res.first_name,
          lastName: res.last_name,
          balance: res.balance,
          createdAt: new Date(res.created_at),
          updatedAt: new Date(res.updated_at),
        })
      }
    })
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

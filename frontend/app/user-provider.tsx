"use client"

import { createContext } from "react"
import { useState } from "react"
import { useClientFetch } from "@/hooks/useClientFetch"
import { useEffect } from "react"
import { userApiResponse, user } from "@/interfaces/user"
import { useToast } from "@/components/ui/use-toast"

type userContext = {
  user: user | null | undefined
  setUser: (user: user | null) => void
  refetchUser: () => void
}

export const UserContext = createContext<userContext>({
  user: null,
  setUser: (user: user | null) => {},
  refetchUser: () => {},
})

export default function UserProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode
  initialUser: user | null
}) {
  const [user, setUser] = useState<user | null | undefined>(initialUser)
  const { toast } = useToast()

  const refetchUser = async () => {
    console.log("prot")
    try {
      const result = (
        await useClientFetch.get<userApiResponse>("/api/user/current")
      ).data
      if (result) {
        setUser({
          email: result.email,
          firstName: result.first_name,
          lastName: result.last_name,
          balance: result.balance,
          createdAt: new Date(result.created_at),
          updatedAt: new Date(result.updated_at),
        })
      }
    } catch (err) {
      console.log(err)
      toast({
        title: "Error",
        description: "Something went wrong when fetching user data",
        duration: 3000,
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    refetchUser()
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser, refetchUser }}>
      {children}
    </UserContext.Provider>
  )
}

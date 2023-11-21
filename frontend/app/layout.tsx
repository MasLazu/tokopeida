import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import UserProvider from "@/app/user-provider"
import StoreProvider from "@/app/store-provider"
import { useGetServerContext } from "@/hooks/useGetServerContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tokopeida",
  description: "Generated by create next app",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, store } = await useGetServerContext()

  return (
    <html lang="en">
      <StoreProvider initialStore={store}>
        <UserProvider initialUser={user}>
          <body className={inter.className}>
            {children}
            <Toaster />
          </body>
        </UserProvider>
      </StoreProvider>
    </html>
  )
}

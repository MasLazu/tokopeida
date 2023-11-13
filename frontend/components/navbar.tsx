"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { FaMoneyBill1Wave } from "react-icons/fa6"
import { LuSettings2 } from "react-icons/lu"
import { AiOutlineHeart } from "react-icons/ai"
import { LuHistory } from "react-icons/lu"
import { BsCart4 } from "react-icons/bs"
import { VscGraph } from "react-icons/vsc"
import { AiOutlineAppstoreAdd } from "react-icons/ai"
import { MdOutlineLogout } from "react-icons/md"
import PopupSignin from "@/components/popup/signin"
import PopupSignup from "@/components/popup/signup"
import Link from "next/link"
import { UserContext } from "@/app/user-provider"
import { StoreContext } from "@/app/store-profider"
import { useContext } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useClientFetch } from "@/hooks/useClientFetch"
import PopupTopUp from "@/components/popup/topup"

export default function Navbar() {
  const { user, setUser } = useContext(UserContext)
  const { store, setStore } = useContext(StoreContext)
  const { toast } = useToast()

  async function handleSignout() {
    try {
      await useClientFetch.post("/api/auth/logout")
      sessionStorage.removeItem("access_token")
      setUser(null)
      setStore(null)
      toast({
        title: "Sign out success",
        description: `You have been signed out`,
      })
    } catch (error) {
      toast({
        title: "Sign out failed",
        description: `Something went wrong, please try again later`,
      })
      console.log(error)
    }
  }

  return (
    <nav className="bg-background/80 backdrop-blur-lg sticky top-0 z-50">
      <div className="flex items-center justify-between p-4 gap-8">
        <Link
          href="/"
          className="font-bold hidden sm:block text-foreground text-lg"
        >
          Tokopeida
        </Link>
        <Input
          placeholder="Search"
          className="lg:max-w-4xl bg-background/80 backdrop-blur-lg"
        />
        <div className="flex items-center gap-4">
          {user ? (
            <Sheet>
              <SheetTrigger asChild className="cursor-pointer">
                <div className="flex items-center gap-3">
                  <h2 className="text-foreground sm:text-base text-sm">
                    {user.firstName}
                  </h2>
                  <Avatar className="hover:outline outline-2 outline-foreground">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
              </SheetTrigger>
              <SheetContent className="flex flex-col justify-between">
                <div>
                  <SheetHeader>
                    <SheetTitle>Profile</SheetTitle>
                  </SheetHeader>
                  <div className="user-profile my-2">
                    <Separator orientation="horizontal" className="mb-3" />
                    <div className="flex items-center gap-4">
                      <Avatar className="h-14 w-14">
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt="@shadcn"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div className="text-foreground flex-grow overflow-hidden">
                        <div className="name font-semibold text-xl truncate">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="flex gap-3 items-center font-semibold text-muted-foreground">
                          <FaMoneyBill1Wave className="text-emerald-600 text-lg" />
                          Rp. {user.balance}
                        </div>
                      </div>
                      <Button variant="outline" size="icon" className="px-2.5">
                        <LuSettings2 className="text-lg" />
                      </Button>
                    </div>
                    <Separator orientation="horizontal" className="mt-3" />
                  </div>
                  <div className="py-2">
                    <ul className="flex flex-col gap-1 text-gray-600">
                      {store ? (
                        <li className="flex gap-4 items-center px-2 py-2.5 rounded-md hover:bg-gray-100 cursor-pointer">
                          <VscGraph className="text-lg" />
                          Dashboard Store
                        </li>
                      ) : (
                        <li className="flex gap-4 items-center px-2 py-2.5 rounded-md hover:bg-gray-100 cursor-pointer">
                          <AiOutlineAppstoreAdd className="text-lg" />
                          Create Store
                        </li>
                      )}
                      <li className="flex gap-4 items-center px-2 py-2.5 rounded-md hover:bg-gray-100 cursor-pointer">
                        <AiOutlineHeart className="text-lg" />
                        Wishlist
                      </li>
                      <PopupTopUp />
                      <li className="flex gap-4 items-center px-2 py-2.5 rounded-md hover:bg-gray-100 cursor-pointer">
                        <LuHistory className="text-lg" />
                        Transaction history
                      </li>
                      <li className="flex gap-4 items-center px-2 py-2.5 rounded-md hover:bg-gray-100 cursor-pointer">
                        <BsCart4 className="text-lg" /> Cart
                      </li>
                    </ul>
                  </div>
                </div>
                <Button
                  className="flex gap-2 p-2 cursor-pointer w-full"
                  variant="destructive"
                  onClick={handleSignout}
                >
                  <MdOutlineLogout className="text-lg" /> Sign Out
                </Button>
              </SheetContent>
            </Sheet>
          ) : (
            <div className="flex gap-3">
              <PopupSignin />
              <PopupSignup />
            </div>
          )}
        </div>
      </div>
      <Separator orientation="horizontal" />
    </nav>
  )
}

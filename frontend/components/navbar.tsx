"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { MdOutlineLogout } from "react-icons/md"
import PopupSignin from "@/components/popup/signin"
import PopupSignup from "@/components/popup/signup"
import Link from "next/link"
import { UserContext } from "@/app/user-provider"
import { StoreContext } from "@/app/store-provider"
import { useContext, useState, KeyboardEvent, use } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useClientFetch } from "@/hooks/useClientFetch"
import PopupTopUp from "@/components/popup/topup"
import PopupCreateStore from "@/components/popup/create-store"
import { CartContext } from "@/app/cart-provider"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { productApiResponse } from "@/interfaces/product"
import { useRouter, usePathname } from "next/navigation"
import { useSearchParams } from "next/navigation"

export default function Navbar() {
  const { user, setUser } = useContext(UserContext)
  const { store, setStore } = useContext(StoreContext)
  const { cart } = useContext(CartContext)
  const [isOpen, setIsOpen] = useState(false)
  const [suggestion, setSuggestion] = useState<string[]>([])
  const [keyword, setKeyword] = useState<string>(
    useSearchParams().get("keyword") ?? ""
  )
  const { toast } = useToast()
  const router = useRouter()

  async function handleSignout() {
    try {
      await useClientFetch.post("/api/auth/logout")
      sessionStorage.removeItem("access_token")
      setUser(null)
      setStore(null)
      toast({
        title: "Sign out success",
        description: `You have been signed out`,
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: "Sign out failed",
        description: `Something went wrong, please try again later`,
        duration: 3000,
      })
      console.log(error)
    }
  }

  function getCartCount() {
    let count = 0
    cart.forEach((cartStoreItem) => {
      cartStoreItem.items.forEach((item) => {
        count += item.quantity
      })
    })
    return count
  }

  async function getSuggestion(keyword: string) {
    setKeyword(keyword)
    if (keyword === "") return setSuggestion([])
    try {
      const res = await useClientFetch.get<productApiResponse[] | null>(
        `/api/product/search/${keyword}?limit=8`
      )
      if (res.data) {
        setSuggestion(res.data.map((product) => product.name))
      }
    } catch (err) {
      setSuggestion([])
      console.log(err)
    }
  }

  function handleSearch() {
    if (keyword === "") return
    router.push(`/search?keyword=${keyword}`)
  }

  const handleEnterKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
    if (e.key === "Escape") {
      ;(e.target as HTMLInputElement).blur()
    }
  }

  return (
    <nav className="bg-background/80 backdrop-blur-lg sticky top-0 z-50">
      <div className="flex items-center justify-between p-3.5 gap-8">
        <Link
          href="/"
          className="font-bold hidden sm:block text-foreground text-lg"
        >
          Tokopeida
        </Link>
        <div className="relative w-8/12 h-10 rounded-md">
          <Command
            className={`absolute min-w-fit rounded-lg border top-0 ${
              isOpen ? "shadow-md" : null
            }`}
          >
            <CommandInput
              value={keyword}
              placeholder="Type to search..."
              onFocus={() => setIsOpen(true)}
              onBlur={() => setIsOpen(false)}
              onValueChange={getSuggestion}
              onKeyDown={handleEnterKeyPress}
            />
            {isOpen ? (
              <CommandList>
                {!suggestion.includes(keyword) ? (
                  <CommandItem>{keyword}</CommandItem>
                ) : null}
                {suggestion.map((keyword, i) => (
                  <CommandItem
                    onSelect={() => {
                      setKeyword(keyword)
                      handleSearch()
                    }}
                    key={i}
                  >
                    <span>{keyword}</span>
                  </CommandItem>
                ))}
              </CommandList>
            ) : null}
          </Command>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <Sheet>
              <SheetTrigger asChild className="cursor-pointer">
                <div className="flex items-center gap-3">
                  <h2 className="text-foreground sm:text-base text-sm">
                    {user.firstName}
                  </h2>
                  <Avatar className="hover:outline outline-2 outline-foreground">
                    <AvatarFallback className="bg-blue-400 font-semibold text-background">
                      CN
                    </AvatarFallback>
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
                        <AvatarFallback className="bg-blue-400 font-semibold text-background">
                          CN
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-foreground flex-grow overflow-hidden">
                        <div className="name font-semibold text-xl truncate">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="flex gap-3 items-center font-semibold text-muted-foreground md:text-base text-sm">
                          <FaMoneyBill1Wave className="text-emerald-600 text-lg min-w-fit" />
                          <span className="truncate">
                            Rp.{" "}
                            {user.balance.toLocaleString().replace(/,/g, ".")}
                          </span>
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
                        <Link href="/store/dashboard/home">
                          <li className="flex gap-4 items-center px-2 py-2.5 rounded-md hover:bg-gray-100 cursor-pointer">
                            <VscGraph className="text-lg" />
                            Dashboard Store
                          </li>
                        </Link>
                      ) : (
                        <PopupCreateStore />
                      )}
                      <Link href="/wishlist">
                        <li className="flex gap-4 items-center px-2 py-2.5 rounded-md hover:bg-gray-100 cursor-pointer">
                          <AiOutlineHeart className="text-lg" />
                          Wishlist
                        </li>
                      </Link>
                      <PopupTopUp />
                      <Link href="/transaction">
                        <li className="flex gap-4 items-center px-2 py-2.5 rounded-md hover:bg-gray-100 cursor-pointer">
                          <LuHistory className="text-lg" />
                          Transaction history
                        </li>
                      </Link>
                      <Link href="/cart">
                        <li className="flex gap-4 items-center px-2 py-2.5 rounded-md hover:bg-gray-100 cursor-pointer relative">
                          <BsCart4 className="text-lg" />
                          <Badge
                            className="absolute left-4 top-1 py-0 px-1"
                            variant="destructive"
                          >
                            {getCartCount()}
                          </Badge>
                          Cart
                        </li>
                      </Link>
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

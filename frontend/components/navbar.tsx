import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { FaMoneyBill1Wave } from "react-icons/fa6"
import { LuSettings2 } from "react-icons/lu"
import { AiOutlineHeart } from "react-icons/ai"
import { PiMoney } from "react-icons/pi"
import { LuHistory } from "react-icons/lu"
import { BsCart4 } from "react-icons/bs"
import { VscGraph } from "react-icons/vsc"
import { MdOutlineLogout } from "react-icons/md"
import PopupSignin from "@/components/popup/signin"
import PopupSignup from "@/components/popup/signup"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function Navbar() {
  return (
    <nav className="bg-foreground sticky top-0 z-50">
      <div className="flex items-center justify-between p-4 gap-8">
        <div className="flex items-center gap-4 text-lg">
          <a href="/" className="font-bold text-background">
            Tokopeida
          </a>
        </div>
        <Input placeholder="Search" />
        <div className="flex items-center gap-4">
          {/* <PopupSignin />
          <PopupSignup /> */}
          <Sheet>
            <SheetTrigger asChild className="cursor-pointer">
              <div className="flex items-center gap-3">
                <h2 className="text-background">Yanto</h2>
                <Avatar className="hover:outline outline-2 outline-muted-foreground">
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
                        Yanto Suprianto
                      </div>
                      <div className="flex gap-3 items-center font-semibold text-muted-foreground">
                        <FaMoneyBill1Wave className="text-emerald-600 text-lg" />
                        Rp. 50.000
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
                    <li className="flex gap-4 items-center px-2 py-2.5 rounded-md hover:bg-gray-100 cursor-pointer">
                      <VscGraph className="text-lg" />
                      Dashboard Store
                    </li>
                    <li className="flex gap-4 items-center px-2 py-2.5 rounded-md hover:bg-gray-100 cursor-pointer">
                      <AiOutlineHeart className="text-lg" />
                      Wishlist
                    </li>
                    <li className="flex gap-4 items-center px-2 py-2.5 rounded-md hover:bg-gray-100 cursor-pointer">
                      <PiMoney className="text-lg" /> Top up balance
                    </li>
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
              >
                <MdOutlineLogout className="text-lg" /> Sign Out
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {/* <Separator orientation="horizontal" /> */}
    </nav>
  )
}

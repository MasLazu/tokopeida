"use client"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FaStar } from "react-icons/fa"
import { LuSettings2 } from "react-icons/lu"
import { Button } from "@/components/ui/button"
import { BsCart4 } from "react-icons/bs"
import { HiOutlineHome } from "react-icons/hi"
import { IoChatboxEllipsesOutline } from "react-icons/io5"
import { MdNotes } from "react-icons/md"
import { TbPresentationAnalytics } from "react-icons/tb"
import { MdOutlineLogout } from "react-icons/md"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Home",
      icon: <HiOutlineHome className="text-lg" />,
      href: "/store/dashboard/home",
    },
    {
      title: "Analytics",
      icon: <TbPresentationAnalytics className="text-lg" />,
      href: "/store/dashboard/analytics",
    },
    {
      title: "Chats",
      icon: <IoChatboxEllipsesOutline className="text-lg" />,
      href: "/store/dashboard/chats",
    },
    {
      title: "Products",
      icon: <BsCart4 className="text-lg" />,
      href: "/store/dashboard/products",
    },
    {
      title: "Transactions",
      icon: <MdNotes className="text-lg" />,
      href: "/store/dashboard/transactions",
    },
  ]

  return (
    <div className={cn("border-r p-4 h-full flex flex-col", className)}>
      <Link
        href={navItems[0].href}
        className="font-bold hidden sm:block text-foreground text-xl mb-6"
      >
        Tokopeida{" "}
        <span className="text-muted-foreground text-sm font-light">Store</span>
      </Link>
      <div className="flex items-center justify-between gap-3 mb-10">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-foreground sm:text-base text-sm truncate font-semibold">
              Sunda empire
            </h2>
            <div className="flex gap-0.5">
              <FaStar className="text-amber-400 w-4 h-4" />
              <FaStar className="text-amber-400 w-4 h-4" />
              <FaStar className="text-amber-400 w-4 h-4" />
              <FaStar className="text-slate-200 w-4 h-4" />
              <FaStar className="text-slate-200 w-4 h-4" />
            </div>
          </div>
        </div>
        <Button variant="outline" size="icon" className="px-2.5">
          <LuSettings2 className="text-lg" />
        </Button>
      </div>
      <div className="flex flex-col justify-between grow">
        <div className="flex flex-col gap-3 text-gray-600">
          {navItems.map((item) =>
            pathname === item.href ? (
              <Link
                href={item.href}
                className="flex gap-4 items-center px-4 py-2.5 rounded-lg bg-foreground text-background cursor-pointer"
              >
                {item.icon}
                {item.title}
              </Link>
            ) : (
              <Link
                href={item.href}
                className="flex gap-4 items-center px-4 py-2.5 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                {item.icon}
                {item.title}
              </Link>
            )
          )}
        </div>
        <Button
          className="flex gap-2 p-2 cursor-pointer w-full"
          variant="destructive"
        >
          <MdOutlineLogout className="text-lg" /> Quit Dashboard
        </Button>
      </div>
    </div>
  )
}
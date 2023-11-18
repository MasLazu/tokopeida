"use client"

import { PiMoney } from "react-icons/pi"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import TopUpFrom from "@/components/form/topup"
import { useState } from "react"

export default function TopUpPopup() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <li className="flex gap-4 items-center px-2 py-2.5 rounded-md hover:bg-gray-100 cursor-pointer">
          <PiMoney className="text-lg" /> Top up balance
        </li>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl">Top up balance</DialogTitle>
        </DialogHeader>
        <TopUpFrom stateSetter={setIsOpen} />
      </DialogContent>
    </Dialog>
  )
}

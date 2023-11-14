"use client"

import { AiOutlineAppstoreAdd } from "react-icons/ai"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import CreateStoreFrom from "@/components/form/create-store"
import { useState } from "react"

export default function PopupCreateStore() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <li className="flex gap-4 items-center px-2 py-2.5 rounded-md hover:bg-gray-100 cursor-pointer">
          <AiOutlineAppstoreAdd className="text-lg" /> Create Store
        </li>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl">Create Store</DialogTitle>
        </DialogHeader>
        <CreateStoreFrom stateSetter={setIsOpen} />
      </DialogContent>
    </Dialog>
  )
}

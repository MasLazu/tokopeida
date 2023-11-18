"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import AddProductFrom from "../form/add-product"
import { useState } from "react"

export default function AddProductPopup() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button>+ Add Product</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl">Add Product</DialogTitle>
          <DialogDescription>
            Fill form below with your product data
          </DialogDescription>
        </DialogHeader>
        <AddProductFrom stateSetter={setIsOpen} />
      </DialogContent>
    </Dialog>
  )
}

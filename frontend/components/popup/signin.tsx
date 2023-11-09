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
import SignInFrom from "@/components/form/signin"
import { useState } from "react"

export default function PopupSignin() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Sign in</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl">Sign in</DialogTitle>
          <DialogDescription>
            Enter your credentilas below to sign in
          </DialogDescription>
        </DialogHeader>
        <SignInFrom stateSetter={setIsOpen} />
      </DialogContent>
    </Dialog>
  )
}

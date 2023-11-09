import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import SignUpFrom from "@/components/form/signup"

export default function PopupSignup() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Sign up
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl">Sign up</DialogTitle>
          <DialogDescription>
            Fill form below with your data to create an account
          </DialogDescription>
        </DialogHeader>
        <SignUpFrom stateSetter={setIsOpen} />
      </DialogContent>
    </Dialog>
  )
}

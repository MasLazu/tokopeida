import { Button } from "@/components/ui/button"
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
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Sign up</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl">Sign up</DialogTitle>
          <DialogDescription>
            Fill form below with your data to create an account
          </DialogDescription>
        </DialogHeader>
        <SignUpFrom />
      </DialogContent>
    </Dialog>
  )
}

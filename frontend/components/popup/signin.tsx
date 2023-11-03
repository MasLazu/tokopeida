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

export default function PopupSignin() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Sign in</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl">Sign in</DialogTitle>
          <DialogDescription>
            Enter your credentilas below to sign in
          </DialogDescription>
        </DialogHeader>
        <SignInFrom />
      </DialogContent>
    </Dialog>
  )
}

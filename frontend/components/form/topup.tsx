"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useToast } from "@/components/ui/use-toast"
import * as z from "zod"
import { UserContext } from "@/app/user-provider"
import { useContext } from "react"
import { useClientFetch } from "@/hooks/useClientFetch"
import { userApiResponse } from "@/interfaces/user"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
  amount: z.string().min(1, { message: "Amount is required" }),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  stateSetter?: (state: boolean) => void
}

export default function SignInFrom({
  className,
  stateSetter,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const { user, setUser } = useContext(UserContext)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    const formData = new FormData()
    formData.append("amount", values.amount.toString())

    try {
      const balance = (
        await useClientFetch.post<userApiResponse>(
          "/api/user/current/topup",
          formData
        )
      ).data.balance

      setUser({
        ...user!,
        balance: balance,
      })

      toast({
        title: "Topup Success",
        description: `Your balance has been topped up by Rp. ${values.amount}`,
      })
      if (stateSetter) stateSetter(false)
    } catch (error) {
      console.log(error)
      toast({
        variant: "destructive",
        title: "Topup Failed",
        description: `Something went wrong, please try again later`,
      })
    }

    setIsLoading(false)
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-5">
            <FormField
              name="amount"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="amount" className="text-foreground">
                    Amount
                  </FormLabel>
                  <Input
                    {...field}
                    id="amount"
                    type="number"
                    disabled={isLoading}
                  />
                  <FormMessage id="amount-message" />
                </FormItem>
              )}
            />
            <Button disabled={isLoading} className="mt-7">
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Top Up
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

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
import { storeApiResponse } from "@/interfaces/store"
import { StoreContext } from "@/app/store-provider"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
  email: z.string().email({ message: "Email must be a valid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
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
  const { setUser } = useContext(UserContext)
  const { setStore } = useContext(StoreContext)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    const formData = new FormData()
    formData.append("email", values.email)
    formData.append("password", values.password)

    try {
      const accessToken = (
        await useClientFetch.post<{ access_token: string }>(
          "/api/auth/login",
          formData
        )
      ).data.access_token
      sessionStorage.setItem("access_token", accessToken)

      const user = (
        await useClientFetch.get<userApiResponse>("/api/user/current")
      ).data
      setUser({
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        balance: user.balance,
        createdAt: new Date(user.created_at),
        updatedAt: new Date(user.updated_at),
      })

      const storeResponse = (
        await useClientFetch.get<storeApiResponse>("/api/store/current")
      ).data
      setStore({
        id: storeResponse.id,
        name: storeResponse.name,
        city: storeResponse.city,
        createdAt: new Date(storeResponse.created_at),
        updatedAt: new Date(storeResponse.updated_at),
      })

      toast({
        title: "Sign in Success",
        description: `Hello ${user.first_name} ${user.last_name}, welcome to Tokopeida!`,
        duration: 3000,
      })
      if (stateSetter) stateSetter(false)
    } catch (error) {
      console.log(error)
      toast({
        variant: "destructive",
        title: "Sign in Failed",
        description: `Please check your email and password`,
        duration: 3000,
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
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email" className="text-foreground">
                    Email
                  </FormLabel>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                  />
                  <FormMessage id="email-message" />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="password" className="text-foreground">
                    Password
                  </FormLabel>
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    autoCapitalize="none"
                    autoCorrect="off"
                    disabled={isLoading}
                  />
                  <FormMessage id="password-message" />
                </FormItem>
              )}
            />
            <Button disabled={isLoading} className="mt-7">
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign In
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

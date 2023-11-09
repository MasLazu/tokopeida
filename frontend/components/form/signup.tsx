"use client"

import * as React from "react"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useContext } from "react"
import { UserContext } from "@/app/user-provider"
import { useToast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useClientFetch } from "@/hooks/useClientFetch"
import { userApiResponse } from "@/interfaces/user"
import { AxiosError } from "axios"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
  email: z.string().email({ message: "Email must be a valid email" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  stateSetter?: (state: boolean) => void
}

export default function SignUpFrom({
  className,
  stateSetter,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const { setUser } = useContext(UserContext)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    const formData = new FormData()
    formData.append("email", values.email)
    formData.append("password", values.password)
    formData.append("first_name", values.firstName)
    formData.append("last_name", values.lastName)

    try {
      await useClientFetch.post("/api/user", formData)

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
      toast({
        title: "Sign up Success",
        description: `Hello ${user.first_name} ${user.last_name}, welcome to Tokopeida!`,
      })
      if (stateSetter) stateSetter(false)
    } catch (err) {
      const error = err as AxiosError<{ message: string }>
      toast({
        variant: "destructive",
        title: "Sign up Failed",
        description: `${error.response?.data.message}`,
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
              name="firstName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="firstname" className="text-foreground">
                    First Name
                  </FormLabel>
                  <Input
                    {...field}
                    id="firstname"
                    type="text"
                    autoCapitalize="none"
                    autoCorrect="off"
                    disabled={isLoading}
                  />
                  <FormMessage id="firstname-message" />
                </FormItem>
              )}
            />
            <FormField
              name="lastName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="lastname" className="text-foreground">
                    Last Name
                  </FormLabel>
                  <Input
                    {...field}
                    id="lastname"
                    type="text"
                    autoCapitalize="none"
                    autoCorrect="off"
                    disabled={isLoading}
                  />
                  <FormMessage id="lastname-message" />
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
              Sign Up
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

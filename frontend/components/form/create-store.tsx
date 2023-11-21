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
import { StoreContext } from "@/app/store-provider"
import { useContext } from "react"
import { useClientFetch } from "@/hooks/useClientFetch"
import { storeApiResponse } from "@/interfaces/store"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  stateSetter?: (state: boolean) => void
}

export default function CreateStoreFrom({
  className,
  stateSetter,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const { setStore } = useContext(StoreContext)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    const formData = new FormData()
    formData.append("name", values.name)

    try {
      const store = (
        await useClientFetch.post<storeApiResponse>(
          "/api/store/current",
          formData
        )
      ).data

      setStore({
        id: store.id,
        name: store.name,
        createdAt: new Date(store.created_at),
        updatedAt: new Date(store.updated_at),
      })

      toast({
        title: "Create Store Success",
        description: `Your store has been created with name ${values.name}`,
        duration: 3000,
      })
      if (stateSetter) stateSetter(false)
    } catch (error) {
      console.log(error)
      toast({
        variant: "destructive",
        title: "Create Store Failed",
        description: `Something went wrong, please try again later`,
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
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name" className="text-foreground">
                    Name
                  </FormLabel>
                  <Input
                    {...field}
                    id="name"
                    type="text"
                    disabled={isLoading}
                  />
                  <FormMessage id="name-message" />
                </FormItem>
              )}
            />
            <Button disabled={isLoading} className="mt-7">
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Store
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

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
import { Textarea } from "@/components/ui/textarea"
import { useState, useCallback, useEffect } from "react"
import { useDropzone, FileRejection } from "react-dropzone"
import { IoCloudUploadOutline } from "react-icons/io5"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { RxCross2 } from "react-icons/rx"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
  name: z.string().min(3, { message: "name must be at least 3 characters" }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters",
  }),
  price: z.string().regex(/^\d+$/, {
    message: "Price must be a valid number",
  }),
  stock: z.string().regex(/^\d+$/, {
    message: "Stock must be a valid number",
  }),
})

interface FileWithPreview extends File {
  preview: string
}

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  stateSetter?: (state: boolean) => void
}

export default function AddProductFrom({
  className,
  stateSetter,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const { setUser } = useContext(UserContext)
  const { setStore } = useContext(StoreContext)
  const { toast } = useToast()

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (acceptedFiles?.length) {
        setFiles((previousFiles) => [
          ...previousFiles,
          ...acceptedFiles.map((file) =>
            Object.assign(file, { preview: URL.createObjectURL(file) })
          ),
        ])
      }
      if (rejectedFiles?.length) {
        rejectedFiles.forEach(({ file, errors }) => {
          toast({
            variant: "destructive",
            title: `Error upoading ${file.name}`,
            description: errors[0].message,
          })
        })
      }
    },
    []
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxSize: 1024 * 1000,
    onDrop,
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      stock: "",
    },
  })

  const removeFile = (name: string) => {
    setFiles((files) => files.filter((file) => file.name !== name))
  }

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview))
  }, [files])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    const formData = new FormData()
    formData.append("name", values.name)
    formData.append("description", values.description)
    formData.append("price", values.price)
    formData.append("stock", values.stock)
    files.forEach((file) => formData.append("images", file))

    try {
      const response = (
        await useClientFetch.post<any>("/api/store/current/product", formData)
      ).data

      toast({
        title: "Add Product Success",
        description: `Product ${response.name} has been added`,
      })

      if (stateSetter) stateSetter(false)
    } catch (error) {
      console.log(error)
      toast({
        variant: "destructive",
        title: "Add Product Failed",
        description: `Please check your data`,
      })
    }

    setIsLoading(false)
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel htmlFor="name" className="text-foreground">
                    Name
                  </FormLabel>
                  <Input
                    {...field}
                    id="name"
                    type="text"
                    autoCapitalize="none"
                    autoCorrect="off"
                    disabled={isLoading}
                  />
                  <FormMessage id="name-message" />
                </FormItem>
              )}
            />
            <FormField
              name="stock"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="stock" className="text-foreground">
                    Stock
                  </FormLabel>
                  <Input
                    {...field}
                    id="stock"
                    type="number"
                    autoCapitalize="none"
                    autoCorrect="off"
                    disabled={isLoading}
                  />
                  <FormMessage id="stock-message" />
                </FormItem>
              )}
            />
            <FormField
              name="price"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="price" className="text-foreground">
                    Price
                  </FormLabel>
                  <Input
                    {...field}
                    id="price"
                    type="number"
                    autoCapitalize="none"
                    autoCorrect="off"
                    disabled={isLoading}
                  />
                  <FormMessage id="price-message" />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel htmlFor="description" className="text-foreground">
                    Description
                  </FormLabel>
                  <Textarea
                    {...field}
                    id="description"
                    autoCapitalize="none"
                    disabled={isLoading}
                  />
                  <FormMessage id="descripion-message" />
                </FormItem>
              )}
            />
            <div
              {...getRootProps({
                className:
                  "col-span-2 h-32 border-2 rounded-lg text-muted-foreground bg-gray-100 border-dashed",
              })}
            >
              <input {...getInputProps()} />
              <div className="flex justify-center items-center h-full w-full text-sm">
                {files.length ? (
                  <ul className="flex flex-wrap gap-4">
                    {files.map((file) => (
                      <li
                        key={file.name}
                        className="relative h-20 rounded-md border-2"
                      >
                        <Image
                          src={file.preview}
                          alt={file.name}
                          width={50}
                          height={50}
                          onLoad={() => {
                            URL.revokeObjectURL(file.preview)
                          }}
                          className="h-full w-full object-contain rounded-md"
                        />
                        <Badge
                          variant="destructive"
                          className="absolute -top-2 -right-2 text-xs p-0.5 cursor-pointer"
                          onClick={(e) => {
                            removeFile(file.name)
                            e.stopPropagation()
                          }}
                        >
                          <RxCross2 />
                        </Badge>
                      </li>
                    ))}
                  </ul>
                ) : isDragActive ? (
                  <>
                    <IoCloudUploadOutline className="text-3xl mx-3" />
                    <p>Drop the images here...</p>
                  </>
                ) : (
                  <>
                    <IoCloudUploadOutline className="text-3xl mx-3" />
                    <p>Drag & drop images here, or click to select images</p>
                  </>
                )}
              </div>
            </div>
            <Button disabled={isLoading} className="mt-7 col-span-2">
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Add Product
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button"
import ProductImageCarosel from "../product-image-carosel"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FiMinus, FiPlus } from "react-icons/fi"
import { useClientFetch } from "@/hooks/useClientFetch"
import { product } from "@/interfaces/product"
import { useToast } from "../ui/use-toast"
import { AxiosError } from "axios"

type variant = "buy" | "add-to-cart"

export default function BuyProductPopup({
  product,
  variant,
}: {
  product: product
  variant: variant
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [amount, setAmount] = useState(1)
  const { toast } = useToast()

  async function buyProduct() {
    const formData = new FormData()
    formData.append("quantity", amount.toString())

    try {
      const result = await useClientFetch.post(
        `/api/product/${product.id}/buy`,
        formData
      )
      toast({
        title: "Success",
        description: "Your transaction has been created",
        duration: 3000,
      })
      console.log(result)
    } catch (err) {
      const error = err as AxiosError<{ message: string }>
      toast({
        title: "Error",
        description:
          error.response?.data.message.toString() ?? "Something went wrong",
        variant: "destructive",
        duration: 3000,
      })
      console.log(err)
    }
  }

  async function addToCart() {
    const formData = new FormData()
    formData.append("quantity", amount.toString())
    formData.append("product_id", product.id)

    try {
      const result = await useClientFetch.post("/api/cart", formData)
      toast({
        title: "Success",
        description: "Your product has been added to cart",
        duration: 3000,
      })
      console.log(result)
    } catch (err) {
      const error = err as AxiosError<{ message: string }>
      toast({
        title: "Error",
        description:
          error.response?.data.message.toString() ?? "Something went wrong",
        variant: "destructive",
        duration: 3000,
      })
      console.log(err)
    }
  }

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        {variant === "buy" ? (
          <Button
            size="lg"
            className="flex gap-4 items-center px-2 py-2.5 rounded-md cursor-pointer"
          >
            Buy Now
          </Button>
        ) : (
          <Button
            size="lg"
            variant={"outline"}
            className="flex gap-4 items-center px-2 py-2.5 rounded-md cursor-pointer"
          >
            Add to Cart
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.name}</DialogTitle>
        </DialogHeader>
        <Card className="max-w-[375px] sm:block hidden">
          <ProductImageCarosel filenames={product.images} />
        </Card>
        <div className="flex items-center justify-between">
          Quantity
          <div className="flex gap-1 items-center">
            <Button
              onClick={() => setAmount((prev) => (prev > 0 ? prev - 1 : prev))}
              size="icon"
              className="lg:h-9 lg:w-6 h-7 w-4"
            >
              <FiMinus className="w-3 h-3 text-background" />
            </Button>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="lg:h-9 h-7 w-12 text-center"
            />
            <Button
              onClick={() => setAmount((prev) => prev + 1)}
              size="icon"
              className="lg:h-9 lg:w-6 h-7 w-4"
            >
              <FiPlus className="w-3 h-3 text-background" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button onClick={() => buyProduct()}>Buy Now</Button>
          <Button onClick={() => addToCart()} variant="outline">
            Add to Cart
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

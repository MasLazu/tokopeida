"use client"

import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import StoreItems from "@/components/cart/store-items"
import { Button } from "@/components/ui/button"
import ProductSlider from "@/components/product-slider"
import { product } from "@/interfaces/product"
import { useContext } from "react"
import { CartContext } from "@/app/cart-provider"
import EmptyIllustration from "@/assets/empty-illustration.png"
import Image from "next/image"
import { useClientFetch } from "@/hooks/useClientFetch"
import { useToast } from "@/components/ui/use-toast"
import { cartStoreItem } from "@/app/cart-provider"
import { AxiosError } from "axios"
import { useState } from "react"
import { Icons } from "@/components/ui/icons"

export default function CartPage({ products }: { products: product[] }) {
  const { cart, setCart } = useContext(CartContext)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { toast } = useToast()

  function getTotalPrice() {
    let total = 0
    cart.forEach((cartStoreItem) => {
      cartStoreItem.items.forEach((item) => {
        if (item.selected) {
          total += item.quantity * item.product.price
        }
      })
    })
    return total
  }

  function isNoSelected() {
    let noSelected = true
    cart.forEach((cartStoreItem) => {
      cartStoreItem.items.forEach((item) => {
        if (item.selected) noSelected = false
      })
    })
    return noSelected
  }

  async function handleBuy() {
    setIsLoading(true)
    const cartItems: {
      transactions: {
        product_id: string
        quantity: number
      }[]
    } = { transactions: [] }
    cart.forEach((cartStoreItem) => {
      cartStoreItem.items.forEach((item) => {
        if (item.selected) {
          cartItems.transactions.push({
            product_id: item.product.id,
            quantity: item.quantity,
          })
        }
      })
    })
    try {
      await useClientFetch.post("/api/product/buy-multiple", cartItems)

      cartItems.transactions.forEach(async (transaction) => {
        await useClientFetch.delete(`/api/cart/${transaction.product_id}`)
      })

      let temp: cartStoreItem[] = [...cart]
      temp.forEach((cartStoreItem, i) => {
        const newCartStoreItem = cartStoreItem.items.filter(
          (item) => !item.selected
        )
        temp[i].items = newCartStoreItem
      })
      temp = temp.filter((cartStoreItem) => cartStoreItem.items.length !== 0)
      setCart(temp)
      toast({
        title: "Success!",
        description: "You have successfully bought the products",
        duration: 3000,
      })
    } catch (error) {
      console.log(error)
      const err = error as AxiosError<{ message: string }>
      toast({
        title: "Error!",
        description: err.response?.data.message,
        duration: 3000,
      })
    }
    setIsLoading(false)
  }

  return (
    <main className="container">
      {cart.length === 0 ? (
        <div className="w-full flex flex-col justify-center items-center h-96">
          <Image
            src={EmptyIllustration}
            alt="Empty Illustration"
            width={200}
            height={200}
          />
          <p className="mt-4">Your cart is still empty,</p>
          <p>If there is something that suits for you just add it here!</p>
        </div>
      ) : (
        <div className="lg:grid lg:grid-cols-7 gap-x-8">
          <Card className="col-span-5 p-5">
            <h1 className="m:text-2xl text-xl font-semibold mb-5">
              Shopping Cart
            </h1>
            {cart.map((cartStoreItem, index) => (
              <StoreItems key={index} cartStoreItem={cartStoreItem} />
            ))}
          </Card>
          <Card className="col-span-2 p-5 self-start mt-6 lg:mt-0">
            <h2 className="text-xl font-semibold">Summary</h2>
            <Separator className="my-4" />
            <div className="flex flex-col gap-3">
              {cart.map((cartStoreItem) =>
                cartStoreItem.items.map((cartItem) => {
                  if (cartItem.selected) {
                    return (
                      <div className="flex justify-between gap-2">
                        <span className="text-sm truncate">
                          {cartItem.product.name}
                        </span>
                        <span className="text-sm min-w-fit">
                          {`${cartItem.quantity} x Rp. ${cartItem.product.price
                            .toLocaleString()
                            .replace(/,/g, ".")}`}
                        </span>
                      </div>
                    )
                  } else {
                    return null
                  }
                })
              )}
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">
                Rp. {getTotalPrice().toLocaleString().replace(/,/g, ".")}
              </span>
            </div>
            <Button
              className="w-full mt-5"
              disabled={isNoSelected() || isLoading}
              onClick={() => handleBuy()}
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Buy
            </Button>
          </Card>
        </div>
      )}

      <ProductSlider
        title="Make your wishlist come true"
        className="col-span-7"
        productsData={products}
      />
      <ProductSlider
        title="For you"
        className="col-span-7"
        productsData={products}
      />
    </main>
  )
}

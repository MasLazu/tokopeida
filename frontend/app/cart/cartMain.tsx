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

export default function CartPage({ products }: { products: product[] }) {
  const { cart } = useContext(CartContext)

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
            <Button className="w-full mt-5" disabled={isNoSelected()}>
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

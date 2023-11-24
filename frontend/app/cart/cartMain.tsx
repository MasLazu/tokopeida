"use client"

import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import StoreItems from "@/components/cart/store-items"
import { Button } from "@/components/ui/button"
import ProductSlider from "@/components/product-slider"
import { cartStoreItem } from "@/app/cart-provider"
import { product } from "@/interfaces/product"
import { useState, useContext, useEffect } from "react"
import { CartContext } from "@/app/cart-provider"
import EmptyIllustration from "@/assets/empty-illustration.png"
import Image from "next/image"

export default function CartPage({
  products,
  cartInit,
}: {
  products: product[]
  cartInit: cartStoreItem[]
}) {
  const { cart } = useContext(CartContext)
  const [cartItems, setCartItems] = useState<cartStoreItem[]>(cartInit)
  useEffect(() => {
    setCartItems(cart)
  }, [cart])
  console.log(cartItems)

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
            <div className="flex gap-5">
              <div className="flex items-center space-x-2">
                <Checkbox id="select-all" />
                <label
                  htmlFor="select-all"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Select all items
                </label>
              </div>
            </div>
            {cartItems.map((cartStoreItem, index) => (
              <StoreItems key={index} cartStoreItem={cartStoreItem} />
            ))}
          </Card>
          <Card className="col-span-2 p-5 self-start mt-6 lg:mt-0">
            <h2 className="text-xl font-semibold">Summary</h2>
            <Separator className="my-4" />
            <div className="flex flex-col gap-3">
              <div className="flex justify-between">
                <span className="text-sm">SSD M2 NVME</span>
                <span className="text-sm">2 x Rp. 500.000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">VenomRX M.2E</span>
                <span className="text-sm">1 x Rp. 274.000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">GTX 750TI 4GB</span>
                <span className="text-sm">1 x Rp. 1.113.000</span>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">Rp. 2.387.000</span>
            </div>
            <Button className="w-full mt-5">Buy</Button>
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

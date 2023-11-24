import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { FiMinus, FiPlus } from "react-icons/fi"
import { FaTrashAlt } from "react-icons/fa"
import Image from "next/image"
import { cartItem } from "@/interfaces/cart-item"
import { useContext, useState } from "react"
import { CartContext } from "@/app/cart-provider"
import { cartStoreItem } from "@/app/cart-provider"
import { useClientFetch } from "@/hooks/useClientFetch"
import { useToast } from "../ui/use-toast"
import { Icons } from "@/components/ui/icons"
import { Card } from "@/components/ui/card"
import { set } from "react-hook-form"

export default function ProductItem({ cartItem }: { cartItem: cartItem }) {
  const { cart, setCart } = useContext(CartContext)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  function handleIncrement() {
    setIsLoading(true)
    const temp: cartStoreItem[] = [...cart]
    const formData = new FormData()
    formData.append("quantity", (cartItem.quantity + 1).toString())

    cart.forEach((cartStoreItem) => {
      cartStoreItem.items.forEach((item) => {
        if (item.product.id === cartItem.product.id) {
          console.log(item.product.id)
          try {
            useClientFetch.put(`/api/cart/${cartItem.product.id}`, formData)
            item.quantity++
          } catch (err) {
            console.log(err)
            toast({
              variant: "destructive",
              title: "Error",
              description: `Product ${cartItem.product.name} failed to cange quantity`,
              duration: 3000,
            })
          }
        }
      })
    })
    setCart(temp)
    setIsLoading(false)
  }

  function handleDecrement() {
    setIsLoading(true)
    const temp: cartStoreItem[] = [...cart]
    const formData = new FormData()
    formData.append("quantity", (cartItem.quantity - 1).toString())

    cart.forEach((cartStoreItem) => {
      cartStoreItem.items.forEach((item) => {
        if (item.product.id === cartItem.product.id) {
          console.log(item.product.id)
          try {
            useClientFetch.put(`/api/cart/${cartItem.product.id}`, formData)
            item.quantity++
          } catch (err) {
            console.log(err)
            toast({
              variant: "destructive",
              title: "Error",
              description: `Product ${cartItem.product.name} failed to cange quantity`,
              duration: 3000,
            })
          }
        }
      })
    })
    setCart(temp)
    setIsLoading(false)
  }

  function handleRemove() {
    setIsLoading(true)
    let temp: cartStoreItem[] = [...cart]

    cart.forEach((cartStoreItem) => {
      cartStoreItem.items.forEach((item) => {
        if (item.product.id === cartItem.product.id) {
          console.log(item.product.id)
          try {
            useClientFetch.delete(`/api/cart/${cartItem.product.id}`)
            if (cartStoreItem.items.length == 1) {
              temp = temp.filter(
                (data) => data.store.id != cartStoreItem.store.id
              )
            } else {
              cartStoreItem.items = cartStoreItem.items.filter(
                (data) => data.product.id != cartItem.product.id
              )
            }
            toast({
              title: "Success",
              description: `Success removing ${cartItem.product.name} from cart`,
              duration: 3000,
            })
          } catch (err) {
            console.log(err)
            toast({
              variant: "destructive",
              title: "Error",
              description: `Product ${cartItem.product.name} failed to cange quantity`,
              duration: 3000,
            })
          }
        }
      })
    })
    setCart(temp)
    setIsLoading(false)
  }

  return (
    <div className="row md:grid md:grid-cols-7 gap-5 w-full">
      <div className="col-span-2 md:flex items-center md:gap-5 gap-3 hidden">
        <Checkbox id="select-all" />
        <div className="flex-grow">
          <Card>
            <AspectRatio ratio={16 / 13}>
              <Image
                className="rounded-md object-cover"
                src={
                  cartItem.product.images
                    ? `${process.env.NEXT_PUBLIC_DOMAIN}/api/assets/product_images/${cartItem.product.images[0]}`
                    : "https://layanan.karangbaru.acehtamiangkab.go.id/uploads/no-available.png"
                }
                alt="produc photo"
                fill
              />
            </AspectRatio>
          </Card>
        </div>
      </div>
      <div className="col-span-5 flex gap-5 lg:gap-0 items-center">
        <Checkbox className="md:hidden" />
        <div className="overflow-hidden lg:text-lg lg:h-full lg:flex lg:flex-col lg:justify-around">
          <div>
            <h4 className="font-semibold truncate lg:text-xl">
              {cartItem.product.name}
            </h4>
            Rp. {cartItem.product.price.toLocaleString().replace(/,/g, ".")}
          </div>
          <div className="flex gap-5 items-center mt-2">
            <div className="flex gap-2 items-center">
              <Button
                size="icon"
                className="lg:h-9 lg:w-6 h-7 w-4"
                onClick={() => handleDecrement()}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FiMinus className="w-3 h-3 text-background" />
                )}
              </Button>
              <Input
                type="number"
                className="lg:h-9 h-7 w-12 text-center"
                value={cartItem.quantity}
                disabled={isLoading}
              />
              <Button
                size="icon"
                className="lg:h-9 lg:w-6 h-7 w-4"
                onClick={() => handleIncrement()}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FiPlus className="w-3 h-3 text-background" />
                )}
              </Button>
            </div>
            <Button
              size="icon"
              className="lg:h-9 h-7"
              variant="destructive"
              onClick={() => handleRemove()}
              disabled={isLoading}
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FaTrashAlt className="w-[0.8rem] h-[0.8rem] text-background" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

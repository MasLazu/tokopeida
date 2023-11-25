import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { cartStoreItem } from "@/app/cart-provider"
import { useContext } from "react"
import { CartContext } from "@/app/cart-provider"
import { useState, useEffect } from "react"

import ProductItem from "./product-item"

export default function StoreItems({
  cartStoreItem,
}: {
  cartStoreItem: cartStoreItem
}) {
  const { cart, setCart } = useContext(CartContext)
  const [selected, setSelected] = useState(true)

  function handleSelectAll() {
    const temp: cartStoreItem[] = [...cart]
    temp.forEach((cartStoreItem) => {
      cartStoreItem.items.forEach((item) => {
        item.selected = true
      })
    })
    setSelected(true)
    setCart(temp)
  }

  function handleUnselectAll() {
    const temp: cartStoreItem[] = [...cart]
    temp.forEach((cartStoreItem) => {
      cartStoreItem.items.forEach((item) => {
        item.selected = false
      })
    })
    setSelected(false)
    setCart(temp)
  }

  useEffect(() => {
    let selected = true
    cartStoreItem.items.forEach((item) => {
      if (!item.selected) selected = false
    })
    setSelected(selected)
  }, [cart])

  return (
    <>
      <Separator className="my-4" />
      <div className="flex flex-col gap-5">
        <div className="store p-2 flex flex-col gap-4 overflow-hidden">
          <div className="row flex items-center gap-5">
            <Checkbox
              id="select-all"
              checked={selected}
              onClick={() =>
                selected ? handleUnselectAll() : handleSelectAll()
              }
            />
            <div className="text-sm">
              <h3 className="text-lg font-semibold">
                {cartStoreItem.store.name}
              </h3>
              {cartStoreItem.store.city}
            </div>
          </div>
          {cartStoreItem.items.map((cartItem) => (
            <ProductItem key={cartItem.product.id} cartItem={cartItem} />
          ))}
        </div>
      </div>
    </>
  )
}

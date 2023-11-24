import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { cartStoreItem } from "@/app/cart-provider"

import ProductItem from "./product-item"

export default function StoreItems({
  cartStoreItem,
}: {
  cartStoreItem: cartStoreItem
}) {
  return (
    <>
      <Separator className="my-4" />
      <div className="flex flex-col gap-5">
        <div className="store p-2 flex flex-col gap-4 overflow-hidden">
          <div className="row flex items-center gap-5">
            <Checkbox id="select-all" />
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

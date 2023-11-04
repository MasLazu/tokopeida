import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

import ProductItem from "./product-item"

export default function StoreItems() {
  return (
    <>
      <Separator className="my-4" />
      <div className="flex flex-col gap-5">
        <div className="store p-2 flex flex-col gap-4 overflow-hidden">
          <div className="row flex items-center gap-5">
            <Checkbox id="select-all" />
            <div className="text-sm">
              <h3 className="text-lg font-semibold">Raja Nusantara</h3>
              Jakarta Utara
            </div>
          </div>
          <ProductItem />
          <ProductItem />
        </div>
      </div>
    </>
  )
}

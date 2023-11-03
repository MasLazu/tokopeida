import Navbar from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import StoreItems from "@/components/cart/store-items"
import { Button } from "@/components/ui/button"

export default function StorePage() {
  return (
    <>
      <Navbar />
      <div className="flex justify-center p-5 mt-4">
        <main className="container grid grid-cols-7 gap-8">
          <Card className="col-span-5 p-5">
            <h1 className="text-2xl font-semibold mb-5">Shopping Cart</h1>
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
            <StoreItems />
            <StoreItems />
          </Card>
          <Card className="col-span-2 p-5 self-start">
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
        </main>
      </div>
    </>
  )
}

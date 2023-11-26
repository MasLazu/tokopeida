import { Card } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { FaStar } from "react-icons/fa6"
import { product } from "@/interfaces/product"

export default function ProductCard(product: product) {
  return (
    <Card className="w-full hover:brightness-90">
      <AspectRatio ratio={16 / 13} className="bg-muted border-b">
        <Image
          src={
            product.images
              ? `${process.env.NEXT_PUBLIC_DOMAIN}/api/assets/product_images/${product.images[0]}`
              : "https://layanan.karangbaru.acehtamiangkab.go.id/uploads/no-available.png"
          }
          alt="Photo by Drew Beamer"
          fill
          className="rounded-t-md object-cover"
        />
        {product.stock > 0 && product.stock < 10 ? (
          <div className="absolute bottom-2 left-2 rounded-full px-2 text-red-500 text-[0.65rem] bg-white/70 border font-semibold">
            {product.stock} left
          </div>
        ) : null}
        {product.stock < 1 ? (
          <div className="absolute top-0 left-0 bg-slate-800/40 h-full w-full rounded-t-md">
            <div className="absolute bottom-2 left-2 rounded-full px-2 text-white text-[0.65rem] bg-gray-400/70 border font-semibold">
              out of stock
            </div>
          </div>
        ) : null}
      </AspectRatio>
      <div className="p-3 flex flex-col gap-2">
        <h3 className="sm:text-sm text-xs leading-none text-muted-foreground tracking-tight truncate">
          {product.name}
        </h3>
        <p className="sm:text-md text-sm font-semibold truncate">
          Rp. {product.price.toLocaleString().replace(/,/g, ".")}
        </p>
        <div className="grid grid-cols-11 gap-2">
          <div className="bg-amber-400 px-2 rounded-full flex text-white items-center justify-center gap-1 sm:col-span-5 col-span-4 sm:text-xs text-[0.6rem] sm:py-1 py-[0.1rem]">
            <FaStar className="text-white w-3 h-3 sm:block hidden" />
            4.9
          </div>
          <Separator orientation="vertical" />
          <div className="md:text-xs sm:text-[0.7rem] text-[0.6rem] leading-3 text-slate-600 sm:col-span-5 col-span-6 flex items-center justify-center">
            Sold {product.sold}
          </div>
        </div>
      </div>
    </Card>
  )
}

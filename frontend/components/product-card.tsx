import { Card } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { FaStar } from "react-icons/fa6"

type ProductCardProps = {
  title: string
  img: string
  price: number
  rating: number
  sold: number
}

export default function ProductCard({
  title,
  img,
  price,
  rating,
  sold,
}: ProductCardProps) {
  return (
    <Card className="w-full">
      <AspectRatio ratio={16 / 13} className="bg-muted">
        <Image
          src={img}
          alt="Photo by Drew Beamer"
          fill
          className="rounded-t-md object-cover"
        />
      </AspectRatio>
      <div className="p-3 flex flex-col gap-2">
        <h3 className="sm:text-sm text-xs leading-none text-muted-foreground tracking-tight truncate">
          {title}
        </h3>
        <p className="sm:text-md text-sm font-semibold truncate">Rp. {price}</p>
        <div className="grid grid-cols-11 gap-2">
          <div className="bg-amber-400 px-2 rounded-full flex text-white items-center justify-center gap-1 sm:col-span-5 col-span-4 sm:text-xs text-[0.6rem] sm:py-1 py-[0.1rem]">
            <FaStar className="text-white w-3 h-3 sm:block hidden" />
            {rating}
          </div>
          <Separator orientation="vertical" />
          <div className="md:text-xs sm:text-[0.7rem] text-[0.6rem] leading-3 text-slate-600 sm:col-span-5 col-span-6 flex items-center justify-center">
            Sold {sold}
          </div>
        </div>
      </div>
    </Card>
  )
}

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
    <Card className="w-44">
      <AspectRatio ratio={16 / 13} className="bg-muted">
        <Image
          src={img}
          alt="Photo by Drew Beamer"
          fill
          className="rounded-t-md object-cover"
        />
      </AspectRatio>
      <div className="p-3 flex flex-col gap-2">
        <h3 className="text-sm leading-none text-muted-foreground tracking-tight truncate">
          {title}
        </h3>
        <p className="text-md font-semibold">Rp. {price}</p>
        <div className="grid grid-cols-11 gap-2">
          <div className="bg-amber-400 px-2 rounded-full flex text-white items-center justify-center gap-1 col-span-5 text-xs py-1">
            <FaStar className="text-white w-3 h-3]" />
            {rating}
          </div>
          <Separator orientation="vertical" />
          <div className="text-xs text-slate-600 col-span-5 flex items-center justify-center">
            Sold {sold}
          </div>
        </div>
      </div>
    </Card>
  )
}

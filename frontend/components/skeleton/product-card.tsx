import { Card } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProductCardSkeleton() {
  return (
    <Card className="w-44">
      <AspectRatio ratio={16 / 13} className="bg-muted">
        <Skeleton className="w-full h-full" />
      </AspectRatio>
      <div className="p-3 flex flex-col gap-2">
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-1/2 h-5 my-[0.09rem]" />
        <div className="grid grid-cols-11 gap-2">
          <div className="bg-amber-400 px-2 rounded-full flex text-white items-center justify-center gap-1 col-span-5 text-xs py-3">
            {/* <FaStar className="text-white w-3 h-3]" />
            <Skeleton className="w-4 h-4" /> */}
          </div>
          <Separator orientation="vertical" />
          <div className="text-xs text-slate-600 col-span-5 flex items-center justify-center">
            <Skeleton className="w-12 h-5" />
          </div>
        </div>
      </div>
    </Card>
  )
}

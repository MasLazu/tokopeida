import { Card } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export default function ProductCardSkeleton({
  className,
}: {
  className?: string
}) {
  return (
    <Card className={cn("w-full", className)}>
      <AspectRatio ratio={16 / 13} className="bg-muted">
        <Skeleton className="w-full h-full" />
      </AspectRatio>
      <div className="p-3 flex flex-col gap-2">
        <Skeleton className="w-full sm:h-4 -3" />
        <Skeleton className="w-1/2 sm:h-5 h-4 my-[0.09rem]" />
        <div className="grid grid-cols-11 gap-2">
          <div className="bg-amber-400 px-2 rounded-full flex text-white items-center justify-center gap-1 col-span-5 text-xs py-3"></div>
          <Separator orientation="vertical" />
          <div className="text-xs text-slate-600 col-span-5 flex items-center justify-center">
            <Skeleton className="w-12 h-5" />
          </div>
        </div>
      </div>
    </Card>
  )
}

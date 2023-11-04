import { useSwiper } from "swiper/react"
import { Button } from "@/components/ui/button"
import { GrFormNext, GrFormPrevious } from "react-icons/gr"
import { cn } from "@/lib/utils"

export default function NavSlider() {
  const swiper = useSwiper()
  return (
    <div>
      <Button variant="outline" onClick={() => swiper.slideNext()}>
        <GrFormNext className="text-xl text-foreground" />
      </Button>
      <Button variant="outline" onClick={() => swiper.slidePrev()}>
        <GrFormPrevious className="text-xl text-foreground" />
      </Button>
    </div>
  )
}

export function NavSliderNext({ className }: { className?: string }) {
  const swiper = useSwiper()
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => swiper.slideNext()}
      className={cn("lg:h-10 lg:w-10 w-8 h-8 ", className)}
    >
      <GrFormNext className="lg:text-3xl md:text-2xl text-xl" />
    </Button>
  )
}

export function NavSliderPrev({ className }: { className?: string }) {
  const swiper = useSwiper()
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => swiper.slidePrev()}
      className={cn("lg:h-10 lg:w-10 w-8 h-8", className)}
    >
      <GrFormPrevious className="lg:text-3xl md:text-2xl text-xl" />
    </Button>
  )
}

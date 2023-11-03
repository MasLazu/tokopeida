"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Image from "next/image"

export default function ProductImageCarosel() {
  return (
    <Swiper
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
      onSlideChange={() => console.log("slide change")}
      onSwiper={(swiper) => console.log(swiper)}
      className="rounded-md"
    >
      <SwiperSlide>
        <AspectRatio ratio={16 / 13} className="bg-muted">
          <Image
            src="https://images.tokopedia.net/img/cache/700/VqbcmM/2023/9/11/fff31b07-bdc4-40c6-9446-a1b4528955b9.jpg.webp?ect=4g"
            alt="Photo by Drew Beamer"
            fill
            className="rounded-t-md object-cover"
          />
        </AspectRatio>
      </SwiperSlide>
      <SwiperSlide>
        <AspectRatio ratio={16 / 13} className="bg-muted">
          <Image
            src="https://images.tokopedia.net/img/cache/700/VqbcmM/2023/9/11/e9b8af5e-dbce-44f3-95e8-c12c7717ecb3.jpg.webp?ect=4g"
            alt="Photo by Drew Beamer"
            fill
            className="rounded-t-md object-cover"
          />
        </AspectRatio>
      </SwiperSlide>
      <SwiperSlide>
        <AspectRatio ratio={16 / 13} className="bg-muted">
          <Image
            src="https://images.tokopedia.net/img/cache/700/VqbcmM/2023/9/11/fbbdb2af-4127-4b71-9d6a-aaf8d49b1218.jpg.webp?ect=4g"
            alt="Photo by Drew Beamer"
            fill
            className="rounded-t-md object-cover"
          />
        </AspectRatio>
      </SwiperSlide>
      <SwiperSlide>
        <AspectRatio ratio={16 / 13} className="bg-muted">
          <Image
            src="https://images.tokopedia.net/img/cache/700/VqbcmM/2023/9/11/00ca78ab-4573-4122-9bd6-66302e01230f.jpg.webp?ect=4g"
            alt="Photo by Drew Beamer"
            fill
            className="rounded-t-md object-cover"
          />
        </AspectRatio>
      </SwiperSlide>
      <SwiperSlide>
        <AspectRatio ratio={16 / 13} className="bg-muted">
          <Image
            src="https://images.tokopedia.net/img/cache/700/VqbcmM/2023/9/11/89548e78-67dc-4dd8-bd5c-5f8821510e70.jpg.webp?ect=4g"
            alt="Photo by Drew Beamer"
            fill
            className="rounded-t-md object-cover"
          />
        </AspectRatio>
      </SwiperSlide>
    </Swiper>
  )
}

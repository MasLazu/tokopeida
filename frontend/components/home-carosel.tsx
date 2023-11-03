"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Thumbs, FreeMode } from "swiper/modules"
import Image from "next/image"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import "swiper/css"
import "swiper/css/navigation"
import { Card } from "@/components/ui/card"

export default function HomeCarosel() {
  return (
    <Card className="rounded-xl">
      <Swiper
        className="rounded-xl"
        modules={[Navigation, FreeMode, Thumbs]}
        loop={true}
        navigation
        pagination={{ clickable: true }}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
      >
        <SwiperSlide>
          <AspectRatio ratio={18 / 5}>
            <Image
              src="https://images.tokopedia.net/img/cache/1208/NsjrJu/2023/11/1/5704ede8-6ced-4017-a3c2-44a7384944ab.jpg.webp?ect=4g"
              alt="gambar"
              fill
            ></Image>
          </AspectRatio>
        </SwiperSlide>
        <SwiperSlide>
          <AspectRatio ratio={18 / 5}>
            <Image
              src="https://images.tokopedia.net/img/cache/1208/NsjrJu/2023/10/25/d0d7883a-6d30-451b-abda-2b05226836ec.jpg.webp?ect=4g"
              alt="gambar"
              fill
            ></Image>
          </AspectRatio>
        </SwiperSlide>
        <SwiperSlide>
          <AspectRatio ratio={18 / 5}>
            <Image
              src="https://images.tokopedia.net/img/cache/1208/NsjrJu/2023/11/1/ce138663-537c-4d92-8da9-20ed7c3b7525.jpg.webp?ect=4g"
              alt="gambar"
              fill
            ></Image>
          </AspectRatio>
        </SwiperSlide>
      </Swiper>
    </Card>
  )
}

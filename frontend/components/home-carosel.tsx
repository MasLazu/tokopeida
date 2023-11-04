"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import Image from "next/image"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Card } from "@/components/ui/card"
import { NavSliderNext, NavSliderPrev } from "@/components/nav-slider"
import { Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"

export default function HomeCarosel() {
  return (
    <Card className="rounded-xl">
      <Swiper
        className="rounded-xl"
        modules={[Pagination, Autoplay]}
        autoplay={{ delay: 5000 }}
        pagination={{ clickable: true }}
        loop={true}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
      >
        <div className="absolute flex h-full md:left-3 left-1 top-0 z-10 items-center">
          <NavSliderPrev />
        </div>
        <SwiperSlide>
          <AspectRatio ratio={4 / 1}>
            <Image
              src="https://www.static-src.com/siva/asset/11_2023/desktop-3nov-ip15pro-car5.jpg?w=960"
              alt="gambar"
              fill
            ></Image>
          </AspectRatio>
        </SwiperSlide>
        <SwiperSlide>
          <AspectRatio ratio={4 / 1}>
            <Image
              src="https://www.static-src.com/siva/asset/11_2023/desktop-3nov-ip15-car6.jpg?w=960"
              alt="gambar"
              fill
            ></Image>
          </AspectRatio>
        </SwiperSlide>
        <SwiperSlide>
          <AspectRatio ratio={4 / 1}>
            <Image
              src="https://www.static-src.com/siva/asset/11_2023/desktop-3nov-uss-car7.jpg?w=960"
              alt="gambar"
              fill
            ></Image>
          </AspectRatio>
        </SwiperSlide>
        <SwiperSlide>
          <AspectRatio ratio={4 / 1}>
            <Image
              src="https://www.static-src.com/siva/asset/11_2023/desktop-3nov-dreamon-car10.jpg?w=960"
              alt="gambar"
              fill
            ></Image>
          </AspectRatio>
        </SwiperSlide>
        <SwiperSlide>
          <AspectRatio ratio={4 / 1}>
            <Image
              src="https://www.static-src.com/siva/asset/11_2023/desktop-3nov-histeria-car1.jpg"
              alt="gambar"
              fill
            ></Image>
          </AspectRatio>
        </SwiperSlide>
        <SwiperSlide>
          <AspectRatio ratio={4 / 1}>
            <Image
              src="https://www.static-src.com/siva/asset/11_2023/desktop-3nov-tvfair-car2.jpg?w=960"
              alt="gambar"
              fill
            ></Image>
          </AspectRatio>
        </SwiperSlide>
        <div className="absolute flex h-full md:right-3 right-1 top-0 z-10 items-center">
          <NavSliderNext />
        </div>
      </Swiper>
    </Card>
  )
}

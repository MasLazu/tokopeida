"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { NavSliderNext, NavSliderPrev } from "@/components/nav-slider"
import { Pagination } from "swiper/modules"
import Image from "next/image"
import "swiper/css/pagination"

export default function ProductImageCarosel({
  filenames,
}: {
  filenames: string[] | undefined
}) {
  console.log(filenames)
  return (
    <Swiper
      modules={[Pagination]}
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
      className="rounded-md"
    >
      {filenames && filenames?.length > 1 ? (
        <div className="absolute flex h-full -left-2 top-0 z-10 items-center">
          <NavSliderPrev />
        </div>
      ) : null}
      {filenames ? (
        filenames.map((filename) => (
          <SwiperSlide key={filename}>
            <AspectRatio ratio={16 / 13} className="bg-muted">
              <Image
                src={`${process.env.NEXT_PUBLIC_DOMAIN}/api/assets/product_images/${filename}`}
                alt="filenames"
                fill
                className="rounded-t-md object-cover"
              />
            </AspectRatio>
          </SwiperSlide>
        ))
      ) : (
        <SwiperSlide>
          <AspectRatio ratio={16 / 13} className="bg-muted">
            <Image
              src="https://layanan.karangbaru.acehtamiangkab.go.id/uploads/no-available.png"
              alt="filenames"
              fill
              className="rounded-t-md object-cover"
            />
          </AspectRatio>
        </SwiperSlide>
      )}
      {filenames && filenames?.length > 1 ? (
        <div className="absolute flex h-full -right-2 top-0 z-10 items-center">
          <NavSliderNext />
        </div>
      ) : null}
    </Swiper>
  )
}

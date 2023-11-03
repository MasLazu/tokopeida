"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import ProductCard from "./product-card"
import { cn } from "@/lib/utils"

import "swiper/css"

type ProductCardProps = {
  className?: string
  title: string
}

export default function ProductSlider({ title, className }: ProductCardProps) {
  return (
    <div className={cn("row pt-5", className)}>
      <h3 className="text-xl font-semibold my-2">{title}</h3>
      <Swiper
        slidesPerView={7}
        spaceBetween={16}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
      >
        <SwiperSlide>
          <ProductCard
            title="EIGER HELICON WATCH - Olive"
            img="https://images.tokopedia.net/img/cache/700/VqbcmM/2021/6/21/7b67647e-0a99-46de-834a-c325889035fb.jpg.webp?ect=4g"
            price={499000}
            rating={4.5}
            sold={100}
          />
        </SwiperSlide>
        <SwiperSlide>
          <ProductCard
            title="Palomino Wilmor Handbag - Black"
            img="https://images.tokopedia.net/img/cache/900/VqbcmM/2023/9/5/daac7560-0d81-4f9a-b7f9-f13496c6e9f8.jpg"
            price={359250}
            rating={5}
            sold={2}
          />
        </SwiperSlide>
        <SwiperSlide>
          <ProductCard
            title="SSD M2 NVME / M.2 NVME/ M2NVME 128GB KAIZEN RESMI (GARANSI 5 TAHUN)"
            img="https://images.tokopedia.net/img/cache/900/VqbcmM/2023/8/4/126f961d-1185-419f-a384-d16f93330c6d.jpg"
            price={174000}
            rating={4.9}
            sold={1086}
          />
        </SwiperSlide>
        <SwiperSlide>
          <ProductCard
            title="EIGER HELICON WATCH - Olive"
            img="https://images.tokopedia.net/img/cache/700/VqbcmM/2021/6/21/7b67647e-0a99-46de-834a-c325889035fb.jpg.webp?ect=4g"
            price={499000}
            rating={4.5}
            sold={100}
          />
        </SwiperSlide>
        <SwiperSlide>
          <ProductCard
            title="Palomino Wilmor Handbag - Black"
            img="https://images.tokopedia.net/img/cache/900/VqbcmM/2023/9/5/daac7560-0d81-4f9a-b7f9-f13496c6e9f8.jpg"
            price={359250}
            rating={5}
            sold={2}
          />
        </SwiperSlide>
        <SwiperSlide>
          <ProductCard
            title="SSD M2 NVME / M.2 NVME/ M2NVME 128GB KAIZEN RESMI (GARANSI 5 TAHUN)"
            img="https://images.tokopedia.net/img/cache/900/VqbcmM/2023/8/4/126f961d-1185-419f-a384-d16f93330c6d.jpg"
            price={174000}
            rating={4.9}
            sold={1086}
          />
        </SwiperSlide>
        <SwiperSlide>
          <ProductCard
            title="EIGER HELICON WATCH - Olive"
            img="https://images.tokopedia.net/img/cache/700/VqbcmM/2021/6/21/7b67647e-0a99-46de-834a-c325889035fb.jpg.webp?ect=4g"
            price={499000}
            rating={4.5}
            sold={100}
          />
        </SwiperSlide>
        <SwiperSlide>
          <ProductCard
            title="Palomino Wilmor Handbag - Black"
            img="https://images.tokopedia.net/img/cache/900/VqbcmM/2023/9/5/daac7560-0d81-4f9a-b7f9-f13496c6e9f8.jpg"
            price={359250}
            rating={5}
            sold={2}
          />
        </SwiperSlide>
        <SwiperSlide>
          <ProductCard
            title="SSD M2 NVME / M.2 NVME/ M2NVME 128GB KAIZEN RESMI (GARANSI 5 TAHUN)"
            img="https://images.tokopedia.net/img/cache/900/VqbcmM/2023/8/4/126f961d-1185-419f-a384-d16f93330c6d.jpg"
            price={174000}
            rating={4.9}
            sold={1086}
          />
        </SwiperSlide>
      </Swiper>
    </div>
  )
}

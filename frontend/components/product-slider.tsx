"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import ProductCard from "./product-card"
import { cn } from "@/lib/utils"
import ProductCardSkeleton from "@/components/skeleton/product-card"
import { useState, useEffect } from "react"
import { NavSliderNext, NavSliderPrev } from "@/components/nav-slider"
import Link from "next/link"

import "swiper/css"

type ProductCardProps = {
  className?: string
  title: string
}

type ProductData = {
  title: string
  img: string
  price: number
  rating: number
  sold: number
}

export default function ProductSlider({ title, className }: ProductCardProps) {
  const [productData, setProductData] = useState<ProductData[]>([])
  const productDataDummy = [
    {
      title: "EIGER HELICON WATCH - Olive",
      img: "https://images.tokopedia.net/img/cache/700/VqbcmM/2021/6/21/7b67647e-0a99-46de-834a-c325889035fb.jpg.webp?ect=4g",
      price: 499000,
      rating: 4.5,
      sold: 100,
    },
    {
      title: "Palomino Wilmor Handbag - Black",
      img: "https://images.tokopedia.net/img/cache/900/VqbcmM/2023/9/5/daac7560-0d81-4f9a-b7f9-f13496c6e9f8.jpg",
      price: 359250,
      rating: 5,
      sold: 2,
    },
    {
      title:
        "SSD M2 NVME / M.2 NVME/ M2NVME 128GB KAIZEN RESMI (GARANSI 5 TAHUN)",
      img: "https://images.tokopedia.net/img/cache/900/VqbcmM/2023/8/4/126f961d-1185-419f-a384-d16f93330c6d.jpg",
      price: 174000,
      rating: 4.9,
      sold: 99,
    },
    {
      title: "EIGER HELICON WATCH - Olive",
      img: "https://images.tokopedia.net/img/cache/700/VqbcmM/2021/6/21/7b67647e-0a99-46de-834a-c325889035fb.jpg.webp?ect=4g",
      price: 499000,
      rating: 4.5,
      sold: 100,
    },
    {
      title: "Palomino Wilmor Handbag - Black",
      img: "https://images.tokopedia.net/img/cache/900/VqbcmM/2023/9/5/daac7560-0d81-4f9a-b7f9-f13496c6e9f8.jpg",
      price: 359250,
      rating: 5,
      sold: 2,
    },
    {
      title:
        "SSD M2 NVME / M.2 NVME/ M2NVME 128GB KAIZEN RESMI (GARANSI 5 TAHUN)",
      img: "https://images.tokopedia.net/img/cache/900/VqbcmM/2023/8/4/126f961d-1185-419f-a384-d16f93330c6d.jpg",
      price: 174000,
      rating: 4.9,
      sold: 99,
    },
    {
      title: "EIGER HELICON WATCH - Olive",
      img: "https://images.tokopedia.net/img/cache/700/VqbcmM/2021/6/21/7b67647e-0a99-46de-834a-c325889035fb.jpg.webp?ect=4g",
      price: 499000,
      rating: 4.5,
      sold: 100,
    },
    {
      title: "Palomino Wilmor Handbag - Black",
      img: "https://images.tokopedia.net/img/cache/900/VqbcmM/2023/9/5/daac7560-0d81-4f9a-b7f9-f13496c6e9f8.jpg",
      price: 359250,
      rating: 5,
      sold: 2,
    },
    {
      title:
        "SSD M2 NVME / M.2 NVME/ M2NVME 128GB KAIZEN RESMI (GARANSI 5 TAHUN)",
      img: "https://images.tokopedia.net/img/cache/900/VqbcmM/2023/8/4/126f961d-1185-419f-a384-d16f93330c6d.jpg",
      price: 174000,
      rating: 4.9,
      sold: 99,
    },
  ]

  useEffect(() => {
    setProductData(productDataDummy)
  }, [])

  return (
    <div className={cn("row pt-5", className)}>
      <h3 className="md:text-xl text-lg font-semibold my-2">{title}</h3>
      {productData.length === 0 ? (
        <div className="grid grid-cols-7 gap-4 mb-5">
          {new Array(7).fill(0).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <Swiper
          slidesPerView={3}
          spaceBetween={6}
          breakpoints={{
            427: {
              slidesPerView: 3,
              spaceBetween: 13,
            },
            640: {
              slidesPerView: 3,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 15,
            },
            800: {
              slidesPerView: 4,
              spaceBetween: 18,
            },
            1024: {
              slidesPerView: 6,
              spaceBetween: 22,
            },
            1536: {
              slidesPerView: 7,
              spaceBetween: 16,
            },
          }}
        >
          <div className="absolute flex h-full -left-3 top-0 z-10 items-center">
            <NavSliderPrev />
          </div>
          {productData.map((product, i) => {
            return (
              <SwiperSlide key={i} className="cursor-pointers">
                <Link
                  href={`/yanto-store/${product.title.replace(/\s+|\//g, "-")}`}
                >
                  <ProductCard {...product} />
                </Link>
              </SwiperSlide>
            )
          })}
          <div className="absolute flex h-full -right-3 top-0 z-10 items-center">
            <NavSliderNext />
          </div>
        </Swiper>
      )}
    </div>
  )
}

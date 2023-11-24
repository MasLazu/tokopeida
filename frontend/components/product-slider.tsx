"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import ProductCard from "./product-card"
import { cn } from "@/lib/utils"
import ProductCardSkeleton from "@/components/skeleton/product-card"
import { useState, useEffect } from "react"
import { NavSliderNext, NavSliderPrev } from "@/components/nav-slider"
import { product } from "@/interfaces/product"
import Link from "next/link"

import "swiper/css"

type ProductCardProps = {
  className?: string
  title: string
  productsData: product[]
}

export default function ProductSlider({
  title,
  className,
  productsData,
}: ProductCardProps) {
  const [productData, setProductData] = useState<product[]>([])

  useEffect(() => {
    setProductData(productsData)
  }, [])

  return (
    <div className={cn("row pt-5", className)}>
      <h3 className="md:text-xl text-lg font-semibold my-2">{title}</h3>
      {productData.length === 0 ? (
        <div className="grid 2xl:grid-cols-7 lg:grid-cols-6 md:grid-cols-4 grid-cols-3 lg:gap-4 gap-3 grid-rows-1 mb-5 overflow-hidden">
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton className="hidden md:block" />
          <ProductCardSkeleton className="hidden lg:block" />
          <ProductCardSkeleton className="hidden lg:block" />
          <ProductCardSkeleton className="hidden 2xl:block" />
        </div>
      ) : (
        <Swiper
          slidesPerView={3}
          spaceBetween={6}
          breakpoints={{
            427: {
              slidesPerView: 3,
              spaceBetween: 12,
            },
            640: {
              slidesPerView: 3,
              spaceBetween: 12,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 12,
            },
            1024: {
              slidesPerView: 6,
              spaceBetween: 16,
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
          {productData.map((product) => {
            return (
              <SwiperSlide key={product.id} className="cursor-pointers">
                <Link href={`/${product.storeId}/${product.id}`}>
                  <ProductCard
                    name={product.name}
                    price={product.price}
                    rating={4.9}
                    sold={product.sold}
                    img={
                      product.images
                        ? `${process.env.NEXT_PUBLIC_DOMAIN}/api/assets/product_images/${product.images[0]}`
                        : "https://layanan.karangbaru.acehtamiangkab.go.id/uploads/no-available.png"
                    }
                  />
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

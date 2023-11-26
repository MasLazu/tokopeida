"use client"

import Link from "next/link"
import ProductCard from "@/components/product-card"
import { useState, useEffect, useRef } from "react"
import { product, productApiResponse } from "@/interfaces/product"
import { useClientFetch } from "@/hooks/useClientFetch"

export default function Explore({ initExplore }: { initExplore: product[] }) {
  const [explore, setExplore] = useState<product[]>(initExplore)
  const scrollRef = useRef<HTMLDivElement>(null)

  async function fetch() {
    try {
      const result = (
        await useClientFetch.get<productApiResponse[] | null>(
          `/api/product/explore/21`
        )
      ).data
      if (result) {
        setExplore((prev) => [
          ...prev,
          ...result.map((product) => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            sold: product.sold,
            images: product.images,
            storeId: product.store_id,
            createdAt: new Date(product.created_at),
            updatedAt: new Date(product.updated_at),
          })),
        ])
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleScroll = () => {
    if (
      scrollRef.current &&
      scrollRef.current.getBoundingClientRect().bottom <=
        window.innerHeight + 100
    ) {
      fetch()
    }
  }

  useEffect(() => {
    fetch()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="row pt-5" ref={scrollRef}>
      <h3 className="text-xl font-semibold my-2">Explore</h3>
      <div className="grid 2xl:grid-cols-7 lg:grid-cols-6 md:grid-cols-4 grid-cols-3 lg:gap-4 gap-3 mb-5">
        {explore.map((product, index) => (
          <Link key={index} href={`/${product.storeId}/${product.id}`}>
            <ProductCard {...product} />
          </Link>
        ))}
      </div>
    </div>
  )
}

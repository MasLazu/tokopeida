"use client"

import { product } from "@/interfaces/product"
import Link from "next/link"
import ProductCard from "@/components/product-card"
import { useContext } from "react"
import { WishlistsContext } from "../wishlist-profider"
import { useEffect, useState } from "react"

export default function GridProductWishlists({
  initWishlists,
}: {
  initWishlists: product[]
}) {
  const [data, setData] = useState<product[]>(initWishlists)
  const { wishlists } = useContext(WishlistsContext)

  useEffect(() => {
    setData(wishlists)
  }, [])

  return (
    <div className="w-full grid 2xl:grid-cols-7 lg:grid-cols-6 md:grid-cols-4 grid-cols-3 lg:gap-4 gap-3 mb-5">
      {data.map((product, index) => (
        <Link key={index} href={`/yanto-store/${product.id}`}>
          <ProductCard
            key={product.id}
            name={product.name}
            price={product.price}
            rating={4.9}
            sold={108}
            img={
              product.images
                ? `${process.env.NEXT_PUBLIC_DOMAIN}/api/assets/product_images/${product.images[0]}`
                : "https://layanan.karangbaru.acehtamiangkab.go.id/uploads/no-available.png"
            }
          />
        </Link>
      ))}
    </div>
  )
}

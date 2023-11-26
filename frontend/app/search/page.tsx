"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/navbar"
import PageTransition from "@/components/page-pransition"
import { useSearchParams } from "next/navigation"
import { useClientFetch } from "@/hooks/useClientFetch"
import { product, productApiResponse } from "@/interfaces/product"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import ProductCard from "@/components/product-card"

export default function SearchPage() {
  const keyword = useSearchParams().get("keyword")

  const [products, setProducts] = useState<product[] | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    async function fetch() {
      try {
        const result = (
          await useClientFetch.get<productApiResponse[]>(
            `/api/product/search/${keyword}?limit=100`
          )
        ).data
        if (result) {
          setProducts(
            result.map((product) => ({
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
            }))
          )
        }
      } catch (err) {
        console.log(err)
        toast({
          variant: "destructive",
          title: "Error",
          description: `Something went wrong`,
          duration: 3000,
        })
      }
    }
    fetch()
  }, [keyword])

  return (
    <>
      <Navbar />
      <PageTransition>
        <div className="flex justify-center md:p-5 sm:p-3 mt-3">
          <main className="container">
            <h1 className="text-xl font-semibold mb-4">
              Search result for {keyword}
            </h1>
            <div className="grid 2xl:grid-cols-7 lg:grid-cols-6 md:grid-cols-4 grid-cols-3 lg:gap-4 gap-3 mb-5">
              {products?.map((product, index) => (
                <Link key={index} href={`/${product.storeId}/${product.id}`}>
                  <ProductCard {...product} />
                </Link>
              ))}
            </div>
          </main>
        </div>
      </PageTransition>
    </>
  )
}

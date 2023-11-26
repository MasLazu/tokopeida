import Navbar from "@/components/navbar"
import HomeCarosel from "@/components/home-carosel"
import ProductSlider from "@/components/product-slider"
import ProductCard from "@/components/product-card"
import Link from "next/link"
import PageTransition from "@/components/page-pransition"
import { useServerFetch } from "@/hooks/useServerFetch"
import { productApiResponse, product } from "@/interfaces/product"
import Explore from "@/app/explore"

export default async function Home() {
  let formSearch: product[] = []
  try {
    const result = (
      await useServerFetch.get<productApiResponse[] | null>(
        `/api/product/explore/14`
      )
    )?.data
    if (result) {
      formSearch = result.map((product) => ({
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
    }
  } catch (err) {
    console.log(err)
  }

  let following: product[] = []
  try {
    const result = (
      await useServerFetch.get<productApiResponse[] | null>(
        `/api/product/explore/14`
      )
    )?.data
    if (result) {
      following = result.map((product) => ({
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
    }
  } catch (err) {
    console.log(err)
  }

  let explore: product[] = []
  try {
    const result = (
      await useServerFetch.get<productApiResponse[]>(`/api/product/explore/21`)
    )?.data
    if (result) {
      explore = result.map((product) => ({
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
    }
  } catch (err) {
    console.log(err)
  }

  return (
    <>
      <Navbar />
      <PageTransition>
        <div className="flex justify-center md:p-5 sm:p-3 mt-3">
          <main className="container">
            <HomeCarosel />
            <ProductSlider
              title="Based on your Search"
              productsData={formSearch}
            />
            <ProductSlider title="Following" productsData={following} />
            <Explore initExplore={explore} />
          </main>
        </div>
      </PageTransition>
    </>
  )
}

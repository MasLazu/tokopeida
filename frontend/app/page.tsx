import Navbar from "@/components/navbar"
import HomeCarosel from "@/components/home-carosel"
import ProductSlider from "@/components/product-slider"
import ProductCard from "@/components/product-card"
import Link from "next/link"
import PageTransition from "@/components/page-pransition"
import { useServerFetch } from "@/hooks/useServerFetch"
import { productApiResponse, product } from "@/interfaces/product"

export default async function Home() {
  let products: product[] = []
  try {
    const result = (
      await useServerFetch.get<productApiResponse[]>(`/api/product/explore/14`)
    )?.data
    products = result.map((product) => ({
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
              productsData={products}
            />
            <ProductSlider title="Following" productsData={products} />
            <div className="row pt-5">
              <h3 className="text-xl font-semibold my-2">For You</h3>
              <div className="grid 2xl:grid-cols-7 lg:grid-cols-6 md:grid-cols-4 grid-cols-3 lg:gap-4 gap-3 mb-5">
                {products.map((product, index) => (
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
            </div>
          </main>
        </div>
      </PageTransition>
    </>
  )
}

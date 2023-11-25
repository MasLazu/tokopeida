import Navbar from "@/components/navbar"

import PageTransition from "@/components/page-pransition"
import { product, productApiResponse } from "@/interfaces/product"
import { useServerFetch } from "@/hooks/useServerFetch"
import CartMain from "./cartMain"

export default async function StorePage() {
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
        <div className="flex justify-center md:p-5 sm:p-3 mt-4">
          <CartMain products={products} />
        </div>
      </PageTransition>
    </>
  )
}

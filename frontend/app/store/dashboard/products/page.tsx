import { useServerFetch } from "@/hooks/useServerFetch"
import { productApiResponse, product } from "@/interfaces/product"
import TableProduct from "@/components/dashboard/tableProduct"
import { useGetServerContext } from "@/hooks/useGetServerContext"
import { ScrollArea } from "@/components/ui/scroll-area"

export default async function ProductsDashboard() {
  const { store } = await useGetServerContext()

  let products: product[] = []
  let productsResponse: productApiResponse[] = []
  try {
    productsResponse = (
      await useServerFetch.get<productApiResponse[]>(
        `/api/store/${store?.id}/product`
      )
    ).data

    products = productsResponse.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      images: product.images,
      storeId: product.store_id,
      createdAt: new Date(product.created_at),
      updatedAt: new Date(product.updated_at),
    }))
  } catch (err) {
    console.log(err)
  }

  return (
    <main className="h-screen">
      <ScrollArea className="h-full">
        <div className="p-4 top-row">
          <h1 className="text-2xl font-bold">Product List</h1>
        </div>
        <TableProduct initProducts={products} />
      </ScrollArea>
    </main>
  )
}

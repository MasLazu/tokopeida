import Navbar from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { BsShare } from "react-icons/bs"
import { FaStar } from "react-icons/fa6"
import PageTransition from "@/components/page-pransition"
import { useServerFetch } from "@/hooks/useServerFetch"
import { productApiResponse, product } from "@/interfaces/product"
import { store, storeApiResponse } from "@/interfaces/store"
import Link from "next/link"
import ProductCard from "@/components/product-card"

export default async function StorePage({
  params,
}: {
  params: { store: string }
}) {
  let products: product[] = []
  try {
    const result = (
      await useServerFetch.get<productApiResponse[]>(
        `/api/store/${params.store}/product`
      )
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
    console.log(products)
  } catch (err) {
    console.log(err)
  }

  let storeData: store | null = null
  try {
    const result = (
      await useServerFetch.get<storeApiResponse>(`/api/store/${params.store}`)
    )?.data
    storeData = {
      id: result.id,
      name: result.name,
      city: result.city,
      createdAt: new Date(result.created_at),
      updatedAt: new Date(result.updated_at),
    }
  } catch (err) {
    console.log(err)
  }

  return (
    <>
      <Navbar />
      <PageTransition>
        <div className="flex justify-center mt-5 md:p-5 sm:p-3">
          <main className="container">
            <Card className="p-7">
              <div className="flex md:justify-between items-center">
                <div className="left flex gap-7">
                  <Avatar className="sm:w-32 sm:h-32 h-16 w-16">
                    <AvatarFallback className="text-5xl font-semibold bg-blue-400 text-background">
                      CN
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col justify-between">
                    <div className="info">
                      <h1 className="text-2xl font-semibold truncate">
                        {storeData?.name}
                      </h1>
                      <p className="text-md text-muted-foreground">
                        {storeData?.city}
                      </p>
                    </div>
                    <div className="action sm:grid grid-cols-7 gap-3 hidden">
                      <Button className="col-span-3">Follow</Button>
                      <Button variant="outline" className="col-span-3">
                        Message
                      </Button>
                      <Button variant="outline">
                        <BsShare className="w-4 h-4 text-foreground" />
                      </Button>
                    </div>
                  </div>
                </div>
                {/* <div className="right lg:grid grid-cols-11 hidden">
                  <div className="rating col-span-3 flex flex-col items-center justify-center text-muted-foreground text-sm lg:text-xs xl:text-sm text-center">
                    <div className="flex items-center text-lg text-primary font-bold gap-2">
                      <FaStar className="text-amber-400 w-[1.3rem] h-[1.3rem]" />
                      4.9
                    </div>
                    ratings & reviews
                  </div>
                  <Separator orientation="vertical" className="mx-auto" />
                  <div className="rating col-span-3 flex flex-col items-center justify-center text-muted-foreground text-sm lg:text-xs xl:text-sm">
                    <div className="text-lg text-primary font-bold gap-2">
                      200+
                    </div>
                    items sold
                  </div>
                  <Separator orientation="vertical" className="mx-auto" />
                  <div className="rating col-span-3 flex flex-col items-center justify-center text-muted-foreground text-sm lg:text-xs xl:text-sm">
                    <div className="text-lg text-primary font-bold gap-2">
                      1000+
                    </div>
                    followers
                  </div>
                </div> */}
              </div>
              <div className="action grid grid-cols-5 gap-3 sm:hidden mt-4">
                <Button className="col-span-2" size="sm">
                  Follow
                </Button>
                <Button variant="outline" className="col-span-2" size="sm">
                  Message
                </Button>
                <Button variant="outline" size="sm">
                  <BsShare className="w-4 h-4 text-foreground" />
                </Button>
              </div>
            </Card>
            <div className="row pt-5">
              <div className="grid 2xl:grid-cols-7 lg:grid-cols-6 md:grid-cols-4 grid-cols-3 lg:gap-4 gap-3 mb-5">
                {products.map((product, index) => (
                  <Link key={index} href={`/${product.storeId}/${product.id}`}>
                    <ProductCard {...product} />
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

export const dynamicParams = true

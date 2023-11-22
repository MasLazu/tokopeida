import Navbar from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { FaStar } from "react-icons/fa6"
import { HiMiniChatBubbleLeftRight } from "react-icons/hi2"
import ProductSlider from "@/components/product-slider"
import ProductImageCarosel from "@/components/product-image-carosel"
import { Progress } from "@/components/ui/progress"
import PageTransition from "@/components/page-pransition"
import { product, productApiResponse } from "@/interfaces/product"
import { useServerFetch } from "@/hooks/useServerFetch"
import BuyProductPopup from "@/components/popup/product-action"
import WishlistButton from "./wishlistButton"
import { store, storeApiResponse } from "@/interfaces/store"

export default async function ProductPage({
  params,
}: {
  params: { store: string; productId: string }
}) {
  let product: product = {
    id: "",
    name: "",
    description: "",
    price: 0,
    stock: 0,
    images: [],
    storeId: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  try {
    const result = (
      await useServerFetch.get<productApiResponse>(
        `/api/product/${params.productId}`
      )
    )?.data
    product = {
      id: result.id,
      name: result.name,
      description: result.description,
      price: result.price,
      stock: result.stock,
      images: result.images,
      storeId: result.store_id,
      createdAt: new Date(result.created_at),
      updatedAt: new Date(result.updated_at),
    }
  } catch (err) {
    console.log(err)
  }

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
      images: product.images,
      storeId: product.store_id,
      createdAt: new Date(product.created_at),
      updatedAt: new Date(product.updated_at),
    }))
  } catch (err) {
    console.log(err)
  }

  let store: store | null = null
  try {
    const result = (
      await useServerFetch.get<storeApiResponse>(`/api/store/${params.store}`)
    ).data
    store = {
      id: result.id,
      name: result.name,
      city: result.city,
      createdAt: new Date(result.created_at),
      updatedAt: new Date(result.updated_at),
    }
    console.log(store)
  } catch (err) {
    console.log(err)
  }

  return (
    <>
      <Navbar />
      <PageTransition>
        <div className="flex justify-center md:p-5 sm:p-3 mt-4">
          <main className="container lg:grid lg:grid-cols-2 xl:gap-x-24 gap-x-12">
            <div>
              <Card>
                <ProductImageCarosel filenames={product?.images} />
              </Card>
            </div>
            <div className="info lg:mt-0 md:mt-6 mt-4">
              <h1 className="md:text-3xl text-2xl font-semibold mb-2">
                {product?.name}
              </h1>
              <div className="flex md:gap-6 gap-4 items-center">
                <div className="flex md:gap-2 gap-1">
                  <FaStar className="text-amber-400 w-5 h-5" />
                  <FaStar className="text-amber-400 w-5 h-5" />
                  <FaStar className="text-amber-400 w-5 h-5" />
                  <FaStar className="text-amber-400 w-5 h-5" />
                  <FaStar className="text-slate-200 w-5 h-5" />
                </div>
                <Separator orientation="vertical" className="h-6" />
                <p className="text-md text-slate-600">200+ sold</p>
              </div>
              <h2 className="md:text-5xl text-4xl font-semibold my-8">
                Rp. {product?.price.toLocaleString().replace(/,/g, ".")}
              </h2>
              <div className="flex gap-4 md:hidden">
                <div className="grid grid-cols-2 gap-4 mb-8 flex-grow">
                  <BuyProductPopup product={product} variant="buy" />
                  <BuyProductPopup product={product} variant="add-to-cart" />
                </div>
                <WishlistButton productId={params.productId} />
              </div>
              <div className="flex gap-4 items-center my-6 md:hidden">
                <Avatar className="w-14 h-14">
                  <AvatarFallback className="bg-blue-400 font-semibold text-background">
                    CN
                  </AvatarFallback>
                </Avatar>
                <div className="info flex-grow">
                  <h3 className="text-xl font-semibold">{store?.name}</h3>
                  <p className="text-md text-muted-foreground">{store?.city}</p>
                </div>
                <Button variant="outline" size="icon">
                  <HiMiniChatBubbleLeftRight className="text-foreground h-4 w-4" />
                </Button>
                <Button variant="outline">Follow</Button>
              </div>
              <p className="max-h-[7.5rem] overflow-hidden">
                {product?.description}
              </p>
              <div className="md:flex hidden gap-4 items-center my-8">
                <Avatar className="w-14 h-14">
                  <AvatarFallback className="bg-blue-400 font-semibold text-background text-xl">
                    CN
                  </AvatarFallback>
                </Avatar>
                <div className="info flex-grow">
                  <h3 className="text-xl font-semibold">{store?.name}</h3>
                  <p className="text-md text-muted-foreground">{store?.city}</p>
                </div>
                <Button variant="outline" size="icon">
                  <HiMiniChatBubbleLeftRight className="text-foreground h-4 w-4" />
                </Button>
                <Button variant="outline">Follow</Button>
              </div>
              <div className="md:flex gap-4 hidden">
                <div className="grid grid-cols-2 gap-4 mb-8 flex-grow">
                  <BuyProductPopup product={product} variant="buy" />
                  <BuyProductPopup product={product} variant="add-to-cart" />
                </div>
                <WishlistButton productId={params.productId} />
              </div>
            </div>
            <div className="user-reviews col-span-2 md:grid md:grid-cols-3 gap-x-16">
              <h2 className="col-span-3 text-2xl font-semibold mt-9 mb-8">
                User Reviews
              </h2>
              <div className="resume flex-col flex items-center gap-1">
                <div className="flex gap-4 items-center justify-center">
                  <FaStar className="text-amber-400 w-12 h-12" />
                  <div className="flex gap-1">
                    <span className="text-6xl font-semibold">4.8</span>
                    <span className="text-2xl text-muted-foreground self-end">
                      /5.0
                    </span>
                  </div>
                </div>
                <span className="text-lg text-muted-foreground">
                  18 reviews
                </span>
                <div className="w-full my-4 flex flex-col gap-2">
                  <div className="rating-presentation flex items-center gap-3">
                    <div className="flex items-center gap-1 text-muted-foreground font-semibold">
                      <FaStar className="text-amber-400 w-5 h-5" />5
                    </div>
                    <Progress value={70} className="flex-grow h-3" />
                    <div className="text-muted-foreground font-semibold w-11">
                      27
                    </div>
                  </div>
                  <div className="rating-presentation flex items-center gap-3">
                    <div className="flex items-center gap-1 text-muted-foreground font-semibold">
                      <FaStar className="text-amber-400 w-5 h-5" />4
                    </div>
                    <Progress value={10} className="flex-grow h-3" />
                    <div className="text-muted-foreground font-semibold w-11">
                      4
                    </div>
                  </div>
                  <div className="rating-presentation flex items-center gap-3">
                    <div className="flex items-center gap-1 text-muted-foreground font-semibold">
                      <FaStar className="text-amber-400 w-5 h-5" />3
                    </div>
                    <Progress value={0} className="flex-grow h-3" />
                    <div className="text-muted-foreground font-semibold w-11">
                      0
                    </div>
                  </div>
                  <div className="rating-presentation flex items-center gap-3">
                    <div className="flex items-center gap-1 text-muted-foreground font-semibold">
                      <FaStar className="text-amber-400 w-5 h-5" />2
                    </div>
                    <Progress value={0} className="flex-grow h-3" />
                    <div className="text-muted-foreground font-semibold w-11">
                      0
                    </div>
                  </div>
                  <div className="rating-presentation flex items-center gap-3">
                    <div className="flex items-center gap-1 text-muted-foreground font-semibold">
                      <FaStar className="text-amber-400 w-5 h-5" />1
                    </div>
                    <Progress value={20} className="flex-grow h-3" />
                    <div className="text-muted-foreground font-semibold w-11">
                      8
                    </div>
                  </div>
                </div>
              </div>
              <div className="featured-reviews col-span-2">
                <h3 className="text-xl font-semibold mb-3">Featured Reviews</h3>
                <Separator orientation="horizontal" className="my-3" />
                <div className="review">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex gap-4 items-center">
                      <Avatar className="w-11 h-11">
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt="@shadcn"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-lg">Rizaldy</span>
                    </div>
                    <div className="flex md:gap-2 gap-1">
                      <FaStar className="text-amber-400 w-5 h-5" />
                      <FaStar className="text-amber-400 w-5 h-5" />
                      <FaStar className="text-amber-400 w-5 h-5" />
                      <FaStar className="text-amber-400 w-5 h-5" />
                      <FaStar className="text-slate-200 w-5 h-5" />
                    </div>
                  </div>
                  <p>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Nobis molestiae commodi quidem omnis perferendis delectus.
                  </p>
                </div>
                <Separator orientation="horizontal" className="my-3" />
                <div className="review">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex gap-4 items-center">
                      <Avatar className="w-11 h-11">
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt="@shadcn"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-lg">Rangga</span>
                    </div>
                    <div className="flex md:gap-2 gap-1">
                      <FaStar className="text-amber-400 w-5 h-5" />
                      <FaStar className="text-amber-400 w-5 h-5" />
                      <FaStar className="text-amber-400 w-5 h-5" />
                      <FaStar className="text-amber-400 w-5 h-5" />
                      <FaStar className="text-amber-400 w-5 h-5" />
                    </div>
                  </div>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </p>
                </div>
                <Separator orientation="horizontal" className="my-3" />
                <div className="review">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex gap-4 items-center">
                      <Avatar className="w-11 h-11">
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt="@shadcn"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-lg">Eric</span>
                    </div>
                    <div className="flex md:gap-2 gap-1">
                      <FaStar className="text-amber-400 w-5 h-5" />
                      <FaStar className="text-amber-400 w-5 h-5" />
                      <FaStar className="text-amber-400 w-5 h-5" />
                      <FaStar className="text-slate-200 w-5 h-5" />
                      <FaStar className="text-slate-200 w-5 h-5" />
                    </div>
                  </div>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Repellendus non at reiciendis adipisci necessitatibus
                    placeat sed, natus ratione possimus dicta sequi minus. Alias
                    ab dicta eaque molestias? Quis, natus saepe?
                  </p>
                </div>
                <Separator orientation="horizontal" className="my-3" />
                <div className="review">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex gap-4 items-center">
                      <Avatar className="w-11 h-11">
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt="@shadcn"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-lg">Yanto</span>
                    </div>
                    <div className="flex md:gap-2 gap-1">
                      <FaStar className="text-amber-400 w-5 h-5" />
                      <FaStar className="text-amber-400 w-5 h-5" />
                      <FaStar className="text-slate-200 w-5 h-5" />
                      <FaStar className="text-slate-200 w-5 h-5" />
                      <FaStar className="text-slate-200 w-5 h-5" />
                    </div>
                  </div>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Placeat delectus, deleniti, recusandae beatae quam ullam
                    nobis dolor unde quos libero architecto deserunt ab, error
                    assumenda natus mollitia amet dolorem necessitatibus odit?
                    Adipisci deserunt, reiciendis odit, blanditiis nam
                    voluptatem ullam quaerat cum soluta magnam atque magni!
                    Optio, porro mollitia. Doloribus, fuga.
                  </p>
                </div>
                <Separator orientation="horizontal" className="my-3" />
              </div>
            </div>
            <ProductSlider
              className="col-span-2"
              title="Related Product"
              productsData={products}
            />
            <ProductSlider
              className="col-span-2"
              title="For You"
              productsData={products}
            />
          </main>
        </div>
      </PageTransition>
    </>
  )
}

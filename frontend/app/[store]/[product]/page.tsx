import Navbar from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { FaStar } from "react-icons/fa6"
import { HiMiniChatBubbleLeftRight } from "react-icons/hi2"
import ProductSlider from "@/components/product-slider"
import ProductImageCarosel from "@/components/product-image-carosel"

export default function ProductPage({
  params,
}: {
  params: { store: string; product: string }
}) {
  return (
    <>
      <Navbar />
      <div className="flex justify-center p-5 mt-4">
        <main className="container grid grid-cols-2 gap-x-24">
          <div>
            <Card>
              <ProductImageCarosel />
            </Card>
          </div>
          <div className="info">
            <h1 className="text-3xl font-semibold mb-2">{params.product}</h1>
            <div className="flex gap-6 items-center">
              <div className="flex gap-2">
                <FaStar className="text-amber-400 w-5 h-5" />
                <FaStar className="text-amber-400 w-5 h-5" />
                <FaStar className="text-amber-400 w-5 h-5" />
                <FaStar className="text-amber-400 w-5 h-5" />
                <FaStar className="text-slate-200 w-5 h-5" />
              </div>
              <Separator orientation="vertical" className="h-6" />
              <p className="text-md text-slate-600">200+ sold</p>
            </div>
            <h2 className="text-5xl font-semibold my-8">Rp.490.000</h2>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Suscipit
              nesciunt tempore, fuga omnis sunt tempora recusandae sit quas a
              eos reiciendis esse dignissimos nam voluptas minus laboriosam
              iusto ipsam commodi in, voluptates accusamus, voluptatibus natus.
              Earum adipisci cumque veniam libero aperiam recusandae quo labore
              rerum, doloremque nobis sunt mollitia nihil reiciendis sed ea
              consequatur.
            </p>
            <div className="flex gap-4 items-center my-8">
              <Avatar className="w-14 h-14">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="info flex-grow">
                <h3 className="text-xl font-semibold">{params.store}</h3>
                <p className="text-md text-muted-foreground">jakarta Utara</p>
              </div>
              <Button variant="outline" size="icon">
                <HiMiniChatBubbleLeftRight className="text-foreground h-4 w-4" />
              </Button>
              <Button variant="outline">Follow</Button>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <Button size="lg">Buy Now</Button>
              <Button variant="secondary" size="lg">
                Add to Cart
              </Button>
            </div>
          </div>
          <ProductSlider className="col-span-2" title="Related Product" />
          <ProductSlider className="col-span-2" title="For You" />
        </main>
      </div>
    </>
  )
}

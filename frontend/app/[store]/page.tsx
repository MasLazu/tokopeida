import Navbar from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { BsShare } from "react-icons/bs"
import { FaStar } from "react-icons/fa6"
import ProductSlider from "@/components/product-slider"
import PageTransition from "@/components/page-pransition"

export default function StorePage({ params }: { params: { store: string } }) {
  return (
    <>
      <Navbar />
      <PageTransition>
        <div className="flex justify-center p-5">
          <main className="container">
            <Card className="p-7">
              <div className="flex md:justify-between items-center">
                <div className="left flex gap-7">
                  <Avatar className="w-32 h-32">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col justify-between">
                    <div className="info">
                      <h1 className="text-2xl font-semibold truncate">
                        {params.store}
                      </h1>
                      <p className="text-md text-muted-foreground">
                        jakarta Utara
                      </p>
                    </div>
                    <div className="action grid grid-cols-7 gap-3">
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
                <div className="right lg:grid grid-cols-11 hidden">
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
                </div>
              </div>
            </Card>
            <ProductSlider title="Best Selling Products" />
            <ProductSlider title="Newest Products" />
            <ProductSlider title="Most Viewed Products" />
          </main>
        </div>
      </PageTransition>
    </>
  )
}
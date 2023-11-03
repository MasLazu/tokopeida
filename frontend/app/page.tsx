import Navbar from "@/components/navbar"
import HomeCarosel from "@/components/home-carosel"
import ProductSlider from "@/components/product-slider"

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="flex justify-center p-5 mt-3">
        <main className="container">
          <HomeCarosel />
          <ProductSlider title="For you" />
          <ProductSlider title="Based on your Search" />
        </main>
      </div>
    </>
  )
}

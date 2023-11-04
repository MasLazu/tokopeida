import Navbar from "@/components/navbar"
import HomeCarosel from "@/components/home-carosel"
import ProductSlider from "@/components/product-slider"
import ProductCard from "@/components/product-card"
import Link from "next/link"
import PageTransition from "@/components/page-pransition"

export default function Home() {
  const productDataDummy = [
    {
      title: "EIGER HELICON WATCH - Olive",
      img: "https://images.tokopedia.net/img/cache/700/VqbcmM/2021/6/21/7b67647e-0a99-46de-834a-c325889035fb.jpg.webp?ect=4g",
      price: 499000,
      rating: 4.5,
      sold: 100,
    },
    {
      title: "Palomino Wilmor Handbag - Black",
      img: "https://images.tokopedia.net/img/cache/900/VqbcmM/2023/9/5/daac7560-0d81-4f9a-b7f9-f13496c6e9f8.jpg",
      price: 359250,
      rating: 5,
      sold: 2,
    },
    {
      title:
        "SSD M2 NVME / M.2 NVME/ M2NVME 128GB KAIZEN RESMI (GARANSI 5 TAHUN)",
      img: "https://images.tokopedia.net/img/cache/900/VqbcmM/2023/8/4/126f961d-1185-419f-a384-d16f93330c6d.jpg",
      price: 174000,
      rating: 4.9,
      sold: 108,
    },
    {
      title: "EIGER HELICON WATCH - Olive",
      img: "https://images.tokopedia.net/img/cache/700/VqbcmM/2021/6/21/7b67647e-0a99-46de-834a-c325889035fb.jpg.webp?ect=4g",
      price: 499000,
      rating: 4.5,
      sold: 100,
    },
    {
      title: "Palomino Wilmor Handbag - Black",
      img: "https://images.tokopedia.net/img/cache/900/VqbcmM/2023/9/5/daac7560-0d81-4f9a-b7f9-f13496c6e9f8.jpg",
      price: 359250,
      rating: 5,
      sold: 2,
    },
    {
      title:
        "SSD M2 NVME / M.2 NVME/ M2NVME 128GB KAIZEN RESMI (GARANSI 5 TAHUN)",
      img: "https://images.tokopedia.net/img/cache/900/VqbcmM/2023/8/4/126f961d-1185-419f-a384-d16f93330c6d.jpg",
      price: 174000,
      rating: 4.9,
      sold: 108,
    },
    {
      title: "EIGER HELICON WATCH - Olive",
      img: "https://images.tokopedia.net/img/cache/700/VqbcmM/2021/6/21/7b67647e-0a99-46de-834a-c325889035fb.jpg.webp?ect=4g",
      price: 499000,
      rating: 4.5,
      sold: 100,
    },
    {
      title: "Palomino Wilmor Handbag - Black",
      img: "https://images.tokopedia.net/img/cache/900/VqbcmM/2023/9/5/daac7560-0d81-4f9a-b7f9-f13496c6e9f8.jpg",
      price: 359250,
      rating: 5,
      sold: 2,
    },
    {
      title:
        "SSD M2 NVME / M.2 NVME/ M2NVME 128GB KAIZEN RESMI (GARANSI 5 TAHUN)",
      img: "https://images.tokopedia.net/img/cache/900/VqbcmM/2023/8/4/126f961d-1185-419f-a384-d16f93330c6d.jpg",
      price: 174000,
      rating: 4.9,
      sold: 108,
    },
    {
      title: "EIGER HELICON WATCH - Olive",
      img: "https://images.tokopedia.net/img/cache/700/VqbcmM/2021/6/21/7b67647e-0a99-46de-834a-c325889035fb.jpg.webp?ect=4g",
      price: 499000,
      rating: 4.5,
      sold: 100,
    },
    {
      title: "Palomino Wilmor Handbag - Black",
      img: "https://images.tokopedia.net/img/cache/900/VqbcmM/2023/9/5/daac7560-0d81-4f9a-b7f9-f13496c6e9f8.jpg",
      price: 359250,
      rating: 5,
      sold: 2,
    },
    {
      title:
        "SSD M2 NVME / M.2 NVME/ M2NVME 128GB KAIZEN RESMI (GARANSI 5 TAHUN)",
      img: "https://images.tokopedia.net/img/cache/900/VqbcmM/2023/8/4/126f961d-1185-419f-a384-d16f93330c6d.jpg",
      price: 174000,
      rating: 4.9,
      sold: 108,
    },
  ]
  return (
    <>
      <Navbar />
      <PageTransition>
        <div className="flex justify-center md:p-5 sm:p-3 mt-3">
          <main className="container">
            <HomeCarosel />
            <ProductSlider title="Based on your Search" />
            <ProductSlider title="Following" />
            <div className="row pt-5">
              <h3 className="text-xl font-semibold my-2">For You</h3>
              <div className="grid 2xl:grid-cols-7 lg:grid-cols-6 md:grid-cols-4 grid-cols-3 gap-4 mb-5">
                {productDataDummy.map((product, index) => (
                  <Link
                    href={`/yanto-store/${product.title.replace(
                      /\s+|\//g,
                      "-"
                    )}`}
                  >
                    <ProductCard key={index} {...product} />
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

import Navbar from "@/components/navbar"
import PageTransition from "@/components/page-pransition"

export default function Wishlist() {
  return (
    <>
      <Navbar />
      <PageTransition>
        <div className="flex justify-center md:p-5 sm:p-3 mt-3">
          <main className="container grid 2xl:grid-cols-7 lg:grid-cols-6 md:grid-cols-4 grid-cols-3 lg:gap-4 gap-3 mb-5"></main>
        </div>
      </PageTransition>
    </>
  )
}

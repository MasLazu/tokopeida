"use client"
import { Button } from "@/components/ui/button"
import { FaHeart } from "react-icons/fa"
import { useClientFetch } from "@/hooks/useClientFetch"
import { useToast } from "@/components/ui/use-toast"
import { AxiosError } from "axios"

export default function WishlistButton({ productId }: { productId: string }) {
  const { toast } = useToast()
  async function handleWishlist() {
    try {
      await useClientFetch.post(`/api/wishlist/${productId}`)
      toast({
        title: "Success",
        description: "Product added to wishlist",
        duration: 3000,
      })
    } catch (err) {
      const error = err as AxiosError<{ message: string }>
      console.log(err)
      toast({
        title: "Failed to add product to wishlist",
        description:
          error.response?.data.message.toString() ?? "Something went wrong",
        duration: 3000,
        variant: "destructive",
      })
    }
  }

  return (
    <Button variant="outline" onClick={() => handleWishlist()}>
      <FaHeart />
    </Button>
  )
}

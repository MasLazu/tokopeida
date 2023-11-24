"use client"
import { Button } from "@/components/ui/button"
import { FaHeart } from "react-icons/fa"
import { useClientFetch } from "@/hooks/useClientFetch"
import { useToast } from "@/components/ui/use-toast"
import { AxiosError } from "axios"
import { useContext } from "react"
import { WishlistsContext } from "@/app/wishlist-profider"
import { productApiResponse } from "@/interfaces/product"

export default function WishlistButton({ productId }: { productId: string }) {
  const { wishlists, setWishlists } = useContext(WishlistsContext)
  const { toast } = useToast()

  async function handleWishlist() {
    if (wishlists.find((wishlist) => wishlist.id === productId)) {
      try {
        await useClientFetch.delete(`/api/wishlist/${productId}`)
        setWishlists(wishlists.filter((wishlist) => wishlist.id !== productId))
        toast({
          title: "Success",
          description: "Product removed from wishlist",
          duration: 3000,
        })
      } catch (err) {
        const error = err as AxiosError<{ message: string }>
        console.log(err)
        toast({
          title: "Failed to remove product from wishlist",
          description:
            error.response?.data.message.toString() ?? "Something went wrong",
          duration: 3000,
          variant: "destructive",
        })
      }
    } else {
      try {
        const result = (
          await useClientFetch.post<productApiResponse>(
            `/api/wishlist/${productId}`
          )
        ).data
        toast({
          title: "Success",
          description: "Product added to wishlist",
          duration: 3000,
        })
        setWishlists([
          ...wishlists,
          {
            id: result.id,
            name: result.name,
            description: result.description,
            price: result.price,
            stock: result.stock,
            sold: result.sold,
            images: result.images,
            storeId: result.store_id,
            createdAt: new Date(result.created_at),
            updatedAt: new Date(result.updated_at),
          },
        ])
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
  }

  return (
    <Button variant="outline" onClick={() => handleWishlist()}>
      <FaHeart
        className={
          wishlists.find((wishlist) => wishlist.id === productId)
            ? "text-red-500"
            : "text-foreground"
        }
      />
    </Button>
  )
}

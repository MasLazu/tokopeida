"use client"

import { product } from "@/interfaces/product"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { Switch } from "@/components/ui/switch"
import { useEffect, useState } from "react"
import { useClientFetch } from "@/hooks/useClientFetch"
import { productApiResponse } from "@/interfaces/product"
import { StoreContext } from "@/app/store-provider"
import { useContext } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import AddProductPopup from "@/components/popup/add-product"
import { Input } from "@/components/ui/input"

export default function TableProduct({
  initProducts,
}: {
  initProducts: product[]
}) {
  const [products, setProducts] = useState<product[]>(initProducts)
  const { store } = useContext(StoreContext)

  const fatchProducts = async () => {
    try {
      const result = (
        await useClientFetch.get<productApiResponse[]>(
          `/api/store/${store?.id}/product`
        )
      ).data
      setProducts(
        result.map((product) => ({
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
      )
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fatchProducts()
  }, [])

  return (
    <div className="px-4 pb-4">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <Input placeholder="Search" className="w-72" />
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="non active">Non Active</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <AddProductPopup refetchProduct={fatchProducts} />
      </div>
      <Card className="p-3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Info</TableHead>
              <TableHead>Sold</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              {/* <TableHead>Active</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell
                  className="font-medium flex items-center gap-3"
                  key={product.id}
                >
                  <Image
                    className="rounded-md object-cover"
                    src={
                      product.images
                        ? `${process.env.NEXT_PUBLIC_DOMAIN}/api/assets/product_images/${product.images[0]}`
                        : "https://images.tokopedia.net/img/cache/700/VqbcmM/2021/6/21/7b67647e-0a99-46de-834a-c325889035fb.jpg.webp?ect=4g"
                    }
                    alt="produc photo"
                    height={70}
                    width={70}
                  />
                  <div className="w-64">{product.name}</div>
                </TableCell>
                <TableCell>{product.sold}</TableCell>
                <TableCell>
                  Rp. {product.price.toLocaleString().replace(/,/g, ".")}
                </TableCell>
                <TableCell>{product.stock}</TableCell>
                {/* <TableCell>
                  <Switch checked={true} />
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

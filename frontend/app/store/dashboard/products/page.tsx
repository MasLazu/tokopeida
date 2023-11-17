import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import Image from "next/image"
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

export default function ProductsDashboard() {
  const products = [
    {
      id: "lkajfdoaifoandmfoaiwefalksdfjoeifja",
      title: "SSD M2 NVME / M.2 NVME/ M2NVME 512GB KAIZEN RESMI",
      img: "https://images.tokopedia.net/img/cache/100-square/VqbcmM/2023/8/4/b6136181-3a9e-47d0-9bd5-cfd2abcf4b19.jpg.webp?ect=4g",
      ratings: 4.5,
      price: 499000,
      stock: 10,
      active: true,
    },
    {
      id: "lkajfdoaifoanawdawdawdfrght6fjhgjgytj",
      title: "EIGER HELICON WATCH - Olive",
      img: "https://images.tokopedia.net/img/cache/700/VqbcmM/2021/6/21/7b67647e-0a99-46de-834a-c325889035fb.jpg.webp?ect=4g",
      ratings: 4,
      price: 80000,
      stock: 5,
      active: true,
    },
    {
      id: "lkajfdoaifhfhjfjwdfrght6fjhgjgytj",
      title: "EIGER HELICON WATCH - Olive",
      img: "https://images.tokopedia.net/img/cache/900/VqbcmM/2023/9/5/daac7560-0d81-4f9a-b7f9-f13496c6e9f8.jpg",
      ratings: 5,
      price: 66000,
      stock: 0,
      active: false,
    },
  ]

  return (
    <main>
      <div className="p-4 top-row">
        <h1 className="text-2xl font-bold">Product List</h1>
      </div>
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
          <Button> + Add Product</Button>
        </div>
        <Card className="p-3">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Info</TableHead>
                <TableHead>Ratings</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((products) => (
                <TableRow key={products.id}>
                  <TableCell className="font-medium flex items-center gap-3">
                    <Image
                      className="rounded-md object-cover"
                      src={products.img}
                      alt="produc photo"
                      height={70}
                      width={70}
                    />
                    <div className="w-64">{products.title}</div>
                  </TableCell>
                  <TableCell>{products.ratings}</TableCell>
                  <TableCell>{products.price}</TableCell>
                  <TableCell>{products.stock}</TableCell>
                  <TableCell>
                    <Switch checked={products.active} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </main>
  )
}

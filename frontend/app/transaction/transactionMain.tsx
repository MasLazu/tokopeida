"use client"

import PageTransition from "@/components/page-pransition"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useClientFetch } from "@/hooks/useClientFetch"
import { AspectRatio } from "@radix-ui/react-aspect-ratio"
import { transaction, transactionApiResponse } from "@/interfaces/transaction"
import Link from "next/link"

export default function TransactionMain() {
  const [data, setData] = useState<transaction[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const res = (
          await useClientFetch.get<transactionApiResponse[]>(
            "/api/user/current/transaction"
          )
        ).data
        setData(
          res.map((transaction) => ({
            id: transaction.id,
            userEmail: transaction.user_email,
            quantity: transaction.quantity,
            createdAt: new Date(transaction.created_at),
            product: {
              id: transaction.product.id,
              name: transaction.product.name,
              description: transaction.product.description,
              price: transaction.product.price,
              stock: transaction.product.stock,
              sold: transaction.product.sold,
              images: transaction.product.images,
              storeId: transaction.product.store_id,
              createdAt: new Date(transaction.product.created_at),
              updatedAt: new Date(transaction.product.updated_at),
            },
          }))
        )
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [])

  return (
    <PageTransition>
      <div className="flex justify-center md:p-5 sm:p-3 mt-3">
        <main className="container">
          <h1 className="md:text-2xl sm:text-xl text-lg font-semibold mb-4">
            Transaction History
          </h1>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            {data.map((transaction) => (
              <Card className="p-5" key={transaction.id}>
                <div className="flex justify-between md:text-xl sm:text-lg font-semibold mb-3 gap-3">
                  <h5 className="truncate">{transaction.product.name}</h5>
                  <div className="min-w-fit">
                    Rp.{" "}
                    {(transaction.product.price * transaction.quantity)
                      .toLocaleString()
                      .replace(/,/g, ".")}
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <Card className="sm:w-56 w-36">
                    <AspectRatio
                      ratio={16 / 13}
                      className="bg-muted rounded-md"
                    >
                      <Image
                        className="rounded-md object-cover"
                        src={
                          transaction.product.images
                            ? `${process.env.NEXT_PUBLIC_DOMAIN}/api/assets/product_images/${transaction.product.images[0]}`
                            : "https://layanan.karangbaru.acehtamiangkab.go.id/uploads/no-available.png"
                        }
                        alt="product photo"
                        fill
                      />
                    </AspectRatio>
                  </Card>
                  <div className="max-w-[60%] sm:text-base text-[0.8rem]">
                    <div className="text-muted-foreground truncate">
                      Order ID : {transaction.id}
                    </div>
                    <div className="text-muted-foreground truncate">
                      Date :{" "}
                      {`${transaction.createdAt.getDate()}/${transaction.createdAt.getMonth()}/${transaction.createdAt.getFullYear()}`}
                    </div>
                    <div className="text-muted-foreground truncate">
                      Price : Rp.{" "}
                      {transaction.product.price
                        .toLocaleString()
                        .replace(/,/g, ".")}
                    </div>
                    <div className="text-muted-foreground truncate">
                      Qty : {transaction.quantity}
                    </div>
                    {/* <div className="grid grid-cols-2 mt-3 gap-x-3">
                      <Button size="sm">Rate</Button> */}
                    <Link
                      href={`/${transaction.product.storeId}/${transaction.product.id}`}
                    >
                      <Button size="sm" className="w-full mt-5">
                        View Page
                      </Button>
                    </Link>
                    {/* </div> */}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </PageTransition>
  )
}

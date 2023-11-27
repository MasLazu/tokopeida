"use client"

import { Card } from "@/components/ui/card"
import { transaction, transactionApiResponse } from "@/interfaces/transaction"
import { useState, useEffect, useContext } from "react"
import { useClientFetch } from "@/hooks/useClientFetch"
import { StoreContext } from "@/app/store-provider"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function TransactionsDashboard() {
  const [data, setData] = useState<transaction[]>([])
  const { store } = useContext(StoreContext)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = (
          await useClientFetch.get<transactionApiResponse[]>(
            `/api/store/${store?.id}/transaction`
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
    <ScrollArea className="h-screen w-full p-4">
      <h1 className="text-2xl font-semibold mb-4">Store Transactions</h1>
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
              <div className="sm:text-base text-[0.8rem]">
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
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}

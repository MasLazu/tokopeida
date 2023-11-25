"use client"

import PageTransition from "@/components/page-pransition"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function TransactionMain() {
  return (
    <PageTransition>
      <div className="flex justify-center md:p-5 sm:p-3 mt-3">
        <main className="container">
          <h1 className="text-2xl font-semibold mb-4">Transaction History</h1>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-5">
              <h5 className="text-xl font-semibold mb-3 truncate">
                VortexSeries Meta Cube Deskmat Mousepad
              </h5>
              <div className="flex items-center gap-5">
                <Card>
                  <Image
                    className="rounded-md object-cover"
                    src={
                      "https://layanan.karangbaru.acehtamiangkab.go.id/uploads/no-available.png"
                    }
                    alt="product photo"
                    height={300}
                    width={300}
                  />
                </Card>
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div>
                    <div className="text text-muted-foreground mb-2">
                      Order ID : 1234567890
                    </div>
                    <div className="text text-muted-foreground mb-2">
                      Date : 12/12/2021
                    </div>
                  </div>
                  <div>
                    <div className="text text-muted-foreground mb-2">
                      Price : Rp. 100.000
                    </div>
                    <div className="text text-muted-foreground mb-2">
                      Qty : 1
                    </div>
                  </div>
                  <div className="col-span-2 flex justify-between items-center">
                    <p className="text-lg font-semibold">Total : Rp. 500.000</p>
                    <div className="flex gap-2">
                      <Button size="sm">Rate</Button>
                      <Button size="sm">View Page</Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            <Card className="p-5">
              <h5 className="text-xl font-semibold mb-3 truncate">
                VortexSeries Meta Cube Deskmat Mousepad
              </h5>
              <div className="flex items-center gap-5">
                <Card>
                  <Image
                    className="rounded-md object-cover"
                    src={
                      "https://layanan.karangbaru.acehtamiangkab.go.id/uploads/no-available.png"
                    }
                    alt="product photo"
                    height={300}
                    width={300}
                  />
                </Card>
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div>
                    <div className="text text-muted-foreground mb-2">
                      Order ID : 1234567890
                    </div>
                    <div className="text text-muted-foreground mb-2">
                      Date : 12/12/2021
                    </div>
                  </div>
                  <div>
                    <div className="text text-muted-foreground mb-2">
                      Price : Rp. 100.000
                    </div>
                    <div className="text text-muted-foreground mb-2">
                      Qty : 1
                    </div>
                  </div>
                  <div className="col-span-2 flex justify-between items-center">
                    <p className="text-lg font-semibold">Total : Rp. 500.000</p>
                    <div className="flex gap-2">
                      <Button size="sm">View Page</Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </PageTransition>
  )
}

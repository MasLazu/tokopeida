export interface product {
  id: string
  name: string
  storeId: string
  description: string
  stock: number
  sold: number
  price: number
  images?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface productApiResponse {
  id: string
  name: string
  store_id: string
  description: string
  stock: number
  sold: number
  price: number
  images?: string[]
  created_at: string
  updated_at: string
}

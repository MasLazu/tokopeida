import { product, productApiResponse } from "./product"

export interface transaction {
  id: string
  userEmail: string
  product: product
  quantity: number
  createdAt: Date
}

export interface transactionApiResponse {
  id: string
  user_email: string
  product: productApiResponse
  quantity: number
  created_at: string
}

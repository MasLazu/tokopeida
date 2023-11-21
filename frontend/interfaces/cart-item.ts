import { product, productApiResponse } from "./product"

export interface cartItem {
  product: product
  quantity: number
}

export interface cartItemApiResponse {
  product: productApiResponse
  quantity: number
}

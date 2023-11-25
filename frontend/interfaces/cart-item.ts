import { product, productApiResponse } from "./product"

export interface cartItem {
  product: product
  quantity: number
  selected: boolean
}

export interface cartItemApiResponse {
  product: productApiResponse
  quantity: number
}

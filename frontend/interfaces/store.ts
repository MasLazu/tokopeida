export interface store {
  id: string
  name: string
  city: string
  createdAt: Date
  updatedAt: Date
}

export interface storeApiResponse {
  id: string
  name: string
  city: string
  created_at: string
  updated_at: string
}

export interface user {
  email: string
  firstName: string
  lastName: string
  balance: number
  createdAt: Date
  updatedAt: Date
}

export interface userApiResponse {
  email: string
  first_name: string
  last_name: string
  balance: number
  created_at: string
  updated_at: string
}

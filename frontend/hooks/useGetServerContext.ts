import { useServerFetch } from "./useServerFetch"
import { user, userApiResponse } from "@/interfaces/user"
import { store, storeApiResponse } from "@/interfaces/store"

export async function useGetServerContext() {
  let user: user | null = null
  let userResponse: userApiResponse | null = null

  try {
    userResponse = (
      await useServerFetch.get<userApiResponse>("/api/user/current")
    ).data
  } catch (err) {
    console.log(err)
  }

  if (userResponse) {
    user = {
      email: userResponse.email,
      firstName: userResponse.first_name,
      lastName: userResponse.last_name,
      balance: userResponse.balance,
      createdAt: new Date(userResponse.created_at),
      updatedAt: new Date(userResponse.updated_at),
    }
  }

  let store: store | null = null
  let storeResponse: storeApiResponse | null = null

  try {
    storeResponse = (
      await useServerFetch.get<storeApiResponse>("/api/store/current")
    ).data
  } catch (err) {
    console.log(err)
  }

  if (storeResponse) {
    store = {
      id: storeResponse.id,
      name: storeResponse.name,
      createdAt: new Date(storeResponse.created_at),
      updatedAt: new Date(storeResponse.updated_at),
    }
  }

  return { user, store }
}

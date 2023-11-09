import { useServerAccessToken } from "./useServerAccessToken"
import axios from "axios"

export const useServerFetch = {
  get: async <T>(path: string) => {
    const accessToken = await useServerAccessToken()

    return await axios.get<T>(process.env.NEXT_PUBLIC_DOMAIN + path, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    })
  },
  post: async <T>(path: string, body?: any) => {
    const accessToken = await useServerAccessToken()

    return await axios.post<T>(process.env.NEXT_PUBLIC_DOMAIN + path, body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    })
  },
}

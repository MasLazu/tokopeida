import { useClientAccessToken } from "./useClientAccessToken"
import axios from "axios"

// export async function useClientFetch<T>(path: string, body?: any) {
//   const accessToken = await useClientAccessToken()

//   return await axios.get<T>(process.env.NEXT_PUBLIC_DOMAIN + path, {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//     data: body,
//   })
// }

export const useClientFetch = {
  get: async <T>(path: string) => {
    const accessToken = await useClientAccessToken()

    return await axios.get<T>(process.env.NEXT_PUBLIC_DOMAIN + path, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    })
  },
  post: async <T>(path: string, body?: any) => {
    const accessToken = await useClientAccessToken()

    return await axios.post<T>(process.env.NEXT_PUBLIC_DOMAIN + path, body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    })
  },
}

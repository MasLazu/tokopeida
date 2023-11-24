import { useClientAccessToken } from "./useClientAccessToken"
import axios, { AxiosError } from "axios"
import { useRenewAccessToken } from "./useRenewAccessToken"

export const useClientFetch = {
  get: async <T>(path: string) => {
    try {
      const accessToken = await useClientAccessToken()

      return await axios.get<T>(process.env.NEXT_PUBLIC_DOMAIN + path, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      })
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      if (err.response?.data?.message === "invalid or expired jwt") {
        await useRenewAccessToken()
        const accessToken = await useClientAccessToken()

        return await axios.get<T>(process.env.NEXT_PUBLIC_DOMAIN + path, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        })
      } else {
        throw error
      }
    }
  },
  post: async <T>(path: string, body?: any) => {
    try {
      const accessToken = await useClientAccessToken()

      return await axios.post<T>(process.env.NEXT_PUBLIC_DOMAIN + path, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      })
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      if (err.response?.data?.message === "invalid or expired jwt") {
        await useRenewAccessToken()
        const accessToken = await useClientAccessToken()

        return await axios.post<T>(
          process.env.NEXT_PUBLIC_DOMAIN + path,
          body,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          }
        )
      } else {
        throw error
      }
    }
  },
  put: async <T>(path: string, body?: any) => {
    try {
      const accessToken = await useClientAccessToken()

      return await axios.put<T>(process.env.NEXT_PUBLIC_DOMAIN + path, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      })
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      if (err.response?.data?.message === "invalid or expired jwt") {
        await useRenewAccessToken()
        const accessToken = await useClientAccessToken()

        return await axios.put<T>(process.env.NEXT_PUBLIC_DOMAIN + path, body, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        })
      } else {
        throw error
      }
    }
  },
  delete: async <T>(path: string) => {
    try {
      const accessToken = await useClientAccessToken()

      return await axios.delete<T>(process.env.NEXT_PUBLIC_DOMAIN + path, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      })
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      if (err.response?.data?.message === "invalid or expired jwt") {
        await useRenewAccessToken()
        const accessToken = await useClientAccessToken()

        return await axios.delete<T>(process.env.NEXT_PUBLIC_DOMAIN + path, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        })
      } else {
        throw error
      }
    }
  },
}

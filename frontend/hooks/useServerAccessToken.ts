import axios from "axios"
import { cookies } from "next/headers"

export async function useServerAccessToken() {
  if (typeof window === "undefined") {
    try {
      const refreshToken = await axios.get<{ access_token: string }>(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/auth/refresh`,
        {
          headers: {
            Cookie: `refresh_token=${cookies().get("refresh_token")?.value}`,
          },
        }
      )
      return refreshToken.data.access_token
    } catch (error) {
      return null
    }
  }
}

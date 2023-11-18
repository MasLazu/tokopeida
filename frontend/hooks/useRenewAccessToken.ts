import axios from "axios"

export async function useRenewAccessToken() {
  const refreshToken = await axios.get<{ access_token: string }>(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/auth/refresh`,
    {
      withCredentials: true,
    }
  )
  sessionStorage.setItem("access_token", refreshToken.data.access_token)
}

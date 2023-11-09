import axios from "axios"

export async function useClientAccessToken() {
  let accessToken = sessionStorage.getItem("access_token")

  if (accessToken === null) {
    try {
      const refreshToken = await axios.get<{ access_token: string }>(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/auth/refresh`,
        {
          withCredentials: true,
        }
      )
      accessToken = refreshToken.data.access_token
      sessionStorage.setItem("access_token", accessToken)
    } catch (error) {
      return null
    }
  }

  return accessToken
}

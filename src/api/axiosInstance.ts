import axios, { type AxiosRequestConfig } from 'axios'

import { getOidc } from '@/oidc'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

const getAccessToken = async () => {
  const oidc = await getOidc()

  if (!oidc.isUserLoggedIn) return undefined

  return (await oidc.getTokens()).accessToken
}

// Type issue https://github.com/axios/axios/issues/5494
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onRequest = async (config: any) => ({
  ...config,
  headers: {
    ...config.headers,
    'Content-Type': 'application/json;charset=utf-8',
    Accept: 'application/json;charset=utf-8',
    ...(await (async () => {
      const accessToken = await getAccessToken()

      if (!accessToken) {
        return undefined
      }

      return {
        Authorization: `Bearer ${accessToken}`,
      }
    })()),
  },
})

axiosInstance.interceptors.request.use(onRequest)

// add a second `options` argument here if you want to pass extra options to each generated query
export const walkingPaperInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
) => {
  return axiosInstance<T>({
    ...config,
    ...options,
  }).then(({ data }) => data)
}

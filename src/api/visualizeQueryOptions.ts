import { queryOptions } from '@tanstack/react-query'
import axios, { type AxiosRequestConfig } from 'axios'

import type { Nomenclature, Source } from '@/models/lunaticType'

function axiosGet<T>(url: string, options?: AxiosRequestConfig) {
  return axios.get<T>(url, options).then(({ data }) => data)
}

export const sourceQueryOptions = (
  sourceUrl: string,
  options?: AxiosRequestConfig,
) =>
  queryOptions({
    queryKey: [sourceUrl],
    queryFn: () => axiosGet<Source>(sourceUrl, options),
  })

export const nomenclatureQueryOptions = (
  nomenclatureUrl: string,
  options?: AxiosRequestConfig,
) =>
  queryOptions({
    queryKey: [nomenclatureUrl],
    queryFn: () => axiosGet<Nomenclature>(nomenclatureUrl, options),
  })

import { apiClient } from './apiClient'
import type { ValueStoreProductListResponse } from '../types/product'

export const getValueStoreProducts = async (): Promise<ValueStoreProductListResponse> => {
  const response = await apiClient.get<ValueStoreProductListResponse>('/v1/esg/s/products')
  return response.data
}

import { apiClient } from './apiClient'
import type {
  ValueStoreProductDetail,
  ValueStoreProductListResponse,
  ValueStorePurchaseHistoryResponse,
} from '../types/product'

export const getValueStoreProducts = async (): Promise<ValueStoreProductListResponse> => {
  const response = await apiClient.get<ValueStoreProductListResponse>('/v1/esg/s/products')
  return response.data
}

export const getValueStoreProductDetail = async (
  productId: number
): Promise<ValueStoreProductDetail> => {
  const response = await apiClient.get<ValueStoreProductDetail>(`/v1/esg/s/products/${productId}`)
  return response.data
}

export const getValueStorePurchases = async (): Promise<ValueStorePurchaseHistoryResponse> => {
  const response = await apiClient.get<ValueStorePurchaseHistoryResponse>('/v1/esg/s/products/purchases')
  return response.data
}

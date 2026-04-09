import { apiClient } from './apiClient'
import type {
  PointShopItemDetail,
  PointShopItemsResponse,
  PointShopPurchaseHistoryResponse,
  PointShopPurchaseResult,
  PointShopSummary,
} from '../types/pointShop'

export const getPointShopItems = async (): Promise<PointShopItemsResponse> => {
  const response = await apiClient.get<PointShopItemsResponse>('/point-shop/items')
  return response.data
}

export const getPointShopItemDetail = async (
  itemId: number
): Promise<PointShopItemDetail> => {
  const response = await apiClient.get<PointShopItemDetail>(`/point-shop/items/${itemId}`)
  return response.data
}

export const getPointShopSummary = async (): Promise<PointShopSummary> => {
  const response = await apiClient.get<PointShopSummary>('/point-shop/summary')
  return response.data
}

export const purchasePointShopItem = async (
  itemId: number
): Promise<PointShopPurchaseResult> => {
  const response = await apiClient.post<PointShopPurchaseResult>(`/point-shop/items/${itemId}/purchase`)
  return response.data
}

export const getPointShopPurchases = async (): Promise<PointShopPurchaseHistoryResponse> => {
  const response = await apiClient.get<PointShopPurchaseHistoryResponse>('/point-shop/purchases')
  return response.data
}

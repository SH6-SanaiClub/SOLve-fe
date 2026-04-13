import type { MyPointHistoryResponse, MyPointSummary } from '../types/myPoint'
import { apiClient } from './apiClient'

export const getMyPointSummary = async (): Promise<MyPointSummary> => {
  const response = await apiClient.get<MyPointSummary>('/my/points/summary')
  return response.data
}

export const getMyPointHistories = async (): Promise<MyPointHistoryResponse> => {
  const response = await apiClient.get<MyPointHistoryResponse>('/my/points/histories')
  return response.data
}

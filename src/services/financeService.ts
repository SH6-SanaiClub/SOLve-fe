import { apiClient } from './apiClient'
import type { SavingsRecommendResponse } from '../types/finance'

export const getSavingsRecommend = async (): Promise<SavingsRecommendResponse> => {
  const response = await apiClient.get<SavingsRecommendResponse>('/v1/finance/recommend')
  return response.data
}

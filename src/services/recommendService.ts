import { apiClient } from './apiClient'
import type { ActivityRecommendResponse } from '../types/recommend'

export const getActivityRecommend = async (): Promise<ActivityRecommendResponse> => {
  const response = await apiClient.get<ActivityRecommendResponse>('/v1/chat/recommend')
  return response.data
}

import { apiClient } from './apiClient'
import type { HomeDashboardSummary } from '../types/home'

export const getHomeDashboardSummary = async (): Promise<HomeDashboardSummary> => {
  const response = await apiClient.get<HomeDashboardSummary>('/home/summary')
  return response.data
}

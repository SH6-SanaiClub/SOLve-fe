import { apiClient } from './apiClient'
import type { VolunteerListResponse } from '../types/volunteer'

export const getVolunteerActivities = async (): Promise<VolunteerListResponse> => {
  const response = await apiClient.get<VolunteerListResponse>('/v1/esg/s/volunteers')
  return response.data
}

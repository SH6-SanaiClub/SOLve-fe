import { apiClient } from './apiClient'
import type { VolunteerDetail, VolunteerListResponse } from '../types/volunteer'

export const getVolunteerActivities = async (): Promise<VolunteerListResponse> => {
  const response = await apiClient.get<VolunteerListResponse>('/v1/esg/s/volunteers')
  return response.data
}

export const getVolunteerDetail = async (
  volunteerId: number,
): Promise<VolunteerDetail> => {
  const response = await apiClient.get<VolunteerDetail>(
    `/v1/esg/s/volunteers/${volunteerId}`,
  )
  return response.data
}

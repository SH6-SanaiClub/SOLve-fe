import { apiClient } from './apiClient'
import type { UserProfileResponse } from '../types/user'

export const getMyProfile = async (): Promise<UserProfileResponse> => {
  const response = await apiClient.get<UserProfileResponse>('/users/me')
  return response.data
}

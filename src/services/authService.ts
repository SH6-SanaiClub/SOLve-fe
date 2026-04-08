import { apiClient } from './apiClient'
import { type AuthJoinRequest, type AuthLoginRequest, type LoginResponse } from '../types/auth'

export const authService = {
  signup: async (data: AuthJoinRequest) => {
    return apiClient.post('/auth/join', data)
  },

  checkLoginId: async (loginId: string) => {
    const response = await apiClient.get<boolean>('/auth/check-id', {
      params: { loginId },
    })
    
    return response.data
  },

  login: async (data: AuthLoginRequest): Promise<LoginResponse> => {

    const response = await apiClient.post<LoginResponse>('/auth/login', data)
    const { accessToken, refreshToken } = response.data

    if (accessToken) localStorage.setItem('accessToken', accessToken)
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken)

    return response.data
  },
}

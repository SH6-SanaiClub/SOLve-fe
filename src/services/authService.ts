import { apiClient } from './apiClient'
import { APP_CONFIG } from '../constants/config'
import { type AuthJoinRequest, type AuthLoginRequest, type LoginResponse } from '../types/auth'

const mockLoginResponse: LoginResponse = {
  accessToken: 'dev-token',
  refreshToken: 'dev-refresh-token',
  user: {
    userId: 1,
    loginId: 'testuser',
    name: '테스트유저',
    userType: 'ALL-ROUNDER',
    currentGrade: 'SEED',
    totalPoints: 0,
    isLinked: false,
  },
}

export const authService = {
  signup: async (data: AuthJoinRequest) => {
    if (APP_CONFIG.enableDevAuthBypass) {
      console.warn('개발 모드: 회원가입 API 호출을 건너뜁니다.', data)
      return Promise.resolve({ data: { message: '회원가입 성공 (개발 모드)' } })
    }

    return apiClient.post('/auth/join', data)
  },

  checkLoginId: async (loginId: string) => {
    const response = await apiClient.get<boolean>('/auth/check-id', {
      params: { loginId },
    })

    return response.data
  },

  login: async (data: AuthLoginRequest): Promise<LoginResponse> => {
    if (APP_CONFIG.enableDevAuthBypass) {
      console.warn('개발 모드: 로그인 API 호출을 건너뜁니다.', data)
      return Promise.resolve(mockLoginResponse)
    }

    const response = await apiClient.post<LoginResponse>('/auth/login', data)
    const { accessToken, refreshToken } = response.data

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken)
    }
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken)
    }

    return response.data
  },
}

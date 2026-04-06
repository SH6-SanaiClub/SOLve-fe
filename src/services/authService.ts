import { apiClient } from './apiClient';
import { APP_CONFIG } from '../constants/config';
import { type AuthJoinRequest, type AuthLoginRequest, type LoginResponse } from '../types/auth';

const mockLoginResponse: LoginResponse = {
  accessToken: 'dev-token',
  refreshToken: 'dev-refresh-token',
  user: {
    userId: 1,
    loginId: 'testuser',
    name: '테스트 유저',
    userType: 'ALL-ROUNDER',
    currentGrade: 'SEED',
    totalPoints: 0,
    isLinked: false,
  },
};

export const authService = {
  signup: async (data: AuthJoinRequest) => {
    if (APP_CONFIG.enableDevAuthBypass) {
      console.warn('개발 모드: authService.signup API 호출을 우회합니다.', data);
      return Promise.resolve({ data: { message: '회원가입 성공 (로컬 모드)' } });
    }

    return apiClient.post('/api/auth/join', data);
  },

  checkLoginId: async (loginId: string) => {
  // 위에서 만든 GET /api/auth/check-id?loginId=... 를 호출함
  const response = await apiClient.get<boolean>(`/api/auth/check-id`, {
    params: { loginId }
  });
  return response.data; // 중복이면 true, 아니면 false
},

  // 로그인
  login: async (data: AuthLoginRequest): Promise<LoginResponse> => {
    if (APP_CONFIG.enableDevAuthBypass) {
      console.warn('개발 모드: authService.login API 호출을 우회합니다.', data);
      return Promise.resolve(mockLoginResponse);
    }

    const response = await apiClient.post<LoginResponse>('/api/auth/login', data);
    const { accessToken, refreshToken } = response.data; 
  
  if (accessToken) localStorage.setItem('accessToken', accessToken);
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    return response.data;
  },
};


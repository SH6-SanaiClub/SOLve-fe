// 중괄호 { } 를 추가해서 가져오세요!
import { apiClient } from './apiClient'; 
import { type AuthJoinRequest, type AuthLoginRequest, type LoginResponse } from '../types/auth';

export const authService = {
  // 회원가입
  signup: (data: AuthJoinRequest) => 
    apiClient.post('/auth/join', data),

  // 로그인
  login: async (data:AuthLoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return response.data;
  }
};
import type { UserSummary } from './user'

export interface AuthSession {
  accessToken: string | null
  user: UserSummary | null
}
export interface AuthJoinRequest {
  loginId: string;
  password?: string;
  name: string;
  email: string;
  phoneNumber: string;
  birthdate: string; 
  ciDi: string;
}

// 3. 로그인 성공 시 서버에서 내려주는 응답 형식 (추가)
// 만약 서버가 토큰만 준다면 아래처럼, 유저정보도 같이 준다면 UserSummary를 포함하세요.
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserSummary; 
}

export interface AuthLoginRequest {
  loginId: string;
  password: string;
}

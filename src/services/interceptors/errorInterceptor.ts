import axios, { 
  type AxiosError, 
  type AxiosInstance, 
  type InternalAxiosRequestConfig 
} from 'axios'
import { useAuthStore } from '../../store'
import { ROUTE_PATHS } from '../../constants/routePaths'
import { APP_CONFIG } from '../../constants/config'

// 1. 기존 요청 설정에 _retry 속성을 추가한 커스텀 타입 정의
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export function applyErrorInterceptor(apiClient: AxiosInstance) {
  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      // 2. error.config를 우리가 만든 커스텀 타입으로 캐스팅
      const originalRequest = error.config as CustomAxiosRequestConfig;

      // 401 Unauthorized 에러이고, 아직 재시도를 안 한 경우
      if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true; // 이제 여기서 에러가 나지 않습니다.

        try {
          const refreshToken = localStorage.getItem('refreshToken');
          
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          // 재발급 요청 (인터셉터가 없는 생 axios 사용)
          const res = await axios.post(`${APP_CONFIG.apiBaseUrl}/api/auth/reissue`, {
            refreshToken
          });

          const { accessToken, refreshToken: newRefreshToken } = res.data;

          // 새 토큰 저장
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          // Zustand 스토어 갱신
          useAuthStore.getState().setSession({ 
            accessToken, 
            user: useAuthStore.getState().user 
          });

          // 원래 실패했던 요청 재시도 (헤더 업데이트)
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          
          return apiClient(originalRequest);
          
        } catch (reissueError) {
          // 재발급 실패 시 세션 비우고 로그인 이동
          useAuthStore.getState().clearSession();
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          
          if (window.location.pathname !== ROUTE_PATHS.login) {
            window.location.assign(ROUTE_PATHS.login);
          }
          return Promise.reject(reissueError);
        }
      }

      return Promise.reject(error);
    }
  )
}
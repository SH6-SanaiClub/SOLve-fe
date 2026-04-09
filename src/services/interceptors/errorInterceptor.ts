import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios'
import { ROUTE_PATHS } from '../../constants/routePaths'

import { APP_CONFIG } from '../../constants/config'
import { useAuthStore } from '../../store'

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

function shouldSkipRefresh(url?: string) {
  return Boolean(
    url &&
      ['/v1/auth/login', '/v1/auth/signup', '/v1/auth/check-id', '/v1/auth/verify-identity', '/v1/auth/reissue'].some(
        (path) => url.includes(path),
      ),
  )
}

export function applyErrorInterceptor(apiClient: AxiosInstance) {
  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as CustomAxiosRequestConfig

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        !shouldSkipRefresh(originalRequest.url)
      ) {
        originalRequest._retry = true

        try {
          const refreshToken = localStorage.getItem('refreshToken')

          if (!refreshToken) {
            throw new Error('No refresh token available')
          }

          const res = await axios.post(`${APP_CONFIG.apiBaseUrl}/v1/auth/reissue`, {
            refreshToken,
          })

          const { accessToken, refreshToken: newRefreshToken } = res.data

          localStorage.setItem('accessToken', accessToken)
          localStorage.setItem('refreshToken', newRefreshToken)

          useAuthStore.getState().setSession({
            accessToken,
            user: useAuthStore.getState().user,
          })

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
          }
     
          return apiClient(originalRequest)
        } catch (reissueError) {
          useAuthStore.getState().clearSession()
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')

          if (window.location.pathname !== ROUTE_PATHS.login) {
            window.location.assign(ROUTE_PATHS.login)
          }

          return Promise.reject(reissueError)
        }
      }

      return Promise.reject(error)
    },
  )
}

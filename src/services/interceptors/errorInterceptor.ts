import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios'
import { useAuthStore } from '../../store'
import { ROUTE_PATHS } from '../../constants/routePaths'
import { APP_CONFIG } from '../../constants/config'

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

export function applyErrorInterceptor(apiClient: AxiosInstance) {
  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as CustomAxiosRequestConfig

      if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          const refreshToken = localStorage.getItem('refreshToken')

          if (!refreshToken) {
            throw new Error('No refresh token available')
          }

          const res = await axios.post(`${APP_CONFIG.apiBaseUrl}/api/auth/reissue`, {
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

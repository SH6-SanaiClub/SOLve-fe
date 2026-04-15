import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '../../store'

function isPublicAuthRequest(url?: string) {
  return Boolean(
    url &&
      ['/v1/auth/login', '/v1/auth/signup', '/v1/auth/check-id', '/v1/auth/verify-identity', '/v1/auth/logout'].some(
        (path) => url.includes(path),
      ),
  )
}

function attachAuthHeader(config: InternalAxiosRequestConfig) {
  if (isPublicAuthRequest(config.url)) {
    return config
  }

  let { accessToken } = useAuthStore.getState()

  if (!accessToken) {
    accessToken = localStorage.getItem('accessToken')
  }

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
}

export function applyAuthInterceptor(apiClient: AxiosInstance) {
  apiClient.interceptors.request.use(attachAuthHeader)
}

import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '../../store'

function attachAuthHeader(config: InternalAxiosRequestConfig) {
  const { accessToken } = useAuthStore.getState()

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
}

export function applyAuthInterceptor(apiClient: AxiosInstance) {
  apiClient.interceptors.request.use(attachAuthHeader)
}

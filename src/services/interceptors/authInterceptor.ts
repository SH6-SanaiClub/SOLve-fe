import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '../../store'

function attachAuthHeader(config: InternalAxiosRequestConfig) {
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

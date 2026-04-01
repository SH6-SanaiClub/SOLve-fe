import axios, { type AxiosError, type AxiosInstance } from 'axios'
import type { ApiErrorPayload } from '../../types/api'
import { useAuthStore } from '../../store'
import { ROUTE_PATHS } from '../../constants/routePaths'

function normalizeError(error: AxiosError): ApiErrorPayload {
  const status = error.response?.status ?? 0
  const payload = error.response?.data

  if (typeof payload === 'object' && payload !== null && 'message' in payload) {
    return {
      status,
      message: String(payload.message),
      details: payload,
    }
  }

  return {
    status,
    message: error.message || '알 수 없는 오류가 발생했습니다.',
    details: payload,
  }
}

export function applyErrorInterceptor(apiClient: AxiosInstance) {
  apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const normalized = normalizeError(error)

      if (normalized.status === 401) {
        useAuthStore.getState().clearSession()

        if (window.location.pathname !== ROUTE_PATHS.login) {
          window.location.assign(ROUTE_PATHS.login)
        }
      }

      return Promise.reject(
        axios.isAxiosError(error) ? normalized : error,
      )
    },
  )
}

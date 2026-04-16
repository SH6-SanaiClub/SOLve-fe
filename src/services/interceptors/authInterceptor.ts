import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { APP_CONFIG } from '../../constants/config'
import { useAdminAuthStore, useAuthStore } from '../../store'

function isPublicAuthRequest(url?: string) {
  return Boolean(
    url &&
      [
        '/v1/auth/login',
        '/v1/auth/signup',
        '/v1/auth/check-id',
        '/v1/auth/verify-identity',
        '/v1/auth/logout',
        '/v1/admin/auth/login',
      ].some((path) => url.includes(path)),
  )
}

function isAdminRequest(url?: string) {
  return Boolean(url && url.includes('/v1/admin') && !url.includes('/v1/admin/auth/'))
}

function readPersistedAccessToken(storageKey: string) {
  const persistedState = localStorage.getItem(storageKey)

  if (!persistedState) {
    return null
  }

  try {
    const parsed = JSON.parse(persistedState) as {
      state?: { accessToken?: string | null }
    }

    return parsed.state?.accessToken ?? null
  } catch {
    return null
  }
}

function getUserAccessToken() {
  let { accessToken } = useAuthStore.getState()

  if (!accessToken) {
    accessToken =
      localStorage.getItem('accessToken') ??
      readPersistedAccessToken(APP_CONFIG.storageKeys.auth)
  }

  return accessToken
}

function getAdminAccessToken() {
  let { accessToken } = useAdminAuthStore.getState()

  if (!accessToken) {
    accessToken = readPersistedAccessToken(APP_CONFIG.storageKeys.adminAuth)
  }

  return accessToken
}

function attachAuthHeader(config: InternalAxiosRequestConfig) {
  if (isPublicAuthRequest(config.url)) {
    return config
  }

  const accessToken = isAdminRequest(config.url)
    ? getAdminAccessToken()
    : getUserAccessToken()

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
}

export function applyAuthInterceptor(apiClient: AxiosInstance) {
  apiClient.interceptors.request.use(attachAuthHeader)
}

import { APP_CONFIG } from '../constants/config'
import { useAdminAuthStore, useAuthStore } from '../store'

export function clearClientAuthSession() {
  useAuthStore.getState().clearSession()
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem(APP_CONFIG.storageKeys.auth)
}

export function clearClientAdminSession() {
  useAdminAuthStore.getState().clearAdminSession()
  localStorage.removeItem(APP_CONFIG.storageKeys.adminAuth)
}

export function clearAllClientSessions() {
  clearClientAuthSession()
  clearClientAdminSession()
}

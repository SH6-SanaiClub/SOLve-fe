import { useAuthStore } from '../store'

export function clearClientAuthSession() {
  useAuthStore.getState().clearSession()
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}

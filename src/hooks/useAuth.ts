import { useAuthStore } from '../store'

export function useAuth() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const clearSession = useAuthStore((state) => state.clearSession)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const setSession = useAuthStore((state) => state.setSession)
  const updateUser = useAuthStore((state) => state.updateUser)
  const user = useAuthStore((state) => state.user)

  return {
    accessToken,
    clearSession,
    isAuthenticated,
    setSession,
    updateUser,
    user,
  }
}

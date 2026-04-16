import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { APP_CONFIG } from '../constants/config'

interface AdminAuthState {
  accessToken: string | null
  isAuthenticated: boolean
  setAdminSession: (token: string) => void
  clearAdminSession: () => void
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      isAuthenticated: false,
      setAdminSession: (token) =>
        set({
          accessToken: token,
          isAuthenticated: Boolean(token),
        }),
      clearAdminSession: () =>
        set({
          accessToken: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: APP_CONFIG.storageKeys.adminAuth,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) {
          return
        }

        state.isAuthenticated = Boolean(state.accessToken)
      },
    },
  ),
)

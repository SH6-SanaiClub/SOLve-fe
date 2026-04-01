import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { APP_CONFIG } from '../constants/config'
import type { AuthSession } from '../types/auth'
import type { UserSummary } from '../types/user'

interface AuthState extends AuthSession {
  isAuthenticated: boolean
  setSession: (session: AuthSession) => void
  updateUser: (user: UserSummary) => void
  clearSession: () => void
}

const initialState: AuthSession = {
  accessToken: null,
  user: null,
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,
      isAuthenticated: false,
      setSession: (session) =>
        set({
          ...session,
          isAuthenticated: Boolean(session.accessToken),
        }),
      updateUser: (user) =>
        set((state) => ({
          ...state,
          user,
        })),
      clearSession: () =>
        set({
          ...initialState,
          isAuthenticated: false,
        }),
    }),
    {
      name: APP_CONFIG.storageKeys.auth,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
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

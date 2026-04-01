import { create } from 'zustand'

type AppTab = 'home' | 'activities' | 'finance' | 'my' | 'chatbot' | null

interface AppState {
  activeTab: AppTab
  isGlobalLoading: boolean
  isBottomSheetOpen: boolean
  networkStatus: 'online' | 'offline'
  isInstallPromptVisible: boolean
  setActiveTab: (tab: AppTab) => void
  setGlobalLoading: (value: boolean) => void
  setBottomSheetOpen: (value: boolean) => void
  setNetworkStatus: (value: 'online' | 'offline') => void
  setInstallPromptVisible: (value: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  activeTab: null,
  isGlobalLoading: false,
  isBottomSheetOpen: false,
  networkStatus: navigator.onLine ? 'online' : 'offline',
  isInstallPromptVisible: false,
  setActiveTab: (activeTab) => set({ activeTab }),
  setGlobalLoading: (isGlobalLoading) => set({ isGlobalLoading }),
  setBottomSheetOpen: (isBottomSheetOpen) => set({ isBottomSheetOpen }),
  setNetworkStatus: (networkStatus) => set({ networkStatus }),
  setInstallPromptVisible: (isInstallPromptVisible) => set({ isInstallPromptVisible }),
}))

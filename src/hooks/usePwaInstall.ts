import { useEffect } from 'react'
import { useAppStore } from '../store'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

export function usePwaInstall() {
  const setInstallPromptVisible = useAppStore((state) => state.setInstallPromptVisible)

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setInstallPromptVisible(true)
    }

    const handleAppInstalled = () => {
      setInstallPromptVisible(false)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [setInstallPromptVisible])

  return {
    isInstallPromptVisible: useAppStore((state) => state.isInstallPromptVisible),
    promptInstall: async (installPrompt: BeforeInstallPromptEvent | null) => {
      if (!installPrompt) {
        return
      }

      await installPrompt.prompt()
      await installPrompt.userChoice
    },
  }
}

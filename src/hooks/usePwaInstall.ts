import { useEffect } from 'react'
import { useAppStore } from '../store'

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
}

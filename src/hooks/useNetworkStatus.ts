import { useEffect } from 'react'
import { useAppStore } from '../store'

export function useNetworkStatus() {
  const setNetworkStatus = useAppStore((state) => state.setNetworkStatus)

  useEffect(() => {
    const handleOnline = () => setNetworkStatus('online')
    const handleOffline = () => setNetworkStatus('offline')

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [setNetworkStatus])
}

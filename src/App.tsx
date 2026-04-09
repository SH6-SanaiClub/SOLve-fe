import { useEffect } from 'react'
import { AppRouter } from './routes/Router'
import { useNetworkStatus } from './hooks/useNetworkStatus'
import { usePwaInstall } from './hooks/usePwaInstall'

function App() {
  useNetworkStatus()
  usePwaInstall()

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      return
    }

    if (import.meta.env.DEV) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister().catch((error: unknown) => {
            console.error('Service worker unregister failed', error)
          })
        })
      })
      return
    }

    const registerServiceWorker = () => {
      navigator.serviceWorker
        .register('/sw.js')
        .catch((error: unknown) => console.error('Service worker registration failed', error))
    }

    window.addEventListener('load', registerServiceWorker, { once: true })

    return () => {
      window.removeEventListener('load', registerServiceWorker)
    }
  }, [])

  return <AppRouter />
}

export default App

import { useEffect, useState } from 'react'
import { useLocation, useNavigate, type Location } from 'react-router-dom'
import { ROUTE_PATHS, getEnvVerifyPath } from '../../../constants/routePaths'
import { fetchEnvironmentVerificationAvailability } from '../../../services/environmentVerificationService'
import type { EnvActivityType } from './envActivityData'
import { EnvironmentEntryModal } from './components/EnvironmentEntryModal'

interface EnvLocationState {
  backgroundLocation?: Location
}

export function EnvironmentEntryPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [blockedActivityTypes, setBlockedActivityTypes] = useState<EnvActivityType[]>([])
  const routeState = location.state as EnvLocationState | undefined

  useEffect(() => {
    let mounted = true

    const loadAvailability = async () => {
      try {
        const availability = await fetchEnvironmentVerificationAvailability()

        if (!mounted) {
          return
        }

        setBlockedActivityTypes(
          availability
            .filter((activity) => activity.attemptedToday)
            .map((activity) => activity.activityType),
        )
      } catch (error) {
        console.error(error)
      }
    }

    void loadAvailability()

    return () => {
      mounted = false
    }
  }, [])

  const handleClose = () => {
    if (routeState?.backgroundLocation) {
      navigate(-1)
      return
    }

    navigate(ROUTE_PATHS.home, { replace: true })
  }

  const handleSelect = (activityType: EnvActivityType) => {
    navigate(getEnvVerifyPath(activityType), { state: { fromEnv: true } })
  }

  return (
    <div className="relative min-h-screen w-full max-w-[600px] mx-auto bg-bg-light font-pretendard">
      <EnvironmentEntryModal
        open
        blockedActivityTypes={blockedActivityTypes}
        onClose={handleClose}
        onSelect={handleSelect}
      />
    </div>
  )
}

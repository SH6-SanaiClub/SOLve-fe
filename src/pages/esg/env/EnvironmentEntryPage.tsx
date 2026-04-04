import { useLocation, useNavigate, type Location } from 'react-router-dom'
import { ROUTE_PATHS, getEnvVerifyPath } from '../../../constants/routePaths'
import type { EnvActivityType } from './envActivityData'
import { EnvironmentEntryModal } from './components/EnvironmentEntryModal'

interface EnvLocationState {
  backgroundLocation?: Location
}

export function EnvironmentEntryPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const routeState = location.state as EnvLocationState | undefined

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
        onClose={handleClose}
        onSelect={handleSelect}
      />
    </div>
  )
}

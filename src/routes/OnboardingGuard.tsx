import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROUTE_PATHS } from '../constants/routePaths'
import { useAuth } from '../hooks/useAuth'

export function OnboardingGuard() {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()

  if (
    isAuthenticated &&
    user &&
    !user.isSurveyCompleted &&
    location.pathname !== ROUTE_PATHS.onboarding
  ) {
    return <Navigate replace to={ROUTE_PATHS.onboarding} />
  }

  return <Outlet />
}

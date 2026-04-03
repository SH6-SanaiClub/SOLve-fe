import { Navigate, Outlet, useLocation } from 'react-router-dom'
//import { APP_CONFIG } from '../constants/config'
import { ROUTE_PATHS } from '../constants/routePaths'
import { useAuthStore } from '../store'

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const location = useLocation()

  // if (APP_CONFIG.enableDevAuthBypass) {
  //   return <Outlet />
  // }

  if (!isAuthenticated) {
    return (
      <Navigate
        replace
        to={ROUTE_PATHS.login}
        state={{ from: location.pathname }}
      />
    )
  }

  return <Outlet />
}

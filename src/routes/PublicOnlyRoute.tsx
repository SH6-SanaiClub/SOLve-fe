import { Navigate, Outlet } from 'react-router-dom'
import { ROUTE_PATHS } from '../constants/routePaths'
import { useAuthStore } from '../store'

export function PublicOnlyRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate replace to={ROUTE_PATHS.home} />
  }

  return <Outlet />
}

import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROUTE_PATHS } from '../../constants/routePaths'
import { useAdminAuthStore } from '../../store'

export const AdminProtectedRoute = () => {
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return (
      <Navigate
        replace
        to={ROUTE_PATHS.adminLogin}
        state={{ from: location.pathname }}
      />
    )
  }

  return <Outlet />
}

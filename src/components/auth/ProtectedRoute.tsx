import { Navigate, Outlet } from 'react-router-dom'
import { ROUTE_PATHS } from '../../constants/routePaths'
import { useAuthStore } from '../../store/authStore'

export const ProtectedRoute = () => {
  const isAuth = useAuthStore((state) => state.isAuthenticated)

  if (!isAuth) {
    return <Navigate to={ROUTE_PATHS.login} replace />
  }

  return <Outlet />
}

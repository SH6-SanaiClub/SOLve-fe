import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export const ProtectedRoute = () => {
  const isAuth = useAuthStore((state) => state.isAuthenticated);

  // 로그인 안 되어 있으면 로그인 페이지로 리다이렉트
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // 로그인 되어 있으면 자식 컴포넌트(페이지) 렌더링
  return <Outlet />;
};
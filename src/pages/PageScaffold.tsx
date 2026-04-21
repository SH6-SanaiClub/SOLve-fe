import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { IconButton, Icons } from '../components/common'
import { PageMotionStyles, buildPageEnterStyle } from '../components/common/PageMotion'
import headerLogo from '../assets/home/logo.png'
import { ROUTE_PATHS } from '../constants/routePaths'
import { useAuthStore } from '../store/authStore'
import { authService } from '../services/authService'
import { clearClientAuthSession } from '../utils/authSession'

interface PageScaffoldProps {
  title: string
  description: string
  children?: ReactNode
}

export function PageScaffold({ title, description, children }: PageScaffoldProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuthStore()
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      void (async () => {
        const refreshToken = localStorage.getItem('refreshToken')

        try {
          if (refreshToken) {
            await authService.logout(refreshToken)
          }
        } finally {
          clearClientAuthSession()
          navigate(ROUTE_PATHS.login)
        }
      })()
    }
  }

  const handleBack = () => {
    if (returnTo) {
      navigate(returnTo, { replace: true })
      return
    }

    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate(ROUTE_PATHS.home)
  }

  return (
    <div className="app-shell">
      <PageMotionStyles />
      <div className="absolute left-6 top-6 z-10">
        <IconButton
          label="뒤로가기"
          icon={<Icons.Back size={20} />}
          size="sm"
          onClick={handleBack}
        />
      </div>
      {isAuthenticated && (
        <button
          onClick={handleLogout}
          className="absolute right-6 top-6 z-10 rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
        >
          로그아웃
        </button>
      )}
      <section className="page-card flex flex-col gap-4" style={buildPageEnterStyle(40, 460)}>
        <img src={headerLogo} alt="SOLve" className="h-9 w-fit object-contain" />
        <h1 className="text-2xl font-bold text-font-main">{title}</h1>
        <p className="text-base text-font-sub">{description}</p>
        {children}
      </section>
    </div>
  )
}

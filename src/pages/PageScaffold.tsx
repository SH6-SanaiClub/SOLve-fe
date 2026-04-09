import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import headerLogo from '../assets/home/logo.png'
import { ROUTE_PATHS } from '../constants/routePaths'
import { useAuthStore } from '../store/authStore'

interface PageScaffoldProps {
  title: string
  description: string
  children?: ReactNode
}

export function PageScaffold({ title, description, children }: PageScaffoldProps) {
  const navigate = useNavigate()
  const { isAuthenticated, clearSession } = useAuthStore()

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      clearSession()
      navigate(ROUTE_PATHS.login)
    }
  }

  return (
    <div className="app-shell">
      {isAuthenticated && (
        <button
          onClick={handleLogout}
          className="absolute right-6 top-6 z-10 rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
        >
          로그아웃
        </button>
      )}
      <section className="page-card flex flex-col gap-4">
        <img src={headerLogo} alt="SOLve" className="h-9 w-fit object-contain" />
        <h1 className="text-2xl font-bold text-font-main">{title}</h1>
        <p className="text-base text-font-sub">{description}</p>
        {children}
      </section>
    </div>
  )
}

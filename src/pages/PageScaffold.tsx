import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import headerLogo from '../assets/home/logo.png'
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
      navigate('/login')
    }
  }
  return (
    <div className="app-shell">
      {/* 1. 우측 상단에 로그아웃 버튼만 절대 위치로 배치 */}
      {isAuthenticated && (
        <button 
          onClick={handleLogout}
          className="absolute top-6 right-6 text-xs font-medium text-red-500 border border-red-200 px-2 py-1 rounded-md hover:bg-red-50 z-10"
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

import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { Badge } from '../common'
import { AdminSidebar } from './AdminSidebar'

interface AdminLayoutProps {
  children: ReactNode
}

const getPageTitle = (pathname: string) => {
  if (pathname.startsWith('/admin/users')) {
    return '사용자 관리'
  }

  if (pathname.startsWith('/admin/activities')) {
    return 'ESG 활동 관리'
  }

  if (pathname.startsWith('/admin/shop')) {
    return '포인트샵 관리'
  }

  if (pathname.startsWith('/admin/finance')) {
    return '금융 상품 관리'
  }

  return '대시보드'
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation()
  const title = getPageTitle(location.pathname)

  return (
    <div className="min-h-screen bg-bg-light lg:flex">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-border-muted bg-white/90 backdrop-blur">
          <div className="flex flex-col gap-3 px-5 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-font-sub uppercase">
                Admin Workspace
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-font-main">
                {title}
              </h1>
            </div>

            <Badge tone="primary" className="w-fit !px-3 !py-2 text-sm">
              Desktop Admin
            </Badge>
          </div>
        </header>

        <main className="flex-1 px-4 py-5 lg:px-8 lg:py-8">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

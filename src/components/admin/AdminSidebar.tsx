import {
  Gift,
  Landmark,
  LayoutDashboard,
  Leaf,
  LogOut,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { ROUTE_PATHS } from '../../constants/routePaths'
import { clearClientAdminSession } from '../../utils/authSession'

const navigationItems = [
  {
    label: '대시보드',
    to: ROUTE_PATHS.adminDashboard,
    icon: LayoutDashboard,
  },
  {
    label: '사용자 관리',
    to: ROUTE_PATHS.adminUsers,
    icon: Users,
  },
  {
    label: 'ESG 활동 관리',
    to: ROUTE_PATHS.adminActivities,
    icon: Leaf,
  },
  {
    label: '포인트샵 관리',
    to: ROUTE_PATHS.adminShop,
    icon: Gift,
  },
  {
    label: '금융 상품 관리',
    to: ROUTE_PATHS.adminFinance,
    icon: Landmark,
  },
] as const

export const AdminSidebar = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    if (!window.confirm('관리자 세션을 종료하시겠습니까?')) {
      return
    }

    clearClientAdminSession()
    navigate(ROUTE_PATHS.adminLogin, { replace: true })
  }

  return (
    <aside className="bg-gray-900 text-gray-300 lg:sticky lg:top-0 lg:h-screen lg:w-[240px] lg:shrink-0">
      <div className="border-b border-white/10 px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-primary-500 text-white shadow-card">
            <ShieldCheck size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-primary-300 uppercase">
              SOLve
            </p>
            <h2 className="text-lg font-semibold text-white">관리자 콘솔</h2>
          </div>
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-4 py-4 lg:flex-col lg:overflow-visible">
        {navigationItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                'flex min-w-fit items-center gap-3 rounded-[14px] px-4 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-500 text-white shadow-card'
                  : 'hover:bg-white/5 hover:text-white',
              ].join(' ')
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 pb-5 lg:absolute lg:inset-x-0 lg:bottom-0 lg:pb-6">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-[14px] border border-white/10 px-4 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut size={18} />
          <span>로그아웃</span>
        </button>
      </div>
    </aside>
  )
}

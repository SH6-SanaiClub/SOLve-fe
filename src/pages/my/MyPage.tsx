import { Coins, FileChartColumn, FileText, Landmark, ShieldCheck, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Card, Icons, SectionHeader } from '../../components/common'
import BottomNavigation from '../../components/layout/BottomNavigation'
import MainLayout from '../../components/layout/MainLayout'
import {
  BOTTOM_NAVIGATION_ITEMS,
  BOTTOM_NAVIGATION_ROUTE_BY_KEY,
} from '../../constants/bottomNavigation'
import { ROUTE_PATHS } from '../../constants/routePaths'
import { useAuth } from '../../hooks/useAuth'
import { ShopHeader } from '../shop/components/ShopHeader'
import { LogOut, Store } from 'lucide-react'

const menuItems = [
  {
    key: 'profile',
    label: '프로필 및 계정 관리',
    icon: <UserRound size={18} />,
    path: ROUTE_PATHS.myProfile,
  },
  {
    key: 'grade',
    label: 'ESG 점수 및 등급',
    icon: <ShieldCheck size={18} />,
    path: ROUTE_PATHS.myGrade,
  },
  {
    key: 'history',
    label: 'ESG 활동 상세 내역',
    icon: <FileText size={18} />,
    path: ROUTE_PATHS.myHistory,
  },
  {
    key: 'report',
    label: 'ESG 활동 보고서',
    icon: <FileChartColumn size={18} />,
    path: ROUTE_PATHS.myReport,
  },
  {
    key: 'storePurchase',
    label: '가치가게 구매 내역',
    icon: <Store size={18} />,
    path: ROUTE_PATHS.activitySocialStore,
  },
  {
    key: 'finance',
    label: '금융 상품 관리',
    icon: <Landmark size={18} />,
    path: ROUTE_PATHS.myFinance,
  },
  {
    key: 'point',
    label: '포인트 관리',
    icon: <Coins size={18} />,
    path: ROUTE_PATHS.myPointManage,
  },
]

const accountMenuItems = menuItems.filter((item) => item.key === 'profile')
const activityMenuItems = menuItems.filter((item) =>
  ['grade', 'history', 'storePurchase', 'report', 'point'].includes(item.key),
)
const financeMenuItems = menuItems.filter((item) => item.key === 'finance')

export const MyPage = () => {
  const navigate = useNavigate()
  const { clearSession } = useAuth()

  const handleBottomNavigation = (key: string) => {
    const nextPath =
      BOTTOM_NAVIGATION_ROUTE_BY_KEY[key as keyof typeof BOTTOM_NAVIGATION_ROUTE_BY_KEY]

    if (nextPath) {
      navigate(nextPath)
    }
  }

  const handleLogout = () => {
    if (!window.confirm('로그아웃 하시겠습니까?')) {
      return
    }

    clearSession()
    navigate(ROUTE_PATHS.login)
  }

  const renderMenuCard = (items: typeof menuItems) => (
    <Card className="!gap-0 !p-0">
      {items.map((item, index) => (
        <button
          key={item.key}
          type="button"
          onClick={() => navigate(item.path)}
          className={`flex w-full items-center justify-between px-5 py-5 text-left ${
            index < items.length - 1 ? 'border-b border-gray-100' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-100 bg-gray-50 text-gray-500">
              {item.icon}
            </div>
            <span className="text-[15px] font-medium text-font-main">{item.label}</span>
          </div>

          <Icons.ArrowRight className="text-gray-300" size={20} />
        </button>
      ))}
    </Card>
  )

  return (
    <MainLayout
      header={<ShopHeader title="마이페이지" onBack={() => navigate(ROUTE_PATHS.home)} />}
      nav={
        <BottomNavigation
          items={BOTTOM_NAVIGATION_ITEMS}
          value="my"
          onChange={handleBottomNavigation}
        />
      }
      className="bg-bg-light"
    >
      <section className="mt-2 flex flex-col gap-5">
        <section className="flex flex-col gap-3">
          <SectionHeader title="계정" className="px-1" />

          <Card className="!gap-0 !p-0">
            {accountMenuItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => navigate(item.path)}
                className="flex w-full items-center justify-between border-b border-gray-100 px-5 py-5 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-100 bg-gray-50 text-gray-500">
                    {item.icon}
                  </div>
                  <span className="text-[15px] font-medium text-font-main">{item.label}</span>
                </div>

                <Icons.ArrowRight className="text-gray-300" size={20} />
              </button>
            ))}

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-5 py-5 text-left text-primary-400"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-primary-400">
                <LogOut size={18} />
              </div>
              <span className="text-[15px] font-medium">로그아웃</span>
            </button>
          </Card>
        </section>

        <section className="flex flex-col gap-3">
          <SectionHeader title="활동" className="px-1" />
          {renderMenuCard(activityMenuItems)}
        </section>

        <section className="flex flex-col gap-3">
          <SectionHeader title="금융" className="px-1" />
          {renderMenuCard(financeMenuItems)}
        </section>
      </section>
    </MainLayout>
  )
}

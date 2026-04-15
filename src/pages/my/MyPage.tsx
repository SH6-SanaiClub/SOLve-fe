import { Coins, FileChartColumn, Landmark, ShieldCheck, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Card, Icons } from '../../components/common'
import BottomNavigation from '../../components/layout/BottomNavigation'
import MainLayout from '../../components/layout/MainLayout'
import {
  BOTTOM_NAVIGATION_ITEMS,
  BOTTOM_NAVIGATION_ROUTE_BY_KEY,
} from '../../constants/bottomNavigation'
import { ROUTE_PATHS } from '../../constants/routePaths'
import { authService } from '../../services/authService'
import { clearClientAuthSession } from '../../utils/authSession'
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
    label: 'ESG 활동 현황',
    icon: <ShieldCheck size={18} />,
    path: ROUTE_PATHS.myGrade,
  },
  {
    key: 'report',
    label: 'ESG 활동 인증서',
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
    key: 'financeSavings',
    label: '적금 관리',
    icon: <Landmark size={18} />,
    path: ROUTE_PATHS.myFinance,
  },
  {
    key: 'financeLoan',
    label: '대출 관리',
    icon: <Landmark size={18} />,
    path: ROUTE_PATHS.myFinanceLoanManage,
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
  ['grade', 'storePurchase', 'report', 'point'].includes(item.key),
)
const financeMenuItems = menuItems.filter((item) =>
  ['financeSavings', 'financeLoan'].includes(item.key),
)

export const MyPage = () => {
  const navigate = useNavigate()

  const handleBottomNavigation = (key: string) => {
    const nextPath =
      BOTTOM_NAVIGATION_ROUTE_BY_KEY[key as keyof typeof BOTTOM_NAVIGATION_ROUTE_BY_KEY]

    if (nextPath) {
      navigate(nextPath)
    }
  }

  const handleLogout = async () => {
    if (!window.confirm('로그아웃 하시겠습니까?')) {
      return
    }

    const refreshToken = localStorage.getItem('refreshToken')

    try {
      if (refreshToken) {
        await authService.logout(refreshToken)
      }
    } finally {
      clearClientAuthSession()
    }
    navigate(ROUTE_PATHS.login)
  }

  const renderMenuItems = (items: typeof menuItems, showBottomBorder = false) => (
    <>
      {items.map((item, index) => {
        const hasDivider = index < items.length - 1 || showBottomBorder

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => navigate(item.path)}
            className={`flex w-full items-center justify-between px-5 py-5 text-left ${
              hasDivider ? 'border-b border-gray-100' : ''
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
        )
      })}
    </>
  )

  const renderActivityFinanceMenuCard = () => (
    <Card className="!gap-0 !p-0 mt-3">
      <div className="px-5 pb-2 pt-5">
        <p className="text-xs font-semibold tracking-[0.18em] text-gray-400">활동</p>
      </div>
      {renderMenuItems(activityMenuItems, financeMenuItems.length > 0)}

      {financeMenuItems.length > 0 ? (
        <>
          <div className="px-5 pb-2 pt-5">
            <p className="text-xs font-semibold tracking-[0.18em] text-gray-400">금융</p>
          </div>
          {renderMenuItems(financeMenuItems)}
        </>
      ) : null}
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
          {renderActivityFinanceMenuCard()}
        </section>


        <section className="flex flex-col gap-3">
          <Card className="!gap-0 !p-0">
            <div className="px-5 pb-2 pt-5">
              <p className="text-xs font-semibold tracking-[0.18em] text-gray-400">계정</p>
            </div>
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

      </section>
    </MainLayout>
  )
}

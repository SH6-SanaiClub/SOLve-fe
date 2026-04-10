import { Coins, FileChartColumn, FileText, Landmark, ShieldCheck, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Card, Icons, InfoRow, ProgressBar, SectionHeader } from '../../components/common'
import BottomNavigation from '../../components/layout/BottomNavigation'
import MainLayout from '../../components/layout/MainLayout'
import {
  BOTTOM_NAVIGATION_ITEMS,
  BOTTOM_NAVIGATION_ROUTE_BY_KEY,
} from '../../constants/bottomNavigation'
import { ROUTE_PATHS } from '../../constants/routePaths'
import { useAuth } from '../../hooks/useAuth'
import type { UserGrade } from '../../types/user'
import { ShopHeader } from '../shop/components/ShopHeader'

const gradeLabelMap: Record<UserGrade, string> = {
  SEED: '씨앗',
  SPROUT: '새싹',
  TREE: '나무',
  FOREST: '숲',
  EARTH: '지구',
}

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
  {
    key: 'report',
    label: 'ESG 활동 보고서',
    icon: <FileChartColumn size={18} />,
    path: ROUTE_PATHS.myReport,
  },
]

const defaultGradeProgress = {
  current: 100,
  target: 690,
  visualValue: 68,
}

const defaultPoints = 12400

const numberFormatter = new Intl.NumberFormat('ko-KR')

export const MyPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const userName = user?.name ?? '김태호'
  const userLoginId = user?.loginId ?? 'taeho_kim_88'
  const currentGrade = user?.currentGrade ?? 'SPROUT'
  const gradeLabel = gradeLabelMap[currentGrade]
  const totalPoints = user?.totalPoints ?? defaultPoints
  const formattedPoints = `${numberFormatter.format(totalPoints)}p`

  const handleBottomNavigation = (key: string) => {
    const nextPath =
      BOTTOM_NAVIGATION_ROUTE_BY_KEY[key as keyof typeof BOTTOM_NAVIGATION_ROUTE_BY_KEY]

    if (nextPath) {
      navigate(nextPath)
    }
  }

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
      <div className="mt-5 flex flex-col gap-3">
        <section className="pl-3">
          <div className="flex min-w-0 flex-col justify-center py-2">
            <p className="text-[11px] font-bold tracking-[0.08em] text-primary-400 uppercase">
              Member Profile
            </p>
            <p className="mt-1 text-[32px] leading-[1.1] tracking-tight font-semibold text-gray-700">
              {userName}
            </p>
            <p className="mt-1 text-sm text-font-sub">{userLoginId}</p>
          </div>
        </section>

        <div className="flex flex-col gap-6">
          <Card className="!h-[136px]">
            <div className="space-y-3">
              <SectionHeader
                title={
                  <span className="text-lg font-semibold text-gray-700">
                    나의 등급 <span className="text-primary-500">{gradeLabel}</span>
                  </span>
                }
                right={
                  <span className="text-xs font-medium text-gray-400">
                    {defaultGradeProgress.current} / {defaultGradeProgress.target}
                  </span>
                }
              />
              <ProgressBar value={defaultGradeProgress.visualValue} max={100} />
              <div className="h-px w-full bg-gray-100" />
              <InfoRow
                label={<span className="text-base font-medium text-gray-500">보유 포인트</span>}
                value={<span className="text-base font-medium text-gray-500">{formattedPoints}</span>}
                className="items-center"
              />
            </div>
          </Card>

          <section className="flex flex-col gap-3">
            <SectionHeader title="메뉴" className="px-3" />

            <Card className="!gap-0 !p-0">
              {menuItems.map((item, index) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`flex w-full items-center justify-between px-5 py-5 text-left ${
                    index < menuItems.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 text-primary-500">
                      {item.icon}
                    </div>
                    <span className="text-[15px] font-medium text-font-main">{item.label}</span>
                  </div>

                  <Icons.ArrowRight className="text-gray-300" size={20} />
                </button>
              ))}
            </Card>
          </section>
        </div>
      </div>
    </MainLayout>
  )
}

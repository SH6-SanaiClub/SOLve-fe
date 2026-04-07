import { useLocation, useNavigate } from 'react-router-dom'
import { Card, IconButton, Icons, InfoRow, ProgressBar, SectionHeader } from '../../components/common'
import BottomNavigation from '../../components/layout/BottomNavigation'
import Header from '../../components/layout/Header'
import MainLayout from '../../components/layout/MainLayout'
import headerLogo from '../../assets/home/logo.png'
import {
  BOTTOM_NAVIGATION_ITEMS,
  BOTTOM_NAVIGATION_ROUTE_BY_KEY,
} from '../../constants/bottomNavigation'
import { ROUTE_PATHS } from '../../constants/routePaths'
import { useAuth } from '../../hooks/useAuth'
import type { UserGrade } from '../../types/user'
import { DashboardActionTile } from './components/DashboardActionTile'
import { WeeklyActivityTracker } from './components/WeeklyActivityTracker'
import {
  defaultGradeProgress,
  defaultPoints,
  gradeLabelMap,
  weeklyActivityStatuses,
} from './homeDashboardData'

const numberFormatter = new Intl.NumberFormat('ko-KR')

function getGradeLabel(grade?: UserGrade | null) {
  if (!grade) {
    return '새싹'
  }

  return gradeLabelMap[grade]
}

export function HomePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()

  const userName = user?.name ?? '000'
  const gradeLabel = getGradeLabel(user?.currentGrade)
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
      header={
        <Header
          bgColor="bg-bg-light"
          left={<img src={headerLogo} alt="SOLve" className="h-[36px] w-auto object-contain" />}
          right={
            <div className="flex items-center gap-2">
              <IconButton
                label="AI 챗봇으로 이동"
                icon={<Icons.Chat size={22} />}
                size="sm"
                onClick={() => navigate(ROUTE_PATHS.chatbot)}
              />
              <IconButton
                label="메뉴 열기"
                icon={<Icons.Menu size={22} />}
                size="sm"
                onClick={() => undefined}
              />
            </div>
          }
        />
      }
      nav={
        <BottomNavigation
          items={BOTTOM_NAVIGATION_ITEMS}
          value="home"
          onChange={handleBottomNavigation}
        />
      }
    >
      <div className="mt-5 flex flex-col gap-3">
        <section className="pl-3">
          <div className="flex min-w-0 flex-col justify-center py-2">
            <p className="text-xl leading-[1.1] tracking-tight font-semibold">
              <span className="text-primary-500">{userName}</span>
              <span className="text-gray-700">님,</span>
            </p>
            <p className="text-xl leading-[1.1] tracking-tight font-semibold text-gray-700">
              오늘의 실천을 시작해볼까요?
            </p>
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
            <DashboardActionTile
              title="S 활동하기"
              descriptionItems={['기부', '가치가게', '봉사']}
              variant="primary"
              size="lg"
              onClick={() => navigate(ROUTE_PATHS.activitySocialDonation)}
            />

            <div className="grid grid-cols-2 gap-4">
              <DashboardActionTile
                title="친환경 활동"
                variant="outline"
                onClick={() =>
                  navigate(ROUTE_PATHS.esgEnv, { state: { backgroundLocation: location } })
                }
              />
              <DashboardActionTile
                title="오늘의 퀴즈"
                variant="outline"
                onClick={() => navigate(ROUTE_PATHS.shop)}
              />
            </div>
          </section>

          <Card className="!h-[141px]">
            <div className="space-y-4">
              <SectionHeader
                title={<span className="text-base font-semibold text-gray-700">이번주 나의 활동</span>}
                right={<span className="text-xs font-medium text-gray-400">3/21 - 3/27</span>}
              />
              <WeeklyActivityTracker items={weeklyActivityStatuses} />
            </div>
          </Card>

          <Card
            onClick={() => navigate(ROUTE_PATHS.chatbot)}
            className="!h-[46px] !p-0"
          >
            <div className="flex h-[44px] items-center justify-between gap-3 px-5">
              <span className="text-base leading-none font-semibold text-gray-700">
                AI 맞춤 활동 추천
              </span>
              <Icons.ArrowRight className="text-gray-700" size={18} />
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}

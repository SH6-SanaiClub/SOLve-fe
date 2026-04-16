import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Badge, Card, IconButton, Icons, InfoRow, ProgressBar, SectionHeader } from '../../components/common'
import BottomNavigation from '../../components/layout/BottomNavigation'
import Header from '../../components/layout/Header'
import MainLayout from '../../components/layout/MainLayout'
import {
  BOTTOM_NAVIGATION_ITEMS,
  BOTTOM_NAVIGATION_ROUTE_BY_KEY,
} from '../../constants/bottomNavigation'
import { getS3AssetUrl } from '../../constants/assetUrls'
import { ROUTE_PATHS } from '../../constants/routePaths'
import { useAuth } from '../../hooks/useAuth'
import { usePullToRefresh } from '../../hooks/usePullToRefresh'
import type { WeeklyActivityStatus } from '../../types/home'
import type { UserGrade } from '../../types/user'
import { DashboardActionTile } from './components/DashboardActionTile'
import { PullRefreshSpinner } from './components/PullRefreshSpinner'
import { WeeklyActivityTracker } from './components/WeeklyActivityTracker'
import { useHomeDashboardSummary } from './hooks/useHomeDashboardSummary'

const numberFormatter = new Intl.NumberFormat('ko-KR')

const gradeLabelMap: Record<UserGrade, string> = {
  SEED: '씨앗',
  SPROUT: '새싹',
  TREE: '나무',
  FOREST: '숲',
  EARTH: '지구',
}

const emptyWeeklyActivities: WeeklyActivityStatus[] = [
  { day: '월', completed: false },
  { day: '화', completed: false },
  { day: '수', completed: false },
  { day: '목', completed: false },
  { day: '금', completed: false },
  { day: '토', completed: false },
  { day: '일', completed: false },
]

function getGradeLabel(grade?: UserGrade | null) {
  if (!grade) {
    return '새싹'
  }

  return gradeLabelMap[grade]
}

function getCurrentWeekRangeLabel() {
  const today = new Date()
  const day = today.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day

  const startDate = new Date(today)
  startDate.setDate(today.getDate() + diffToMonday)

  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + 6)

  const format = (date: Date) => `${date.getMonth() + 1}/${date.getDate()}`

  return `${format(startDate)} - ${format(endDate)}`
}

export function HomePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { summary, refreshSummary } = useHomeDashboardSummary()
  const contentRef = useRef<HTMLElement | null>(null)
  const chatbotImageRef = useRef<HTMLImageElement | null>(null)
  const [displayedPoints, setDisplayedPoints] = useState(0)

  const handleRefresh = useCallback(async () => {
    await refreshSummary()
  }, [refreshSummary])

  const { isPulling, isRefreshing, pullDistance, pullProgress } = usePullToRefresh({
    containerRef: contentRef,
    onRefresh: handleRefresh,
  })

  const userName = summary?.name ?? user?.name ?? '000'
  const gradeLabel = getGradeLabel(summary?.currentGrade ?? user?.currentGrade)
  const totalPoints = summary?.totalPoints ?? user?.totalPoints ?? 0
  const formattedPoints = `${numberFormatter.format(displayedPoints)}p`
  const headerLogo = getS3AssetUrl('logo.webp')
  const chatbotButtonImage = getS3AssetUrl('chatbot_home.png')
  const weekRangeLabel = getCurrentWeekRangeLabel()
  const gradeProgress = summary?.gradeProgress ?? {
    current: 0,
    target: 600,
    visualValue: 0,
  }
  const weeklyActivities = summary?.weeklyActivities ?? emptyWeeklyActivities

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const chatbotImage = chatbotImageRef.current

    if (!chatbotImage) {
      return
    }

    if (mediaQuery.matches) {
      chatbotImage.style.opacity = '1'
      chatbotImage.style.transform = 'translateY(0) scale(1)'
      return
    }

    let entranceAnimation: Animation | null = null
    const startTimer = window.setTimeout(() => {
      entranceAnimation = chatbotImage.animate(
        [
          { opacity: 0, transform: 'translateY(8px) scale(0.97)' },
          { opacity: 0.84, transform: 'translateY(1px) scale(1)', offset: 0.64 },
          { opacity: 1, transform: 'translateY(-4px) scale(1.02)', offset: 0.86 },
          { opacity: 1, transform: 'translateY(0) scale(1)' },
        ],
        {
          duration: 2100,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'forwards',
        },
      )

      entranceAnimation.onfinish = () => {
        chatbotImage.style.opacity = '1'
        chatbotImage.style.transform = 'translateY(0) scale(1)'
      }
    }, 220)

    return () => {
      window.clearTimeout(startTimer)
      entranceAnimation?.cancel()
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let animationFrameId = 0

    if (mediaQuery.matches || totalPoints <= 0) {
      animationFrameId = window.requestAnimationFrame(() => {
        setDisplayedPoints(totalPoints)
      })
      return () => {
        window.cancelAnimationFrame(animationFrameId)
      }
    }

    const duration = 850
    let startTime: number | null = null

    const animate = (currentTime: number) => {
      if (startTime === null) {
        startTime = currentTime
        setDisplayedPoints(0)
      }

      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = 1 - Math.pow(1 - progress, 3)

      setDisplayedPoints(Math.round(totalPoints * easedProgress))

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(animate)
      }
    }

    animationFrameId = window.requestAnimationFrame(animate)

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [totalPoints])

  const handleBottomNavigation = (key: string) => {
    const nextPath =
      BOTTOM_NAVIGATION_ROUTE_BY_KEY[key as keyof typeof BOTTOM_NAVIGATION_ROUTE_BY_KEY]

    if (nextPath) {
      navigate(nextPath)
    }
  }

  return (
    <MainLayout
      contentRef={contentRef}
      header={
        <Header
          bgColor="bg-bg-light"
          left={<img src={headerLogo} alt="SOLve" className="h-[36px] w-auto object-contain" />}
          right={
            <div className="flex items-center gap-2">
              <IconButton
                label="AI 챗봇으로 이동"
                icon={
                  <img
                    ref={chatbotImageRef}
                    src={chatbotButtonImage}
                    alt=""
                    aria-hidden="true"
                    className="h-[36px] w-[36px] object-contain"
                    style={{
                      opacity: 0,
                      transform: 'translateY(8px) scale(0.97)',
                      willChange: 'opacity, transform',
                    }}
                  />
                }
                size="md"
                onClick={() => navigate(ROUTE_PATHS.chatbot)}
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
      <div className="relative">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center"
          style={{
            opacity: pullDistance > 0 || isRefreshing ? 1 : 0,
            transform: `translateY(${Math.max(pullDistance * 0.72 - 6, 0)}px)`,
            transition: isPulling ? 'none' : 'opacity 180ms ease, transform 180ms ease',
          }}
        >
          <PullRefreshSpinner
            progress={pullProgress}
            isRefreshing={isRefreshing}
            visible={pullDistance > 0 || isRefreshing}
          />
        </div>

        <div
          style={{
            transform: `translateY(${pullDistance}px)`,
            transition: isPulling ? 'none' : 'transform 180ms ease',
          }}
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
                        {gradeProgress.current} / {gradeProgress.target}
                      </span>
                    }
                  />
                  <ProgressBar value={gradeProgress.visualValue} max={100} />
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
                    onClick={() => navigate(ROUTE_PATHS.esgQuiz)}
                  />
                </div>
              </section>

              <Card className="!h-[141px]">
                <div className="space-y-4">
                  <SectionHeader
                    title={<span className="text-base font-semibold text-gray-700">이번주 나의 활동</span>}
                    right={<span className="text-xs font-medium text-gray-400">{weekRangeLabel}</span>}
                  />
                  <WeeklyActivityTracker items={weeklyActivities} />
                </div>
              </Card>

              <Card
                onClick={() => navigate(ROUTE_PATHS.recommend)}
                className="hidden !h-[46px] !p-0"
              >
                <div className="flex h-[44px] items-center justify-between gap-3 px-5">
                  <span className="text-sm leading-none font-semibold text-gray-700">
                    AI 맞춤 활동 추천
                  </span>
                  <Icons.ArrowRight className="text-gray-700" size={18} />
                </div>
              </Card>

              <Card
                onClick={() => navigate(ROUTE_PATHS.esgQuiz)}
                className="hidden !gap-0 !overflow-hidden !border !border-orange-100 !p-0 shadow-[0_10px_24px_rgba(15,23,42,0.06)]"
              >
                <div className="bg-linear-to-r from-orange-50 via-white to-white px-5 pt-4 pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge tone="danger" variant="soft" className="!px-[10px] !py-[4px]">
                          HOT
                        </Badge>
                        <span className="text-xs font-medium text-gray-500">
                          지금 가장 많이 참여 중인 활동
                        </span>
                      </div>
                      <p className="mt-3 text-base font-semibold text-gray-700">오늘의 ESG 퀴즈</p>
                      <p className="mt-1 text-sm leading-5 text-gray-500">
                        짧게 참여하고 점수와 포인트를 함께 받을 수 있어요
                      </p>
                    </div>
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm">
                      <Icons.ArrowRight size={16} />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-gray-300">+10점 · +300P</span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-500 shadow-sm">
                      1분 참여
                    </span>
                  </div>
                </div>
              </Card>

              <section className="hidden flex-col gap-3">
                <Card
                  onClick={() => navigate(ROUTE_PATHS.recommend)}
                  className="!gap-0 !overflow-hidden !border !border-gray-100 !p-0 shadow-sm"
                >
                  <div className="bg-white px-5 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-base font-semibold text-gray-700">
                          AI 맞춤 활동 추천
                        </p>
                        <p className="mt-1 text-sm leading-5 text-gray-500">
                          내 활동 기록을 바탕으로 어울리는 활동을 추천해드려요
                        </p>
                      </div>

                      <Icons.ArrowRight className="mt-1 shrink-0 text-gray-400" size={18} />
                    </div>
                  </div>
                </Card>

                <Card
                  onClick={() => navigate(ROUTE_PATHS.esgQuiz)}
                  className="!gap-0 !overflow-hidden !border !border-gray-100 !p-0 shadow-sm"
                >
                  <div className="bg-white px-5 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <Badge tone="danger" variant="soft" className="!px-[10px] !py-[4px]">
                          인기
                        </Badge>
                        <span className="text-xs font-medium text-gray-500">
                          지금 가장 많이 참여 중인 활동
                        </span>
                        <p className="mt-2 text-base font-semibold text-gray-700">오늘의 ESG 퀴즈</p>
                        <p className="mt-1 text-sm leading-5 text-gray-500">
                          짧게 참여하고 점수와 포인트를 함께 받을 수 있어요
                        </p>
                      </div>

                      <Icons.ArrowRight className="mt-1 shrink-0 text-gray-400" size={18} />
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
                      <span className="text-sm font-semibold text-primary-500">+10점 · +300P</span>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-500 shadow-sm">
                        약 1분
                      </span>
                    </div>
                  </div>
                </Card>
              </section>

              <section className="flex flex-col gap-3">
                <Card
                  onClick={() => navigate(ROUTE_PATHS.recommend)}
                  className="!gap-0 !overflow-hidden !border !border-gray-100 !p-0 shadow-sm"
                >
                  <div className="bg-white px-5 py-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-base font-semibold text-gray-700">AI 맞춤 활동 추천</p>
                        <p className="text-xs leading-5 text-gray-500">
                          내 활동에 맞는 추천을 확인해보세요
                        </p>
                      </div>
                      <Icons.ArrowRight className="shrink-0 text-gray-500" size={24} />
                    </div>
                  </div>
                </Card>
              </section>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import mainMascotImage from '../../assets/home/main-mascot.png'
import { IconButton, Icons } from '../../components/common'
import BottomNavigation from '../../components/layout/BottomNavigation'
import Header from '../../components/layout/Header'
import MainLayout from '../../components/layout/MainLayout'
import {
  BOTTOM_NAVIGATION_ITEMS,
  BOTTOM_NAVIGATION_ROUTE_BY_KEY,
} from '../../constants/bottomNavigation'
import {
  ROUTE_PATHS,
  getDonationDetailPath,
  getEnvVerifyPath,
  getValueStoreProductDetailPath,
} from '../../constants/routePaths'
import { useAuth } from '../../hooks/useAuth'
import { getDonationDetail } from '../../services/donationService'
import { getValueStoreProductDetail } from '../../services/productService'
import { getActivityRecommend } from '../../services/recommendService'
import type { EnvActivityType } from '../../types/environmentVerification'
import type { ActivityRecommendResponse, RecommendedActivity } from '../../types/recommend'
import { useHomeDashboardSummary } from '../home/hooks/useHomeDashboardSummary'
import { ActivityCard } from './components/ActivityCard'
import { AiSummaryCard } from './components/AiSummaryCard'
import { PopularActivityCard } from './components/PopularActivityCard'
import { PopularActivityGuideModal } from './components/PopularActivityGuideModal'

type ActivityImageMap = Record<string, string>

type PopularActivityGuard =
  | {
      title: string
      message: string
      confirmLabel?: undefined
      nextPath?: undefined
    }
  | {
      title: string
      message: string
      confirmLabel: string
      nextPath: string
    }

const getActivityKey = (activity: RecommendedActivity) =>
  `${activity.activityType}-${activity.referenceId}`

const getEnvActivityTypeFromActivity = (
  activity: RecommendedActivity,
): EnvActivityType | null => {
  const normalizedText = `${activity.name} ${activity.description ?? ''}`.toLowerCase()

  if (normalizedText.includes('텀블러') || normalizedText.includes('tumbler')) {
    return 'tumbler'
  }

  if (
    normalizedText.includes('자전거') ||
    normalizedText.includes('따릉이') ||
    normalizedText.includes('shared-bike') ||
    normalizedText.includes('bike')
  ) {
    return 'shared-bike'
  }

  if (
    normalizedText.includes('전기차') ||
    normalizedText.includes('ev') ||
    normalizedText.includes('렌트카') ||
    normalizedText.includes('대여')
  ) {
    return 'ev-rental'
  }

  return null
}

const getActivityPath = (activity: RecommendedActivity) => {
  switch (activity.activityType) {
    case 'DONATION':
      return getDonationDetailPath(activity.referenceId)
    case 'PURCHASE':
      return getValueStoreProductDetailPath(activity.referenceId)
    case 'PHOTO': {
      const envActivityType = getEnvActivityTypeFromActivity(activity)

      return envActivityType
        ? getEnvVerifyPath(envActivityType)
        : ROUTE_PATHS.activityEnvironment
    }
    case 'QUIZ':
      return ROUTE_PATHS.activityGovernance
    case 'VOLUNTEER':
      return ROUTE_PATHS.activitySocial
    default:
      return null
  }
}

const shouldUseEnvBackNavigation = (activity: RecommendedActivity) =>
  activity.activityType === 'PHOTO'

const getPopularActivityGuard = (
  activity: RecommendedActivity,
  nextPath: string | null,
): PopularActivityGuard | null => {
  if (
    activity.alreadyParticipatedToday &&
    (activity.activityType === 'PHOTO' || activity.activityType === 'QUIZ')
  ) {
    return {
      title: '오늘은 이미 참여했어요',
      message: '오늘 이미 참여한 활동이에요. 내일 다시 참여할 수 있어요!',
    }
  }

  if (activity.monthlyLimitReached && nextPath) {
    return {
      title: '이번 달 점수를 모두 채웠어요',
      message: `이번 달 ${activity.scoreCategory} 활동 점수는 모두 채웠어요. 참여하면 점수는 쌓이지 않지만 포인트는 적립돼요. 그래도 참여하시겠어요?`,
      confirmLabel: '활동하러 가기',
      nextPath,
    }
  }

  return null
}

const RecommendLoadingState = () => (
  <div
    className="fixed left-1/2 z-40 flex w-full max-w-[600px] -translate-x-1/2 items-center justify-center px-6"
    style={{
      top: 'var(--header-h)',
      bottom: 'calc(var(--nav-h) + env(safe-area-inset-bottom))',
    }}
  >
    <div className="absolute inset-0 bg-[rgba(241,245,249,0.72)] backdrop-blur-[2px]" />

    <div className="relative w-full max-w-[280px] rounded-[28px] border border-white/80 bg-white/96 px-6 py-7 text-center shadow-[0_18px_40px_rgba(15,23,42,0.10)]">
      <div className="mx-auto flex h-[110px] w-[110px] items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,_rgba(0,70,255,0.16),_rgba(255,255,255,0.95)_68%)]">
        <img
          src={mainMascotImage}
          alt="SOLve 마스코트"
          className="h-[84px] w-[84px] object-contain animate-bounce"
        />
      </div>

      <p className="mt-5 text-[18px] font-semibold tracking-[-0.02em] text-font-main">
        맞춤 추천중...
      </p>
      <p className="mt-2 text-sm leading-6 text-font-sub break-keep">
        잠시만 기다리면 딱 맞는 활동을 보여드릴게요.
      </p>

      <div className="mt-4 flex items-center justify-center gap-2">
        {[1, 2, 3].map((index) => (
          <span
            key={index}
            className="h-2.5 w-2.5 rounded-full bg-primary-400 animate-pulse"
            style={{ animationDelay: `${index * 0.18}s` }}
          />
        ))}
      </div>
    </div>
  </div>
)

export const RecommendPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { summary } = useHomeDashboardSummary()

  const [data, setData] = useState<ActivityRecommendResponse | null>(null)
  const [activityImageMap, setActivityImageMap] = useState<ActivityImageMap>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [popularActivityGuard, setPopularActivityGuard] =
    useState<PopularActivityGuard | null>(null)

  useEffect(() => {
    const fetchRecommend = async () => {
      try {
        const result = await getActivityRecommend()
        setData(result)
      } catch {
        setError('추천 정보를 불러오지 못했어요.')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchRecommend()
  }, [])

  useEffect(() => {
    if (!data) {
      setActivityImageMap({})
      return
    }

    let isMounted = true

    const uniqueActivities = [
      ...data.activities,
      ...(data.popularActivity ? [data.popularActivity] : []),
    ].filter(
      (activity, index, activities) =>
        activities.findIndex(
          (candidate) => getActivityKey(candidate) === getActivityKey(activity),
        ) === index,
    )

    const fetchActivityImages = async () => {
      const results = await Promise.allSettled(
        uniqueActivities.map(async (activity) => {
          if (activity.activityType === 'DONATION') {
            const detail = await getDonationDetail(activity.referenceId)
            return [getActivityKey(activity), detail.imageUrl] as const
          }

          if (activity.activityType === 'PURCHASE') {
            const detail = await getValueStoreProductDetail(activity.referenceId)
            return [getActivityKey(activity), detail.imageUrl] as const
          }

          return null
        }),
      )

      if (!isMounted) {
        return
      }

      const nextImageMap: ActivityImageMap = {}

      results.forEach((result) => {
        if (result.status !== 'fulfilled' || !result.value) {
          return
        }

        const [key, imageUrl] = result.value

        if (imageUrl) {
          nextImageMap[key] = imageUrl
        }
      })

      setActivityImageMap(nextImageMap)
    }

    void fetchActivityImages()

    return () => {
      isMounted = false
    }
  }, [data])

  const userName = summary?.name?.trim() || user?.name?.trim() || user?.loginId?.trim() || ''

  const handleBottomNavigation = (key: string) => {
    const nextPath =
      BOTTOM_NAVIGATION_ROUTE_BY_KEY[key as keyof typeof BOTTOM_NAVIGATION_ROUTE_BY_KEY]

    if (nextPath) {
      navigate(nextPath)
    }
  }

  const handleActivityClick = (activity: RecommendedActivity) => {
    const nextPath = getActivityPath(activity)

    if (nextPath) {
      navigate(
        nextPath,
        shouldUseEnvBackNavigation(activity)
          ? { state: { fromEnv: true } }
          : undefined,
      )
    }
  }

  const handlePopularActivityClick = (activity: RecommendedActivity) => {
    const nextPath = getActivityPath(activity)
    const guard = getPopularActivityGuard(activity, nextPath)

    if (guard) {
      setPopularActivityGuard(guard)
      return
    }

    if (nextPath) {
      navigate(
        nextPath,
        shouldUseEnvBackNavigation(activity)
          ? { state: { fromEnv: true } }
          : undefined,
      )
    }
  }

  const popularActivity = data?.popularActivity ?? null

  return (
    <MainLayout
      header={
        <Header
          left={
            <IconButton
              label="뒤로가기"
              icon={<Icons.Back size={20} />}
              size="sm"
              onClick={() => navigate(-1)}
            />
          }
          title="AI 맞춤 활동 추천"
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
      {error ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-font-sub">{error}</p>
        </div>
      ) : data ? (
        <div className="mt-2 flex flex-col gap-5">
          <AiSummaryCard userName={userName} llmSummary={data.llmSummary} />

          {data.activities.map((activity) => (
            <ActivityCard
              key={getActivityKey(activity)}
              activity={activity}
              imageUrl={activityImageMap[getActivityKey(activity)]}
              onClick={() => handleActivityClick(activity)}
            />
          ))}

          {popularActivity ? (
            <PopularActivityCard
              activity={popularActivity}
              imageUrl={activityImageMap[getActivityKey(popularActivity)]}
              onClick={() => handlePopularActivityClick(popularActivity)}
            />
          ) : null}
        </div>
      ) : null}

      <PopularActivityGuideModal
        open={Boolean(popularActivityGuard)}
        title={popularActivityGuard?.title ?? ''}
        message={popularActivityGuard?.message ?? ''}
        confirmLabel={popularActivityGuard?.confirmLabel}
        onClose={() => setPopularActivityGuard(null)}
        onConfirm={
          popularActivityGuard?.nextPath
            ? () => {
                navigate(
                  popularActivityGuard.nextPath,
                  popularActivity?.activityType === 'PHOTO'
                    ? { state: { fromEnv: true } }
                    : undefined,
                )
                setPopularActivityGuard(null)
              }
            : undefined
        }
      />

      {isLoading ? <RecommendLoadingState /> : null}
    </MainLayout>
  )
}

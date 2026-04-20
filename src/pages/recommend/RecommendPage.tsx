import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import mainMascotImage from '../../assets/home/main-mascot.png'
import { Badge, IconButton, Icons } from '../../components/common'
import BottomNavigation from '../../components/layout/BottomNavigation'
import Header from '../../components/layout/Header'
import MainLayout from '../../components/layout/MainLayout'
import {
  BOTTOM_NAVIGATION_ITEMS,
  BOTTOM_NAVIGATION_ROUTE_BY_KEY,
} from '../../constants/bottomNavigation'
import { useAuth } from '../../hooks/useAuth'
import { getDonationDetail } from '../../services/donationService'
import { getValueStoreProductDetail } from '../../services/productService'
import { getActivityRecommend } from '../../services/recommendService'
import type { ActivityRecommendResponse, RecommendedActivity } from '../../types/recommend'
import { useHomeDashboardSummary } from '../home/hooks/useHomeDashboardSummary'
import { ActivityCard } from './components/ActivityCard'
import { AiSummaryCard } from './components/AiSummaryCard'
import { PopularActivityGuideModal } from './components/PopularActivityGuideModal'
import {
  getActivityPath,
  getActivityNavigationState,
  getPopularActivityGuard,
  type PopularActivityGuard,
} from './recommendActivityUtils'

type ActivityImageMap = Record<string, string>

const getActivityKey = (activity: RecommendedActivity) =>
  `${activity.activityType}-${activity.referenceId}`

const RecommendLoadingModal = () => (
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
  const [popularActivityGuard, setPopularActivityGuard] = useState<PopularActivityGuard | null>(
    null,
  )

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
    const uniqueActivities = [data.popularActivity, ...data.activities]
      .filter((activity): activity is RecommendedActivity => Boolean(activity))
      .filter(
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
  const popularActivity = data?.popularActivity ?? null

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
      navigate(nextPath, {
        state: getActivityNavigationState(activity),
      })
    }
  }

  const handlePopularActivityClick = () => {
    if (!popularActivity) {
      return
    }

    const nextPath = getActivityPath(popularActivity)
    const guard = getPopularActivityGuard(popularActivity, nextPath)

    if (guard) {
      setPopularActivityGuard(guard)
      return
    }

    if (nextPath) {
      navigate(nextPath, {
        state: getActivityNavigationState(popularActivity),
      })
    }
  }

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
              categoryBadgePlacement="title-right"
            />
          ))}

          {popularActivity ? (
            <section className="mt-1 flex flex-col gap-3">
              <div className="flex items-start gap-3 px-1">
                <Badge tone="primary" variant="solid" className="shrink-0 !px-[10px] !py-[4px]">
                  인기
                </Badge>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-font-main">지금 가장 많이 참여하는 활동</p>
                </div>
              </div>

              <ActivityCard
                activity={popularActivity}
                imageUrl={activityImageMap[getActivityKey(popularActivity)]}
                onClick={handlePopularActivityClick}
                categoryBadgePlacement="title-right"
                progressTextClassName="text-primary-400"
                progressBarClassName="bg-primary-400"
              />
            </section>
          ) : null}
        </div>
      ) : null}

      {isLoading ? <RecommendLoadingModal /> : null}

      <PopularActivityGuideModal
        open={Boolean(popularActivityGuard)}
        title={popularActivityGuard?.title ?? ''}
        message={popularActivityGuard?.message ?? ''}
              confirmLabel={popularActivityGuard?.confirmLabel}
              onClose={() => setPopularActivityGuard(null)}
              onConfirm={
                popularActivityGuard?.nextPath
                  ? () => {
                      if (!popularActivity) {
                        return
                      }

                      navigate(popularActivityGuard.nextPath, {
                        state: getActivityNavigationState(popularActivity),
                      })
                      setPopularActivityGuard(null)
                    }
                  : undefined
        }
      />
    </MainLayout>
  )
}

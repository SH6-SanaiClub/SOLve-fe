import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconButton, Icons } from '../../components/common'
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
import { getActivityPath, shouldUseEnvBackNavigation } from './recommendActivityUtils'

type ActivityImageMap = Record<string, string>

const getActivityKey = (activity: RecommendedActivity) =>
  `${activity.activityType}-${activity.referenceId}`

export const RecommendPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { summary } = useHomeDashboardSummary()
  const [data, setData] = useState<ActivityRecommendResponse | null>(null)
  const [activityImageMap, setActivityImageMap] = useState<ActivityImageMap>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
    const uniqueActivities = data.activities.filter(
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
        shouldUseEnvBackNavigation(activity) ? { state: { fromEnv: true } } : undefined,
      )
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
      {isLoading ? (
        <div className="mt-2 flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 w-full animate-pulse rounded-control bg-gray-100" />
          ))}
        </div>
      ) : error ? (
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
        </div>
      ) : null}
    </MainLayout>
  )
}

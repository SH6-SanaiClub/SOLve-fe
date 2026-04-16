import {
  getDonationDetailPath,
  getEnvVerifyPath,
  getVolunteerDetailPath,
  getValueStoreProductDetailPath,
  ROUTE_PATHS,
} from '../../constants/routePaths'
import type { EnvActivityType } from '../../types/environmentVerification'
import type { RecommendedActivity } from '../../types/recommend'

export type PopularActivityGuard =
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

export const getActivityPath = (activity: RecommendedActivity) => {
  switch (activity.activityType) {
    case 'DONATION':
      return getDonationDetailPath(activity.referenceId)
    case 'PURCHASE':
      return getValueStoreProductDetailPath(activity.referenceId)
    case 'PHOTO': {
      const envActivityType = getEnvActivityTypeFromActivity(activity)

      return envActivityType ? getEnvVerifyPath(envActivityType) : ROUTE_PATHS.activityEnvironment
    }
    case 'QUIZ':
      return ROUTE_PATHS.activityGovernance
    case 'VOLUNTEER':
      return getVolunteerDetailPath(activity.referenceId)
    default:
      return null
  }
}

export const shouldUseEnvBackNavigation = (activity: RecommendedActivity) =>
  activity.activityType === 'PHOTO'

export const getPopularActivityGuard = (
  activity: RecommendedActivity,
  nextPath: string | null,
): PopularActivityGuard | null => {
  if (
    activity.alreadyParticipatedToday &&
    (activity.activityType === 'PHOTO' || activity.activityType === 'QUIZ')
  ) {
    return {
      title: '오늘은 이미 참여했어요',
      message: '오늘 이미 참여한 활동이라 내일 다시 참여할 수 있어요.',
    }
  }

  if (activity.monthlyLimitReached && nextPath) {
    return {
      title: '이번 달 점수를 모두 채웠어요',
      message: `이번 달 ${activity.scoreCategory} 활동 점수는 모두 채웠어요. 참여하면 점수는 쌓이지 않지만 활동에는 참여할 수 있어요. 그래도 참여하시겠어요?`,
      confirmLabel: '활동하러 가기',
      nextPath,
    }
  }

  return null
}

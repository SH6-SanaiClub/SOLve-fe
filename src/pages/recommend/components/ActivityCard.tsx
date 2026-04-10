import { useState } from 'react'
import {
  Camera,
  HeartHandshake,
  ShoppingBag,
  Sparkles,
  UserRoundPlus,
} from 'lucide-react'
import { Badge, Card, ProgressBar, Icons } from '../../../components/common'
import type { RecommendedActivity, ScoreCategory } from '../../../types/recommend'

interface ActivityCardProps {
  activity: RecommendedActivity
  imageUrl?: string | null
  onClick?: () => void
}

const categoryBadge: Record<
  ScoreCategory,
  { label: string; tone: 'primary' | 'success' | 'neutral'; accentText: string; softBg: string }
> = {
  S: {
    label: 'S 활동',
    tone: 'primary',
    accentText: '#0046FF',
    softBg: 'bg-primary-50',
  },
  E: {
    label: 'E 활동',
    tone: 'success',
    accentText: '#059669',
    softBg: 'bg-[#ECFDF5]',
  },
  G: {
    label: 'G 활동',
    tone: 'neutral',
    accentText: '#6B7280',
    softBg: 'bg-gray-100',
  },
}

const formatNumber = (n: number) => new Intl.NumberFormat('ko-KR').format(n)

const getDeadlineDays = (deadlineDate: string | null): number | null => {
  if (!deadlineDate) return null

  const diff = new Date(deadlineDate).getTime() - new Date().getTime()

  if (Number.isNaN(diff)) {
    return null
  }

  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

const resolveImageUrl = (imageUrl: string) => {
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api'
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  const normalizedImageUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`

  if (
    normalizedBaseUrl.startsWith('http://') ||
    normalizedBaseUrl.startsWith('https://')
  ) {
    return `${normalizedBaseUrl}${normalizedImageUrl}`
  }

  return normalizedImageUrl
}

const activityPlaceholderIcon = {
  DONATION: HeartHandshake,
  VOLUNTEER: UserRoundPlus,
  PHOTO: Camera,
  QUIZ: Sparkles,
  PURCHASE: ShoppingBag,
} as const

export const ActivityCard = ({ activity, imageUrl, onClick }: ActivityCardProps) => {
  const [hasImageError, setHasImageError] = useState(false)
  const {
    scoreCategory,
    scoreValue,
    pointValue,
    pointRate,
    deadlineDate,
    currentAmount,
    targetAmount,
    currentEnrolled,
    capacity,
    name,
    activityType,
    description,
  } = activity

  const cat = categoryBadge[scoreCategory]
  const deadlineDays = getDeadlineDays(deadlineDate)
  const isDeadlineNear = deadlineDays !== null && deadlineDays >= 0 && deadlineDays <= 7
  const progressPercent =
    currentAmount !== null && targetAmount !== null && targetAmount > 0
      ? Math.min(Math.round((currentAmount / targetAmount) * 100), 100)
      : null
  const pointLabel =
    pointValue > 0
      ? `+${formatNumber(pointValue)}P`
      : pointRate > 0
        ? `결제금액의 ${Math.round(pointRate * 100)}% 포인트`
        : null
  const hasDonationProgress =
    currentAmount !== null && targetAmount !== null && progressPercent !== null
  const hasHeroImage = Boolean(imageUrl && !hasImageError)
  const resolvedImageUrl = imageUrl ? resolveImageUrl(imageUrl) : null
  const PlaceholderIcon = activityPlaceholderIcon[activityType]

  return (
    <Card
      onClick={onClick}
      className="gap-0 !p-0 overflow-hidden border border-gray-100 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
    >
      <div className="px-4 pt-4 pb-4 sm:px-5">
        <div className="flex flex-col gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
              <Badge
                tone={cat.tone}
                variant="soft"
                className="shrink-0 whitespace-nowrap px-3 py-1.5 text-sm font-semibold"
              >
                {cat.label}
              </Badge>
            </div>

            {isDeadlineNear && deadlineDays !== null ? (
              <Badge
                tone="danger"
                variant="soft"
                className="shrink-0 whitespace-nowrap px-3 py-1.5 text-sm font-semibold"
              >
                마감 {deadlineDays}일
              </Badge>
            ) : null}
          </div>

          <div className="flex gap-3">
            <div className="flex h-[88px] w-[88px] shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-linear-to-br from-primary-50 via-white to-primary-100">
              {hasHeroImage ? (
                <img
                  src={resolvedImageUrl ?? undefined}
                  alt={name}
                  className="h-full w-full object-cover"
                  onError={() => setHasImageError(true)}
                />
              ) : (
                <div className="flex h-[88px] w-[88px] items-center justify-center rounded-[12px] bg-primary-50">
                  <PlaceholderIcon
                    size={28}
                    className={scoreCategory === 'S' ? 'text-primary-500' : 'text-gray-500'}
                  />
                </div>
              )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col justify-center gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-base leading-6 font-bold tracking-[-0.02em] text-font-main break-keep">
                    {name}
                  </p>
                </div>
                {activityType !== 'DONATION' ? (
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-50 text-gray-400">
                    <Icons.ArrowRight size={16} />
                  </div>
                ) : null}
              </div>

              {activityType === 'DONATION' && hasDonationProgress ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm leading-5 text-font-sub break-keep">
                      {formatNumber(currentAmount)} / {formatNumber(targetAmount)}원
                    </span>
                    <span className="shrink-0 text-sm font-bold text-primary-500">
                      {progressPercent}%
                    </span>
                  </div>
                  <ProgressBar value={progressPercent} max={100} className="h-1.5 bg-gray-200" />
                </div>
              ) : activityType === 'VOLUNTEER' ? (
                currentEnrolled !== null && capacity !== null ? (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm leading-5 font-medium text-font-sub">현재 참여 인원</span>
                    <span className="shrink-0 text-sm font-semibold text-font-main">
                      {currentEnrolled}/{capacity}명
                    </span>
                  </div>
                ) : null
              ) : activityType === 'PURCHASE' || activityType === 'PHOTO' || activityType === 'QUIZ' ? null : (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-font-sub break-keep">
                    지금 바로 상세 정보를 확인해보세요
                  </span>
                  <Icons.ArrowRight className="shrink-0 text-gray-400" size={16} />
                </div>
              )}
            </div>
          </div>

          <div>
            <p
              className="text-sm leading-6 font-semibold break-keep"
              style={{ color: cat.accentText }}
              title={`+${scoreValue}점 획득 가능${pointLabel ? ` · ${pointLabel}` : ''}`}
            >
              +{scoreValue}점 획득 가능{pointLabel ? ` · ${pointLabel}` : ''}
            </p>
          </div>
        </div>
      </div>

      {description ? (
        <div className="border-t border-gray-100 bg-gray-50 px-4 py-4 sm:px-5">
          <p className="text-sm leading-6 font-medium text-font-main break-keep">
            {description}
          </p>
        </div>
      ) : null}
    </Card>
  )
}

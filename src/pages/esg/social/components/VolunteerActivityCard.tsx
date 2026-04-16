import { Card } from '../../../../components/common'
import type { VolunteerActivity } from '../../../../types/volunteer'

const resolveImageUrl = (imageUrl?: string | null) => {
  if (!imageUrl) {
    return ''
  }

  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api'
  const normalizedBaseUrl = baseUrl.endsWith('/')
    ? baseUrl.slice(0, -1)
    : baseUrl
  const normalizedImageUrl = imageUrl.startsWith('/')
    ? imageUrl
    : `/${imageUrl}`

  if (
    normalizedBaseUrl.startsWith('http://') ||
    normalizedBaseUrl.startsWith('https://')
  ) {
    return `${normalizedBaseUrl}${normalizedImageUrl}`
  }

  return normalizedImageUrl
}

const formatVolunteerDate = (activityDate: string) => {
  const date = new Date(activityDate)

  if (Number.isNaN(date.getTime())) {
    return activityDate
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}.${month}.${day}`
}

const formatVolunteerTimeRange = (
  activityDate: string,
  volunteerHour: number,
) => {
  const startDate = new Date(activityDate)

  if (Number.isNaN(startDate.getTime())) {
    return `${volunteerHour}시간`
  }

  const endDate = new Date(startDate)
  endDate.setHours(endDate.getHours() + volunteerHour)

  const formatTime = (date: Date) =>
    `${String(date.getHours()).padStart(2, '0')}:${String(
      date.getMinutes(),
    ).padStart(2, '0')}`

  return `${formatTime(startDate)} - ${formatTime(endDate)}`
}

const formatVolunteerLocation = (location: string) =>
  location
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .join(' ')

const getVolunteerMetaLabel = (volunteer: VolunteerActivity) =>
  `${volunteer.organization} | ${formatVolunteerLocation(volunteer.location)}`

interface VolunteerActivityCardProps {
  volunteer: VolunteerActivity
  onClick?: () => void
  actionLabel?: string
  onActionClick?: () => void
  showImage?: boolean
}

export const VolunteerActivityCard = ({
  volunteer,
  onClick,
  actionLabel,
  onActionClick,
  showImage = false,
}: VolunteerActivityCardProps) => {
  return (
    <Card
      data-volunteer-id={volunteer.volunteerId}
      className={`rounded-control overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.05)] ${
        showImage ? '!gap-0 !p-0' : '!p-5'
      }`}
      onClick={onClick}
    >
      {showImage ? (
        <div className="h-[180px] w-full overflow-hidden">
          {resolveImageUrl(volunteer.imageUrl) ? (
            <img
              src={resolveImageUrl(volunteer.imageUrl)}
              alt={volunteer.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gray-200" />
          )}
        </div>
      ) : null}

      <div className={showImage ? 'p-5' : ''}>
        <div className="flex items-stretch justify-between gap-4">
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex flex-col gap-1">
              <p className="text-sm leading-[120%] font-medium tracking-[-0.02em] text-font-sub">
                {getVolunteerMetaLabel(volunteer)}
              </p>
              <h3 className="text-[18px] leading-[120%] font-bold tracking-[-0.02em] text-font-main">
                {volunteer.name}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <div className="flex items-center gap-1">
                <span className="text-xs leading-[120%] font-medium tracking-[-0.02em] text-primary-400">
                  봉사날짜
                </span>
                <span className="text-xs leading-[120%] font-normal tracking-[-0.02em] text-font-sub">
                  {formatVolunteerDate(volunteer.activityDate)}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-xs leading-[120%] font-medium tracking-[-0.02em] text-primary-400">
                  봉사시간
                </span>
                <span className="text-xs leading-[120%] font-normal tracking-[-0.02em] text-font-sub">
                  {formatVolunteerTimeRange(
                    volunteer.activityDate,
                    volunteer.volunteerHour,
                  )}
                </span>
              </div>
            </div>
          </div>

          {actionLabel ? (
            <button
              type="button"
              className="flex shrink-0 items-center self-stretch text-sm leading-[120%] font-medium tracking-[-0.02em] text-primary-400"
              onClick={(event) => {
                event.stopPropagation()
                onActionClick?.()
              }}
            >
              {actionLabel}
            </button>
          ) : null}
        </div>
      </div>
    </Card>
  )
}

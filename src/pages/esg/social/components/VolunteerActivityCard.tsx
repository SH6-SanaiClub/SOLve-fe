import { Card } from '../../../../components/common'
import type { VolunteerActivity } from '../../../../types/volunteer'

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
}

export const VolunteerActivityCard = ({
  volunteer,
  onClick,
  actionLabel,
  onActionClick,
}: VolunteerActivityCardProps) => {
  return (
    <Card
      data-volunteer-id={volunteer.volunteerId}
      className="rounded-control !p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
      onClick={onClick}
    >
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
    </Card>
  )
}

import { Badge } from '../../../components/common'
import { ActivityCard } from './ActivityCard'
import type { RecommendedActivity } from '../../../types/recommend'

interface PopularActivityCardProps {
  activity: RecommendedActivity
  imageUrl?: string | null
  onClick?: () => void
}

export const PopularActivityCard = ({
  activity,
  imageUrl,
  onClick,
}: PopularActivityCardProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Badge
          tone="primary"
          variant="solid"
          className="whitespace-nowrap px-3 py-1.5 text-sm font-semibold shadow-[0_6px_16px_rgba(0,70,255,0.2)]"
        >
          인기
        </Badge>
        <span className="text-sm leading-6 font-medium text-font-sub break-keep">
          지금 가장 인기있는 활동이에요!
        </span>
      </div>
      <ActivityCard activity={activity} imageUrl={imageUrl} onClick={onClick} />
    </div>
  )
}

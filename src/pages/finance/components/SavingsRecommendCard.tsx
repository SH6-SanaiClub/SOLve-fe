import { Badge, Button, Card, Icons } from '../../../components/common'
import type { SavingsRecommendItem } from '../../../types/finance'

interface SavingsRecommendCardProps {
  item: SavingsRecommendItem
  isNewUser: boolean
  onClick: () => void
}

export const SavingsRecommendCard = ({
  item,
  isNewUser,
  onClick,
}: SavingsRecommendCardProps) => {
  return (
    <Card
      onClick={onClick}
      className="!gap-0 !rounded-control !border-0 !px-5 !py-[18px] shadow-sm"
      aria-label={`${item.productName} 추천 상품 자세히 보기`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <Badge
            tone="primary"
            variant="soft"
            className="!rounded-[999px] !px-2 !py-1 text-xs font-semibold text-primary-400"
          >
            {isNewUser ? '시작 추천' : '맞춤 추천'}
          </Badge>
          {!item.isIneligible && !isNewUser ? (
            <span className="text-xs font-medium leading-4 text-gray-500">
              적합도 {item.matchScore}점
            </span>
          ) : null}
        </div>
        <Icons.ArrowRight className="shrink-0 text-gray-500" size={20} />
      </div>

      <div className="mt-4">
        <p className="text-base font-semibold leading-[1.2] text-font-main">{item.productName}</p>
        <p className="mt-2 text-sm font-semibold leading-[1.2] text-primary-500">
          {item.expectedMaxRate}
        </p>
        <p className="mt-3 break-keep text-xs leading-[1.5] text-gray-600">{item.reason}</p>
        <p className="mt-2 break-keep text-xs leading-[1.5] text-primary-400">
          {item.actionable}
        </p>
      </div>

      <Button
        type="button"
        fullWidth
        size="md"
        onClick={(event) => {
          event.stopPropagation()
          onClick()
        }}
        className="mt-4 !h-[44px] !text-sm"
      >
        {item.isAlreadyJoined ? '내 적금 확인하기' : '자세히 보기'}
      </Button>
    </Card>
  )
}

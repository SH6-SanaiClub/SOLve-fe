import { ChevronRight, X } from 'lucide-react'
import { Badge, Card } from '../../../../components/common'
import { ENV_ACTIVITY_ITEMS, type EnvActivityType } from '../envActivityData'
import { EnvBottomSheet } from './EnvBottomSheet'
import { EnvironmentActivityIcon } from './EnvironmentActivityIcon'

interface EnvironmentEntryModalProps {
  open: boolean
  blockedActivityTypes?: EnvActivityType[]
  activityResults?: Partial<Record<EnvActivityType, boolean>>
  onClose: () => void
  onSelect?: (activityType: EnvActivityType) => void
}

export function EnvironmentEntryModal({
  open,
  blockedActivityTypes = [],
  activityResults = {},
  onClose,
  onSelect,
}: EnvironmentEntryModalProps) {
  const handleSelect = (activityType: EnvActivityType) => {
    if (blockedActivityTypes.includes(activityType)) {
      return
    }

    onSelect?.(activityType)
  }

  return (
    <EnvBottomSheet open={open} onClose={onClose}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 pl-1">
          <h2 className="text-lg font-bold text-gray-900">친환경 활동 인증하기</h2>
          <p className="mt-2 text-sm leading-5 font-medium text-gray-500">
            활동을 인증하고 점수와 포인트를 받아보세요
          </p>
        </div>

        <button
          type="button"
          aria-label="친환경 활동 인증하기 닫기"
          className="inline-flex h-10 w-10 -mt-3 shrink-0 items-center justify-center rounded-full text-font-main transition-colors hover:bg-gray-100"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {ENV_ACTIVITY_ITEMS.map((activity) => {
          const isBlocked = blockedActivityTypes.includes(activity.type)
          const isApproved = activityResults[activity.type]

          return (
            <Card
              key={activity.type}
              onClick={isBlocked ? undefined : () => handleSelect(activity.type)}
              className={`!gap-0 !rounded-[8px] !border-transparent !p-4 shadow-card ${
                isBlocked ? '!bg-gray-100 opacity-60' : '!bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <EnvironmentActivityIcon icon={activity.icon} />

                  <div className="min-w-0 flex-1">
                    <p className="text-base font-semibold text-gray-700">{activity.title}</p>
                    <p className="mt-0 text-base font-bold text-primary-400">
                      + {activity.point} P
                    </p>
                    {isBlocked ? (
                      <p className="mt-1 text-xs font-medium text-gray-500">
                        오늘 인증을 완료했습니다.
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="flex shrink-0 items-start gap-2">
                  {isBlocked && isApproved !== undefined ? (
                    <Badge tone={isApproved ? 'primary' : 'danger'} variant="soft">
                      {isApproved ? '성공' : '실패'}
                    </Badge>
                  ) : null}
                  {!isBlocked ? (
                    <ChevronRight className="shrink-0 text-gray-300" size={20} />
                  ) : null}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </EnvBottomSheet>
  )
}

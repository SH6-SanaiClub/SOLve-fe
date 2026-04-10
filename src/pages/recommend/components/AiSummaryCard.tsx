import { CircleCheck } from 'lucide-react'
import { Card } from '../../../components/common'

interface AiSummaryCardProps {
  userName: string
  llmSummary: string | null
}

export const AiSummaryCard = ({ userName, llmSummary }: AiSummaryCardProps) => {
  const normalizedUserName = userName.trim()

  return (
    <Card className="overflow-hidden border border-primary-100 bg-linear-to-br from-white via-primary-50/40 to-white shadow-[0_12px_30px_rgba(0,70,255,0.08)]">
      <p className="text-lg leading-7 font-semibold text-font-main break-keep">
        <span className="text-primary-500">{normalizedUserName}</span>님을 위한 맞춤 활동 추천
      </p>

      {llmSummary ? (
        <div className="flex items-center gap-2.5">
          <CircleCheck size={16} className="shrink-0 text-primary-500" />
          <p className="text-[15px] leading-7 font-medium text-font-main break-keep">
            {llmSummary}
          </p>
        </div>
      ) : (
        <div className="pl-[26px]">
          <div className="mt-1 h-4 w-full rounded bg-gray-100 animate-pulse" />
          <div className="mt-2 h-4 w-4/5 rounded bg-gray-100 animate-pulse" />
        </div>
      )}
    </Card>
  )
}

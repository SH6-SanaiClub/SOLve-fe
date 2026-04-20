import { useState } from 'react'
import { Card, ProgressBar } from '../../../../components/common'
import type { DonationCampaign } from '../../../../types/donation'

interface DonationCampaignCardProps {
  donation: DonationCampaign
  onClick?: () => void
}

const formatCurrency = (amount: number) =>
  `${new Intl.NumberFormat('ko-KR').format(amount)}원`

export const DonationCampaignCard = ({
  donation,
  onClick,
}: DonationCampaignCardProps) => {
  const [hasImageError, setHasImageError] = useState(false)

  return (
    <Card
      className="h-[151px] gap-0 overflow-hidden rounded-control !p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)] max-[380px]:h-auto"
      onClick={onClick}
    >
      <div className="flex h-full items-center gap-4 max-[380px]:items-start max-[380px]:gap-3">
        <div className="h-[119px] w-[119px] shrink-0 overflow-hidden rounded-[4px] bg-white max-[380px]:h-[96px] max-[380px]:w-[96px]">
          {hasImageError ? (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary-200 to-primary-500 px-4 text-center text-xs font-semibold leading-[120%] text-white">
              SOLve
            </div>
          ) : (
            <img
              src={donation.imageUrl}
              alt={donation.name}
              className="h-full w-full object-cover"
              onError={() => setHasImageError(true)}
            />
          )}
        </div>

        <div className="flex h-full min-w-0 flex-1 flex-col justify-center gap-5 max-[380px]:justify-between max-[380px]:gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-xs leading-[120%] font-semibold text-primary-400">
              {donation.organization}
            </p>

            <div className="flex h-[38px] flex-col justify-center gap-[2px] max-[380px]:h-auto max-[380px]:min-h-[38px]">
              <h2 className="text-base leading-[120%] font-bold tracking-[-0.02em] text-font-main max-[380px]:line-clamp-2">
                {donation.name}
              </h2>
              <p className="text-sm leading-[120%] font-medium tracking-[-0.02em] text-gray-500 max-[380px]:line-clamp-2">
                {donation.summary}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-[10px] leading-[120%] font-medium tracking-[-0.03em] text-gray-400 max-[380px]:min-w-0 max-[380px]:pr-2">
                {formatCurrency(donation.currentAmount)} /{' '}
                {formatCurrency(donation.targetAmount)}
              </p>
              <p className="text-[10px] leading-[120%] font-semibold tracking-[-0.01em] text-primary-400 max-[380px]:shrink-0">
                {donation.progressPercentage}%
              </p>
            </div>

            <ProgressBar
              value={donation.progressPercentage}
              className="h-1 rounded-full bg-gray-200"
              barClassName="bg-primary-500"
            />
          </div>
        </div>
      </div>
    </Card>
  )
}

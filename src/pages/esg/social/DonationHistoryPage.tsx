import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../../../components/common'
import MainLayout from '../../../components/layout/MainLayout'
import {
  ROUTE_PATHS,
  getDonationDetailPath,
} from '../../../constants/routePaths'
import { getDonationHistories } from '../../../services/donationService'
import type { DonationHistoryItem } from '../../../types/donation'
import { ShopHeader } from '../../shop/components/ShopHeader'

const amountFormatter = new Intl.NumberFormat('ko-KR')

const formatAmount = (amount: number) => `${amountFormatter.format(amount)}원`

const resolveImageUrl = (imageUrl: string) => {
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

  return `${normalizedBaseUrl}${normalizedImageUrl}`
}

const formatDateGroupLabel = (donatedAt: string) => {
  const date = new Date(donatedAt)

  if (Number.isNaN(date.getTime())) {
    return donatedAt.slice(0, 10).replace(/-/g, '.')
  }

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('.')
}

const formatDateTime = (donatedAt: string) => {
  const date = new Date(donatedAt)

  if (Number.isNaN(date.getTime())) {
    return donatedAt.replace('T', ' ').slice(0, 16)
  }

  const dateLabel = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('.')
  const timeLabel = [
    String(date.getHours()).padStart(2, '0'),
    String(date.getMinutes()).padStart(2, '0'),
  ].join(':')

  return `${dateLabel} ${timeLabel}`
}

export function DonationHistoryPage() {
  const navigate = useNavigate()
  const [donations, setDonations] = useState<DonationHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const fetchDonationHistories = async () => {
      setIsLoading(true)
      setError('')

      try {
        const response = await getDonationHistories()
        if (!isMounted) {
          return
        }

        const sortedDonations = [...response.donations].sort(
          (left, right) =>
            new Date(right.donatedAt).getTime() -
            new Date(left.donatedAt).getTime(),
        )

        setDonations(sortedDonations)
      } catch (fetchError) {
        console.error(fetchError)
        if (!isMounted) {
          return
        }
        setError('기부 후원 내역을 불러오지 못했어요. 잠시 후 다시 시도해주세요.')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void fetchDonationHistories()

    return () => {
      isMounted = false
    }
  }, [])

  const groupedDonations = useMemo(() => {
    const groups = new Map<string, DonationHistoryItem[]>()

    donations.forEach((donation) => {
      const key = formatDateGroupLabel(donation.donatedAt)
      const current = groups.get(key) ?? []
      current.push(donation)
      groups.set(key, current)
    })

    return Array.from(groups.entries()).map(([dateLabel, items]) => ({
      dateLabel,
      items,
    }))
  }, [donations])

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate(ROUTE_PATHS.my)
  }

  return (
    <MainLayout
      header={<ShopHeader title="기부 후원 내역" onBack={handleBack} />}
      className="bg-bg-light"
    >
      <section className="flex flex-col gap-4 pt-2">
        {isLoading ? (
          <div className="flex min-h-[240px] flex-col items-center justify-center gap-4 text-center">
            <div
              className="h-10 w-10 animate-spin rounded-full border-[3px] border-gray-200 border-t-primary-400"
              aria-label="기부 후원 내역 로딩 중"
            />
            <span className="text-sm font-medium text-font-sub">
              기부 후원 내역을 불러오는 중입니다.
            </span>
          </div>
        ) : error ? (
          <Card className="items-center !rounded-control !p-4 text-center">
            <span className="text-sm font-medium text-font-sub">{error}</span>
          </Card>
        ) : groupedDonations.length > 0 ? (
          groupedDonations.map((group) => (
            <section key={group.dateLabel} className="space-y-3">
              <div className="px-1">
                <h2 className="text-[15px] font-semibold text-font-main">
                  {group.dateLabel}
                </h2>
              </div>

              <div className="space-y-3">
                {group.items.map((donation) => (
                  <Card
                    key={donation.donationLogId}
                    className="!gap-0 !overflow-hidden !rounded-control !p-0 cursor-pointer"
                    onClick={() =>
                      navigate(getDonationDetailPath(donation.donationId))
                    }
                  >
                    <div className="space-y-4 px-4 py-4">
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="h-[76px] w-[76px] shrink-0 overflow-hidden rounded-[8px] bg-primary-100">
                          <img
                            src={resolveImageUrl(donation.imageUrl)}
                            alt={donation.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="flex min-h-[76px] min-w-0 flex-col justify-center space-y-1">
                          <p className="text-sm font-medium text-font-sub">
                            {donation.organization}
                          </p>
                          <h3 className="break-keep text-[16px] leading-[140%] font-semibold text-font-main">
                            {donation.name}
                          </h3>
                        </div>
                      </div>

                      <div className="space-y-1.5 rounded-control bg-gray-50 px-4 py-3">
                        <p className="text-sm font-medium text-font-sub">
                          후원일시
                        </p>
                        <p className="text-[15px] leading-[160%] font-normal text-font-main">
                          {formatDateTime(donation.donatedAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 px-4 py-4">
                      <p className="text-[16px] leading-[120%] font-semibold tracking-[-0.02em] text-font-main">
                        결제 금액
                      </p>
                      <span className="text-[18px] leading-[120%] font-bold tracking-[-0.02em] text-font-main">
                        {formatAmount(donation.amount)}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          ))
        ) : (
          <Card className="items-center !rounded-control !p-4 text-center">
            <span className="text-sm font-medium text-font-sub">
              후원한 캠페인이 아직 없습니다.
            </span>
          </Card>
        )}
      </section>
    </MainLayout>
  )
}

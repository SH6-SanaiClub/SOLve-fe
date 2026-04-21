import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  BottomActionBar,
  Card,
  IconButton,
  ProgressBar,
} from '../../../components/common'
import { Icons } from '../../../components/common'
import { ROUTE_PATHS, getDonationPaymentPath } from '../../../constants/routePaths'
import useReturnNavigation from '../../../hooks/useReturnNavigation'
import Header from '../../../components/layout/Header'
import MainLayout from '../../../components/layout/MainLayout'
import { getDonationDetail } from '../../../services/donationService'
import type { DonationDetail } from '../../../types/donation'

type DonationDescriptionBlockObject = {
  type?: string
  value?: string
  url?: string
  imageUrl?: string
}

type ParsedDonationDescriptionBlock =
  | { type: 'image'; value: string }
  | { type: 'text'; value: string }

const formatCurrency = (amount: number) =>
  `${new Intl.NumberFormat('ko-KR').format(amount)}원`
const formatNumber = (value: number) =>
  new Intl.NumberFormat('ko-KR').format(value)

const isDonationEnded = (endDate: string) => {
  const end = new Date(endDate)

  if (Number.isNaN(end.getTime())) {
    return false
  }

  return end.getTime() < Date.now()
}

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

  if (
    normalizedBaseUrl.startsWith('http://') ||
    normalizedBaseUrl.startsWith('https://')
  ) {
    return `${normalizedBaseUrl}${normalizedImageUrl}`
  }

  return normalizedImageUrl
}

const normalizeDonationDescriptionArray = (
  parsed: unknown,
): ParsedDonationDescriptionBlock[] => {
  if (!Array.isArray(parsed)) {
    return []
  }

  return parsed.reduce<ParsedDonationDescriptionBlock[]>((acc, block) => {
    if (!block || typeof block !== 'object') {
      return acc
    }

    const { type, value, url, imageUrl } =
      block as DonationDescriptionBlockObject
    const normalizedType = type?.trim().toLowerCase()
    const normalizedValue = value?.trim()

    if (normalizedType === 'text' && normalizedValue) {
      acc.push({ type: 'text', value: normalizedValue })
      return acc
    }

    if (normalizedType === 'image') {
      const imageValue = imageUrl?.trim() || url?.trim() || normalizedValue

      if (imageValue) {
        acc.push({ type: 'image', value: imageValue })
      }
    }

    return acc
  }, [])
}

const parseDonationDescriptionBlocks = (
  description: string,
): ParsedDonationDescriptionBlock[] => {
  const trimmedDescription = description.replace(/^\uFEFF/, '').trim()

  if (!trimmedDescription) {
    return []
  }

  try {
    const parsed = JSON.parse(trimmedDescription) as unknown
    return normalizeDonationDescriptionArray(parsed)
  } catch {
    const arrayStartIndex = trimmedDescription.indexOf('[')
    const arrayEndIndex = trimmedDescription.lastIndexOf(']')

    if (arrayStartIndex >= 0 && arrayEndIndex > arrayStartIndex) {
      const arrayText = trimmedDescription
        .slice(arrayStartIndex, arrayEndIndex + 1)
        .trim()

      try {
        const parsedArray = JSON.parse(arrayText) as unknown
        return normalizeDonationDescriptionArray(parsedArray)
      } catch {
        return []
      }
    }

    return []
  }
}

const isDonationDescriptionHeading = (value: string) =>
  !value.includes('\n') && value.trim().length <= 30

export function DonationDetailPage() {
  const navigate = useNavigate()
  const { goBack } = useReturnNavigation(ROUTE_PATHS.activitySocialDonation)
  const { donationId } = useParams()
  const parsedDonationId = Number(donationId)
  const [donationDetail, setDonationDetail] = useState<DonationDetail | null>(
    null,
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const requestDonationDetail = useCallback(async () => {
    if (!Number.isInteger(parsedDonationId) || parsedDonationId <= 0) {
      setDonationDetail(null)
      setError('올바른 기부 캠페인 정보가 아니에요.')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await getDonationDetail(parsedDonationId)
      setDonationDetail(response)
    } catch (fetchError) {
      console.error(fetchError)
      setError('기부 상세 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }, [parsedDonationId])

  useEffect(() => {
    void requestDonationDetail()
  }, [requestDonationDetail])

  const hasEnded = donationDetail ? isDonationEnded(donationDetail.endDate) : false
  const descriptionBlocks = donationDetail
    ? parseDonationDescriptionBlocks(donationDetail.description)
    : []

  return (
    <MainLayout
      header={
        <Header
          left={
            <IconButton
              label="뒤로가기"
              icon={<Icons.Back className="text-font-main" />}
              onClick={goBack}
            />
          }
          title="기부"
        />
      }
      className="bg-gray-50"
    >
      {error ? (
        <section className="mx-[-16px] flex min-h-[calc(100vh-var(--header-h)-48px)] items-center bg-gray-50 px-4 pb-6">
          <div className="w-full rounded-card border border-red-100 bg-white px-5 py-6 text-center shadow-card">
            <h2 className="text-lg font-semibold text-font-main">
              서버에 연결할 수 없어요
            </h2>
            <p className="mt-2 text-sm leading-6 text-font-sub">
              {error ||
                '기부 상세 정보를 불러오지 못했습니다. 서버 연결 상태를 확인해주세요.'}
            </p>
          </div>
        </section>
      ) : (
        <>
          <section className="mx-[-16px] min-h-[calc(100vh-var(--header-h)-48px)] bg-gray-50 pb-[120px]">
            {isLoading ? (
              <>
                <div className="relative h-[260px] animate-pulse bg-gray-300">
                  <div className="absolute inset-x-[30px] bottom-[25px]">
                    <div className="h-7 w-3/4 rounded-full bg-gray-800" />
                    <div className="mt-[10px] h-5 w-1/2 rounded-full bg-gray-700" />
                  </div>
                </div>
                <div className="px-4 pt-6">
                  <Card className="gap-0 rounded-control !p-[25px] shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                    <div className="flex flex-col gap-[6px]">
                      <div className="flex flex-col gap-[5px]">
                        <div className="h-4 w-16 animate-pulse rounded-full bg-gray-200" />
                        <div className="flex items-center justify-between">
                          <div className="h-8 w-40 animate-pulse rounded-full bg-primary-100" />
                          <div className="h-8 w-14 animate-pulse rounded-full bg-primary-100" />
                        </div>
                      </div>
                      <div className="h-2 w-full animate-pulse rounded-full bg-gray-200" />
                      <div className="flex items-center justify-between">
                        <div className="h-4 w-24 animate-pulse rounded-full bg-gray-200" />
                        <div className="h-4 w-12 animate-pulse rounded-full bg-gray-200" />
                      </div>
                    </div>
                  </Card>
                </div>
              </>
            ) : donationDetail ? (
              <>
                <section className="relative h-[260px] overflow-hidden bg-black">
                  <img
                    src={resolveImageUrl(donationDetail.imageUrl)}
                    alt={donationDetail.name}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-x-0 bottom-0 h-[120px] bg-linear-to-t from-black to-transparent" />

                  <div className="absolute right-[30px] bottom-[25px] left-[30px] flex flex-col gap-1">
                    <h2 className="text-[20px] leading-[1.2] font-bold text-white">
                      {donationDetail.name}
                    </h2>
                    <p className="text-base leading-[1.2] font-light text-gray-300">
                      {donationDetail.summary}
                    </p>
                  </div>
                </section>

                <section className="px-4 pt-6">
                  <Card className="gap-0 rounded-control !p-[25px] shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                    <div className="flex flex-col gap-[6px]">
                      <div className="flex flex-col gap-[5px]">
                        <p className="text-xs leading-[120%] tracking-[-0.03em] text-gray-700">
                          현재 모금액
                        </p>

                        <div className="flex items-center justify-between">
                          <p className="text-left">
                            <span className="text-[20px] font-bold tracking-[-0.02em] text-primary-500">
                              {new Intl.NumberFormat('ko-KR').format(
                                donationDetail.currentAmount,
                              )}
                            </span>
                            <span className="ml-1 text-xs font-semibold tracking-[-0.02em] text-gray-700">
                              원
                            </span>
                          </p>
                          <p className="text-[20px] font-bold tracking-[-0.02em] text-primary-500">
                            {donationDetail.progressPercentage}%
                          </p>
                        </div>
                      </div>

                      <ProgressBar
                        value={donationDetail.progressPercentage}
                        className="h-2 rounded-full bg-gray-200"
                        barClassName="bg-primary-500"
                      />

                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-xs leading-[120%] font-semibold tracking-[-0.03em] text-gray-600">
                          목표 {formatCurrency(donationDetail.targetAmount)}
                        </p>
                        <p className="text-xs leading-[120%] font-semibold tracking-[-0.03em] text-gray-600">
                          D - {donationDetail.remainingDays}
                        </p>
                      </div>
                    </div>
                  </Card>
                </section>

                <section className="px-[24px] pt-6">
                  <div className="flex flex-col gap-[11px]">
                    {descriptionBlocks.length > 0 ? (
                      descriptionBlocks.map((block, index) => {
                        if (block.type === 'image') {
                          return (
                            <img
                              key={`donation-description-image-${index}`}
                              src={resolveImageUrl(block.value)}
                              alt={`${donationDetail.name} 상세 이미지 ${index + 1}`}
                              className="my-3 w-full object-cover"
                            />
                          )
                        }

                        return (
                          <p
                            key={`donation-description-text-${index}`}
                            className={
                              isDonationDescriptionHeading(block.value)
                                ? 'whitespace-pre-line text-[18px] leading-[28px] font-semibold text-gray-600'
                                : 'whitespace-pre-line text-base leading-[26px] font-normal text-gray-500'
                            }
                          >
                            {block.value}
                          </p>
                        )
                      })
                    ) : (
                      <p className="whitespace-pre-line text-base leading-[26px] font-normal text-gray-500">
                        {donationDetail.description}
                      </p>
                    )}
                    <p className="text-base leading-[26px] font-normal text-gray-400">
                      해당 캠페인은 {donationDetail.organization}과 함께합니다.
                    </p>
                  </div>
                </section>
              </>
            ) : null}
          </section>

          <BottomActionBar
            leftText={
              isLoading ? (
                '불러오는 중...'
              ) : donationDetail ? (
                <>
                  <span className=" text-primary-400">
                    {formatNumber(donationDetail.participantCount)}
                  </span>
                  <span>명 참여</span>
                </>
              ) : (
                '참여 정보 없음'
              )
            }
            buttonLabel={hasEnded ? '종료된 캠페인입니다' : '후원하기'}
            buttonVariant={hasEnded ? 'gray' : 'primary'}
            buttonDisabled={hasEnded}
            onButtonClick={
              donationDetail && !hasEnded
                ? () =>
                    navigate(getDonationPaymentPath(donationDetail.donationId))
                : undefined
            }
          />
        </>
      )}
    </MainLayout>
  )
}

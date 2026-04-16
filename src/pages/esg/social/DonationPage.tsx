import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, IconButton } from '../../../components/common'
import { Icons } from '../../../components/common'
import BottomNavigation from '../../../components/layout/BottomNavigation'
import Header from '../../../components/layout/Header'
import MainLayout from '../../../components/layout/MainLayout'
import characterFriendsImage from '../../../assets/character_friends.png'
import {
  getDonationDetailPath,
  ROUTE_PATHS,
} from '../../../constants/routePaths'
import useReturnNavigation from '../../../hooks/useReturnNavigation'
import { DonationCampaignCard } from './components/DonationCampaignCard'
import { DonationSummaryBanner } from './components/DonationSummaryBanner'
import { SocialActivityTabs } from './components/SocialActivityTabs'
import { getDonationCampaigns } from '../../../services/donationService'
import type { DonationListResponse } from '../../../types/donation'

const formatCurrency = (amount: number) =>
  `${new Intl.NumberFormat('ko-KR').format(amount)}원`

const formatNumber = (value: number) =>
  new Intl.NumberFormat('ko-KR').format(value)

export function DonationPage() {
  const navigate = useNavigate()
  const { goBack } = useReturnNavigation(ROUTE_PATHS.home)
  const [donationData, setDonationData] = useState<DonationListResponse | null>(
    null,
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchDonationCampaigns = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await getDonationCampaigns()
      setDonationData(response)
    } catch (fetchError) {
      console.error(fetchError)
      setError(
        '기부 캠페인 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchDonationCampaigns()
  }, [])

  const handleBottomNavigation = (key: string) => {
    if (key === 'home') {
      navigate(ROUTE_PATHS.home)
      return
    }

    if (key === 'benefits') {
      navigate(ROUTE_PATHS.shop)
      return
    }

    if (key === 'finance') {
      navigate(ROUTE_PATHS.finance)
      return
    }

    if (key === 'mypage') {
      navigate(ROUTE_PATHS.my)
    }
  }

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
          title="S 활동"
        />
      }
      nav={<BottomNavigation value="home" onChange={handleBottomNavigation} />}
      subHeader={<SocialActivityTabs activeTab="donation" />}
      contentSpacing="comfortable"
    >
      {isLoading ? (
        <div className="flex flex-col gap-6">
          <section className="space-y-6 pt-2">
            <div className="h-28 animate-pulse rounded-control bg-primary-300" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-5 w-28 animate-pulse rounded-full bg-gray-300" />
                <div className="h-4 w-10 animate-pulse rounded-full bg-primary-100" />
              </div>

              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex h-[151px] gap-4 rounded-control bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
                  >
                    <div className="h-[119px] w-[119px] shrink-0 animate-pulse rounded-[4px] bg-gray-200" />
                    <div className="flex-1 space-y-3 pt-1">
                      <div className="h-3 w-20 animate-pulse rounded-full bg-primary-100" />
                      <div className="h-5 w-4/5 animate-pulse rounded-full bg-gray-300" />
                      <div className="h-4 w-full animate-pulse rounded-full bg-gray-200" />
                      <div className="mt-8 h-3 w-4/5 animate-pulse rounded-full bg-gray-200" />
                      <div className="h-1 w-full animate-pulse rounded-full bg-gray-200" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      ) : null}

      {!isLoading && error ? (
        <section className="pt-2">
          <div className="rounded-card border border-red-100 bg-red-50 px-5 py-6 text-center shadow-card">
            <h2 className="text-lg font-semibold text-font-main">
              기부 캠페인을 불러오지 못했어요
            </h2>
            <p className="mt-2 text-sm leading-6 text-font-sub">{error}</p>
            <Button
              className="mt-5"
              onClick={() => void fetchDonationCampaigns()}
            >
              다시 시도
            </Button>
          </div>
        </section>
      ) : null}

      {!isLoading && !error && donationData ? (
        <div className="flex flex-col gap-6 pt-2">
          <DonationSummaryBanner
            totalDonationAmountLabel={formatCurrency(
              donationData.summary.totalDonationAmount,
            )}
            totalParticipantCountLabel={formatNumber(
              donationData.summary.totalParticipantCount,
            )}
            imageSrc={characterFriendsImage}
            imageAlt="SOLve 기부 배너 캐릭터"
          />

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg leading-[120%] font-semibold text-font-main">
                진행중인 캠페인
              </h2>
              <span className="text-sm leading-[120%] font-medium text-primary-400">
                {donationData.summary.donationCount}건
              </span>
            </div>

            {donationData.donations.length === 0 ? (
              <Card className="border-dashed bg-gray-50 px-5 py-10 text-center shadow-none">
                <p className="text-lg font-semibold text-font-main">
                  진행 중인 기부 캠페인이 없어요
                </p>
                <p className="mt-2 text-sm leading-6 text-font-sub">
                  새로운 가치 캠페인이 열리면 이곳에서 바로 확인할 수 있어요.
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {donationData.donations.map((donation) => (
                  <DonationCampaignCard
                    key={donation.donationId}
                    donation={donation}
                    onClick={() =>
                      navigate(getDonationDetailPath(donation.donationId))
                    }
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      ) : null}
    </MainLayout>
  )
}

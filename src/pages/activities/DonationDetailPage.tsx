import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BottomActionBar, IconButton } from '../../components/common'
import { Icons } from '../../components/common'
import Header from '../../components/layout/Header'
import MainLayout from '../../components/layout/MainLayout'
import { getDonationDetail } from '../../services/donationService'
import type { DonationDetail } from '../../types/donation'

const formatNumber = (value: number) => new Intl.NumberFormat('ko-KR').format(value)

export function DonationDetailPage() {
  const navigate = useNavigate()
  const { donationId } = useParams()
  const parsedDonationId = Number(donationId)
  const [donationDetail, setDonationDetail] = useState<DonationDetail | null>(null)
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

  return (
    <MainLayout
      header={
        <Header
          left={
            <IconButton
              label="뒤로가기"
              icon={<Icons.Back className="text-font-main" />}
              onClick={() => navigate(-1)}
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
            <h2 className="text-lg font-semibold text-font-main">서버에 연결할 수 없어요</h2>
            <p className="mt-2 text-sm leading-6 text-font-sub">
              {error || '기부 상세 정보를 불러오지 못했습니다. 서버 연결 상태를 확인해주세요.'}
            </p>
          </div>
        </section>
      ) : (
        <>
          <section className="mx-[-16px] min-h-[calc(100vh-var(--header-h)-48px)] bg-gray-50 pb-[120px]" />

          <BottomActionBar
            leftText={
              isLoading
                ? '불러오는 중...'
                : donationDetail
                  ? `${formatNumber(donationDetail.participantCount)}명 참여`
                  : '참여 정보 없음'
            }
            buttonLabel="후원하기"
          />
        </>
      )}
    </MainLayout>
  )
}

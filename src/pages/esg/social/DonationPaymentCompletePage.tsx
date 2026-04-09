import { useLocation, useNavigate } from 'react-router-dom'
import { Button, IconButton } from '../../../components/common'
import { Icons } from '../../../components/common'
import Header from '../../../components/layout/Header'
import MainLayout from '../../../components/layout/MainLayout'
import { ROUTE_PATHS } from '../../../constants/routePaths'
import type { VerifyDonationPaymentResponse } from '../../../types/payment'

interface DonationPaymentCompleteLocationState {
  paymentResult?: VerifyDonationPaymentResponse
}

const formatCurrency = (amount: number) =>
  `${new Intl.NumberFormat('ko-KR').format(amount)}원`

const formatPoint = (amount: number) =>
  `${new Intl.NumberFormat('ko-KR').format(amount)}P`

export function DonationPaymentCompletePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as DonationPaymentCompleteLocationState | undefined
  const paymentResult = state?.paymentResult

  const handleBack = () => {
    navigate(ROUTE_PATHS.activitySocialDonation, { replace: true })
  }

  return (
    <MainLayout
      header={
        <Header
          left={
            <IconButton
              label="뒤로가기"
              icon={<Icons.Back className="text-font-main" />}
              onClick={handleBack}
            />
          }
          title="기부 완료"
        />
      }
      className="bg-gray-50"
    >
      <section className="mx-[-16px] min-h-[calc(100vh-var(--header-h)-48px)] bg-gray-50 px-6 py-8">
        {paymentResult ? (
          <div className="space-y-5 rounded-card bg-white p-6 shadow-card">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-font-main">
                기부 결제가 완료되었어요
              </h2>
              <p className="text-sm leading-6 text-font-sub">
                결제 완료 정보를 바로 확인할 수 있도록 먼저 표시합니다.
              </p>
            </div>

            <div className="space-y-3 text-sm text-font-main">
              <div>
                <p className="text-gray-500">후원 캠페인</p>
                <p className="mt-1 font-semibold">{paymentResult.donationName}</p>
              </div>
              <div>
                <p className="text-gray-500">후원 금액</p>
                <p className="mt-1 font-semibold">{formatCurrency(paymentResult.amount)}</p>
              </div>
              <div>
                <p className="text-gray-500">이번 결제로 적립된 포인트</p>
                <p className="mt-1 font-semibold">{formatPoint(paymentResult.awardedPoint)}</p>
              </div>
              <div>
                <p className="text-gray-500">현재 보유 포인트</p>
                <p className="mt-1 font-semibold">{formatPoint(paymentResult.currentPoint)}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-card bg-white p-6 text-center shadow-card">
            <h2 className="text-lg font-semibold text-font-main">
              결제 완료 정보를 찾을 수 없어요
            </h2>
            <p className="mt-2 text-sm leading-6 text-font-sub">
              직접 진입한 경우일 수 있어요. 기부 목록으로 이동해 다시 시도해주세요.
            </p>
            <div className="mt-5">
              <Button onClick={() => navigate(ROUTE_PATHS.activitySocialDonation)}>
                기부 목록으로 이동
              </Button>
            </div>
          </div>
        )}

      </section>
    </MainLayout>
  )
}

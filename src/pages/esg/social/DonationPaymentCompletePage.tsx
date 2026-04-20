import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../../../components/common'
import MainLayout from '../../../components/layout/MainLayout'
import completeCharacterImage from '../../../assets/good.png'
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

  return (
    <MainLayout className="bg-gray-50">
      <section className="-mx-(--side-padding) my-[-24px] flex min-h-[calc(100dvh-var(--header-h)-env(safe-area-inset-top)-96px)] flex-col justify-center bg-gray-50 px-[20px] pt-[40px] pb-[120px]">
        {paymentResult ? (
          <div className="mx-auto flex w-full flex-col items-center text-center">
            <div className="flex flex-col items-center text-center">
              <img
                src={completeCharacterImage}
                alt=""
                className="h-[104px] w-[95px] object-cover"
              />
              <div className="mt-[11px] flex w-full flex-col items-center gap-2">
                <h1 className="text-[20px] leading-[30px] font-bold tracking-[-0.02em] text-font-main">
                  기부가 완료되었습니다!
                </h1>
                <p className="text-center text-[12px] leading-6 font-medium tracking-[-0.02em] text-font-sub">
                  따뜻한 마음을 나누어 주셔서 감사합니다.
                </p>
              </div>
            </div>

            <div className="mt-[23px] flex w-full flex-col">
              <div className="w-full rounded-[8px] bg-white px-[15px] pt-[19px] pb-[18px] shadow-card">
                <div className="text-left text-[12px] leading-6 font-bold tracking-[-0.02em] text-font-sub">
                  기부내역 상세
                </div>

                <div className="mt-4 flex flex-col gap-[14px]">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[12px] leading-6 font-medium tracking-[-0.02em] text-font-sub">
                      캠페인 명
                    </span>
                    <span className="text-right text-[14px] leading-6 font-semibold tracking-[-0.02em] text-gray-500">
                      {paymentResult.donationName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[12px] leading-6 font-medium tracking-[-0.02em] text-font-sub">
                      기부 금액
                    </span>
                    <span className="text-right text-[14px] leading-6 font-semibold tracking-[-0.02em] text-gray-500">
                      {formatCurrency(paymentResult.amount)}
                    </span>
                  </div>

                  <div className="border-t border-gray-200" />

                  <div className="flex flex-col gap-[11px]">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[12px] leading-6 font-medium tracking-[-0.02em] text-font-sub">
                        획득 ESG 포인트
                      </span>
                      <span className="text-right text-[16px] leading-6 font-semibold tracking-[-0.02em] text-primary-500">
                        + {formatPoint(paymentResult.awardedPoint)}
                      </span>
                    </div>

                    <p className="text-right text-[12px] leading-6 font-normal tracking-[-0.02em] text-gray-400">
                      현재 보유 포인트 {formatPoint(paymentResult.currentPoint)}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="mx-auto flex w-full flex-col items-center justify-center text-center">
            <div className="w-full rounded-[8px] bg-white p-6 shadow-card">
              <h2 className="text-[20px] leading-[30px] font-bold tracking-[-0.02em] text-font-main">
                결제 완료 정보를 찾을 수 없어요
              </h2>
              <p className="mt-2 text-[12px] leading-6 font-medium tracking-[-0.02em] text-font-sub">
                직접 진입한 경우일 수 있어요. 기부 목록으로 이동해 다시 시도해주세요.
              </p>
              <div className="mt-6">
                <Button fullWidth onClick={() => navigate(ROUTE_PATHS.activitySocialDonation)}>
                  기부 목록으로 이동
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50">
        <div className="pointer-events-auto mx-auto grid w-full max-w-[600px] grid-cols-2 gap-3 px-(--side-padding) pt-4 pb-[calc(16px+env(safe-area-inset-bottom))]">
          <Button
            fullWidth
            size="md"
            variant="sub"
            onClick={() => navigate(ROUTE_PATHS.activitySocialDonationHistory)}
          >
            후원 내역보기
          </Button>
          <Button
            fullWidth
            size="md"
            onClick={() => navigate(ROUTE_PATHS.home, { replace: true })}
          >
            메인으로 가기
          </Button>
        </div>
      </div>
    </MainLayout>
  )
}

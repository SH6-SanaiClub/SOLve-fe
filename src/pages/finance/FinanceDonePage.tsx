import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../../components/common'
import MainLayout from '../../components/layout/MainLayout'
import { getS3AssetUrl } from '../../constants/assetUrls'
import { ROUTE_PATHS } from '../../constants/routePaths'
import type { FinanceDoneState } from '../../types/finance'
import { PageScaffold } from '../PageScaffold'

const financeCompletionMascot = getS3AssetUrl('sprout.webp')

export const FinanceDonePage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const doneState = location.state as FinanceDoneState | undefined

  if (!doneState) {
    return (
      <PageScaffold
        title="완료 정보를 불러올 수 없어요"
        description="금융 상품 상세에서 다시 진행해 주세요."
      />
    )
  }

  const isRateField = (label: string) => label.includes('금리')

  return (
    <div className="min-h-screen bg-white font-pretendard">
      <MainLayout className="bg-gray-50">
        <section className="-mx-(--side-padding) my-[-24px] flex min-h-[calc(100dvh-var(--header-h)-env(safe-area-inset-top)-96px)] flex-col justify-center bg-gray-50 px-[20px] pt-[40px] pb-[120px]">
          <div className="mx-auto flex w-full flex-col items-center text-center">
            <div className="flex flex-col items-center text-center">
              <img
                src={financeCompletionMascot}
                alt="완료 캐릭터"
                className="h-[118px] w-[118px] object-contain"
              />

              <h2 className="mt-[11px] text-center text-[20px] leading-[30px] font-bold tracking-[-0.02em] text-font-main">
                {doneState.title}
              </h2>
              <p className="mt-2 text-center text-[12px] leading-6 font-medium tracking-[-0.02em] text-font-sub whitespace-pre-line">
                {doneState.description}
              </p>
            </div>

            <div className="mt-[23px] flex w-full flex-col">
              <div className="w-full rounded-[8px] bg-white px-[15px] pt-[19px] pb-[18px] shadow-card">
                <div className="text-left text-[12px] leading-6 font-bold tracking-[-0.02em] text-font-sub">
                  완료내역 상세
                </div>

                <div className="mt-4 flex flex-col gap-[14px]">
                  {doneState.fields.map((field) => (
                    <div key={field.label}>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-left text-[12px] leading-6 font-medium tracking-[-0.02em] text-font-sub">
                          {field.label}
                        </span>
                        <span
                          className={`text-right text-[14px] leading-6 font-semibold tracking-[-0.02em] ${
                            isRateField(field.label)
                              ? 'text-primary-500'
                              : 'text-gray-500'
                          }`}
                        >
                          {field.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50">
          <div className="pointer-events-auto mx-auto grid w-full max-w-[600px] grid-cols-2 gap-3 px-(--side-padding) pt-4 pb-[calc(16px+env(safe-area-inset-bottom))]">
            <Button
              variant="sub"
              fullWidth
              size="md"
              onClick={() =>
                navigate(doneState.primaryActionPath ?? ROUTE_PATHS.myFinance)
              }
            >
              {doneState.primaryActionLabel}
            </Button>
            <Button
              fullWidth
              size="md"
              onClick={() => navigate(ROUTE_PATHS.home)}
            >
              {doneState.secondaryActionLabel}
            </Button>
          </div>
        </div>
      </MainLayout>
    </div>
  )
}

import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Card, InfoRow } from '../../components/common'
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
    <div className="min-h-screen bg-bg-light font-pretendard">
      <MainLayout className="bg-bg-light">
        <div className="flex min-h-[calc(100vh-48px)] flex-col px-5 pb-32 pt-6">
          <div className="flex flex-1 flex-col justify-center">
            <div className="flex flex-col items-center">
              <img
                src={financeCompletionMascot}
                alt="완료 캐릭터"
                className="h-[118px] w-[118px] object-contain"
              />

              <h2 className="mt-3 text-center text-[26px] font-semibold leading-[1.3] text-font-main">
                {doneState.title}
              </h2>
              <p className="mt-3 text-center text-[15px] leading-[1.8] text-font-sub whitespace-pre-line">
                {doneState.description}
              </p>
            </div>

            <Card className="mt-8 w-full !rounded-control !px-5 !py-5 shadow-sm">
              {doneState.fields.map((field, index) => (
                <div key={field.label}>
                  <InfoRow
                    label={field.label}
                    value={field.value}
                    className="items-center py-[14px]"
                    valueClassName={
                      isRateField(field.label)
                        ? 'text-[14px] font-bold leading-5 text-primary-500'
                        : 'text-[14px] font-semibold leading-5 text-font-main'
                    }
                  />
                  {index < doneState.fields.length - 1 ? <div className="h-px bg-gray-200" /> : null}
                </div>
              ))}
            </Card>
          </div>

          <div className="fixed bottom-0 left-1/2 z-10 flex w-full max-w-[600px] -translate-x-1/2 gap-3 px-5 pb-[calc(16px+env(safe-area-inset-bottom))] pt-4">
            <Button
              variant="sub"
              fullWidth
              size="md"
              className="!h-[56px] !rounded-control"
              onClick={() => navigate(doneState.primaryActionPath ?? ROUTE_PATHS.myFinance)}
            >
              {doneState.primaryActionLabel}
            </Button>
            <Button
              fullWidth
              size="md"
              className="!h-[56px] !rounded-control"
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


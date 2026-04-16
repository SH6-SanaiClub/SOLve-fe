import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Card, InfoRow } from '../../components/common'
import MainLayout from '../../components/layout/MainLayout'
import { ROUTE_PATHS } from '../../constants/routePaths'
import type { FinanceDoneState } from '../../types/finance'
import { PageScaffold } from '../PageScaffold'
import financeCompletionMascot from '../../assets/finance/finance-completion-mascot.png'

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
        <div className="-mx-2 flex flex-col items-center bg-bg-light px-5 pb-12 pt-12">
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

          <Card className="mt-8 w-full !gap-[14px] !rounded-control !px-5 !py-5 shadow-sm">
            {doneState.fields.map((field, index) => (
              <div key={field.label} className="flex flex-col gap-[14px]">
                <InfoRow
                  label={field.label}
                  value={field.value}
                  className="items-center"
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

          <div className="mt-10 flex w-full gap-3">
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


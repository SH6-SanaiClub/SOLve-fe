import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, InfoRow } from '../../components/common'
import MainLayout from '../../components/layout/MainLayout'
import { ROUTE_PATHS } from '../../constants/routePaths'
import { applyFinanceLoan, getFinanceLoanPreview } from '../../services/financeService'
import type { FinanceDoneState, FinanceLoanPreview } from '../../types/finance'
import { PageScaffold } from '../PageScaffold'
import { ShopHeader } from '../shop/components/ShopHeader'
import {
  FINANCE_NOTICE_LINES,
  LOAN_PREVIEW_REASON_LABEL,
  buildLoanDoneState,
  formatCurrency,
  formatRate,
} from './financeUi'

export const FinanceApplyPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [preview, setPreview] = useState<FinanceLoanPreview | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const fetchLoanPreview = async () => {
      if (!id) {
        setErrorMessage('신청할 금융 상품이 없어요.')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setErrorMessage('')
        const response = await getFinanceLoanPreview(id)
        setPreview(response)
      } catch {
        setErrorMessage('대출 신청 정보를 불러오지 못했어요.')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchLoanPreview()
  }, [id])

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate(ROUTE_PATHS.finance)
  }

  const handleApply = async () => {
    if (!preview || preview.loanLimit == null) {
      setErrorMessage('신청 가능한 대출 한도가 없어요.')
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMessage('')

      const amount = preview.loanLimit
      await applyFinanceLoan({ loanId: preview.productId, amount })

      const doneState: FinanceDoneState = buildLoanDoneState(preview, amount)
      navigate(ROUTE_PATHS.financeDone, { state: doneState })
    } catch {
      setErrorMessage('대출 신청에 실패했어요. 잠시 후 다시 시도해 주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <PageScaffold
        title="대출 신청 정보를 불러오는 중이에요"
        description="잠시만 기다려 주세요."
      />
    )
  }

  if (!preview) {
    return <PageScaffold title="신청할 금융 상품이 없어요" description={errorMessage} />
  }

  if (!preview.available) {
    return (
      <PageScaffold
        title="대출 신청이 어려워요"
        description={LOAN_PREVIEW_REASON_LABEL[preview.reason]}
      />
    )
  }

  const applyFields = [
    { label: '대출 한도', value: formatCurrency(preview.loanLimit) },
    { label: '대출 기간', value: `${preview.durationMonths}개월` },
    { label: '대출 금리', value: formatRate(preview.appliedRate) },
  ]

  return (
    <div className="relative min-h-screen bg-bg-light font-pretendard">
      <MainLayout
        header={<ShopHeader title="대출 신청" onBack={handleBack} />}
        className="bg-bg-light"
      >
        <div className="-mx-2 flex flex-col gap-8 bg-bg-light px-5 pb-[118px] pt-5">
          <section className="px-[1px] pt-1 text-center">
            <h2 className="text-[22px] font-semibold leading-[1.25] text-font-main">
              {preview.name} 신청
            </h2>
          </section>

          <div className="flex flex-col gap-[14px] px-[10px]">
            {applyFields.map((field, index) => (
              <div key={field.label} className="flex flex-col gap-[14px]">
                <InfoRow
                  label={field.label}
                  value={field.value}
                  className="items-center"
                  valueClassName="text-[14px] font-semibold leading-5 text-font-main"
                />
                {index < applyFields.length - 1 ? <div className="h-px bg-gray-200" /> : null}
              </div>
            ))}
          </div>

          <div className="px-[3px]">
            <h3 className="text-[12px] font-semibold leading-[1.2] text-gray-500">알아두세요</h3>
            <div className="mt-[8px] flex flex-col gap-0 text-[12px] leading-[22.75px] text-gray-500">
              {FINANCE_NOTICE_LINES.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>

          <Card className="!gap-2 !rounded-control !border-0 !bg-gray-100 !px-[23px] !py-[18px] shadow-sm">
            <h3 className="text-[16px] font-semibold leading-[1.2] text-gray-600">신청 전 확인</h3>
            <p className="text-[12px] leading-[22.75px] text-gray-600">
              신청 시 현재 적용 가능 한도 전체를 기준으로 접수되며, 실제 실행 금액과 상태는 심사 결과에 따라 달라질 수 있습니다.
            </p>
          </Card>

          {errorMessage ? (
            <Card className="!rounded-control !border-0 !px-5 !py-4 shadow-sm">
              <p className="text-sm text-red-500">{errorMessage}</p>
            </Card>
          ) : null}
        </div>
      </MainLayout>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50">
        <div className="pointer-events-auto mx-auto w-full max-w-[600px] border-t border-gray-200 bg-white px-(--side-padding) pb-[calc(16px+env(safe-area-inset-bottom))] pt-4 shadow-[var(--shadow-card)]">
          <Button
            type="button"
            fullWidth
            size="md"
            onClick={handleApply}
            className="!h-[56px]"
            disabled={isSubmitting}
          >
            {isSubmitting ? '대출 신청 중...' : '대출 신청'}
          </Button>
        </div>
      </div>
    </div>
  )
}


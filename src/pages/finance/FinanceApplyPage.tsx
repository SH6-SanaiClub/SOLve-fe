import { useEffect, useState } from 'react'
import { CircleAlert, LoaderCircle } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, InfoRow } from '../../components/common'
import MainLayout from '../../components/layout/MainLayout'
import { ROUTE_PATHS } from '../../constants/routePaths'
import { applyFinanceLoan, getFinanceLoanPreview } from '../../services/financeService'
import type { FinanceDoneState, FinanceLoanPreview } from '../../types/finance'
import { PageScaffold } from '../PageScaffold'
import { ShopHeader } from '../shop/components/ShopHeader'
import {
  LOAN_NOTICE_LINES,
  buildLoanDoneState,
  formatCurrency,
  formatRate,
} from './financeUi'

const LOAN_REJECTION_MESSAGE = '자세한 사항은 관리자에게 문의해주세요.'

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

  const isUnavailablePreview = Boolean(preview && !preview.available)

  useEffect(() => {
    if (!isUnavailablePreview) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isUnavailablePreview])

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate(ROUTE_PATHS.finance)
  }

  const handleUnavailableClose = () => {
    handleBack()
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
      <div className="relative min-h-screen bg-bg-light font-pretendard">
        <div className="fixed inset-y-0 left-1/2 z-[110] flex w-full max-w-[600px] -translate-x-1/2 items-center justify-center px-6 py-8">
          <section className="flex w-full max-w-[320px] flex-col items-center rounded-[12px] bg-white px-6 py-7 text-center shadow-[0_20px_48px_rgba(15,23,42,0.14)]">
            <LoaderCircle className="animate-spin text-primary-500" size={28} />
            <h2 className="mt-5 text-[18px] font-semibold leading-[1.35] text-gray-700">
              한도를 확인하고 있어요
            </h2>
            <p className="mt-2 text-sm leading-[1.7] text-gray-500">
              잠시만 기다려 주세요.
            </p>
          </section>
        </div>
      </div>
    )
  }

  if (!preview) {
    return <PageScaffold title="신청할 금융 상품이 없어요" description={errorMessage} />
  }

  if (!preview.available) {
    return (
      <div className="relative min-h-screen bg-bg-light font-pretendard">
        <div className="fixed inset-y-0 left-1/2 z-[110] flex w-full max-w-[600px] -translate-x-1/2 items-center justify-center px-6 py-8">
          <button
            type="button"
            aria-label="대출 심사 결과 닫기"
            className="absolute inset-0 bg-[rgba(2,6,23,0.22)]"
            onClick={handleUnavailableClose}
          />

          <section className="relative flex w-full max-w-[360px] flex-col rounded-[12px] bg-white px-5 pb-5 pt-6 shadow-[0_20px_48px_rgba(15,23,42,0.14)]">
            <div className="flex flex-1 flex-col items-center px-3 pt-2 text-center">
              <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-[#FFE1E1]">
                <CircleAlert size={28} strokeWidth={2.5} className="text-[#D92D20]" />
              </div>

              <div className="mt-8 flex flex-col items-center">
                <h2 className="text-[20px] leading-[1.35] font-bold tracking-[-0.02em] text-gray-700">
                  대출 신청이 어려워요
                </h2>
                <p className="mt-3 break-keep text-sm leading-[1.7] font-medium text-gray-500">
                  {LOAN_REJECTION_MESSAGE}
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="primary"
              size="lg"
              fullWidth
              className="!mt-8 !h-[48px] text-[16px] font-semibold"
              onClick={handleUnavailableClose}
            >
              확인
            </Button>
          </section>
        </div>
      </div>
    )
  }
  const applyFields = preview.available
    ? [
        { label: '대출 한도', value: formatCurrency(preview.loanLimit) },
        { label: '대출 기간', value: `${preview.durationMonths}개월` },
        { label: '대출 금리', value: formatRate(preview.appliedRate) },
      ]
    : []

  return (
    <div className="relative min-h-screen bg-bg-light font-pretendard">
      <MainLayout
        header={<ShopHeader title="대출 신청" onBack={handleBack} />}
        className="bg-bg-light"
      >
        <div className="-mx-2 flex flex-col gap-8 bg-bg-light px-5 pb-[118px] pt-5">
          <section className="px-[1px] pt-1 text-center">
            <h2 className="text-[22px] font-semibold leading-[1.25] text-font-main">
              {preview.available ? `${preview.name} 신청` : `${preview.name} 한도 조회`}
            </h2>
            {!preview.available ? (
              <p className="mt-3 text-sm leading-[1.6] text-gray-500">
                심사 결과를 확인해 주세요.
              </p>
            ) : null}
          </section>

          {preview.available ? (
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
          ) : (
            <Card className="!rounded-control !border-0 !bg-gray-100 !px-[23px] !py-[18px] shadow-sm">
              <p className="text-[14px] leading-[1.7] text-gray-600">
                기본 심사 결과에 따라 대출 가능 여부와 조건이 결정됩니다.
              </p>
            </Card>
          )}

          <div className="px-[3px]">
            <h3 className="text-[12px] font-semibold leading-[1.2] text-gray-500">알아두세요</h3>
            <div className="mt-[8px] flex flex-col gap-0 text-[12px] leading-[22.75px] text-gray-500">
              {LOAN_NOTICE_LINES.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>

          {preview.available ? (
            <Card className="!gap-2 !rounded-control !border-0 !bg-gray-100 !px-[23px] !py-[18px] shadow-sm">
              <h3 className="text-[16px] font-semibold leading-[1.2] text-gray-600">신청 전 확인</h3>
              <p className="text-[12px] leading-[22.75px] text-gray-600">
                신청 시 현재 적용 가능 한도 전체를 기준으로 접수되며, 실제 실행 금액과 상태는 심사 결과에 따라 달라질 수 있습니다.
              </p>
            </Card>
          ) : null}

          {errorMessage ? (
            <Card className="!rounded-control !border-0 !px-5 !py-4 shadow-sm">
              <p className="text-sm text-red-500">{errorMessage}</p>
            </Card>
          ) : null}
        </div>
      </MainLayout>

      {preview.available ? (
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
      ) : null}

    </div>
  )
}

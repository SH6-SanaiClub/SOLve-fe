import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Button, Card, InfoRow } from '../../components/common'
import MainLayout from '../../components/layout/MainLayout'
import { ROUTE_PATHS, getFinanceApplyPath } from '../../constants/routePaths'
import {
  applyFinanceSavings,
  getFinanceLoanPreview,
  getFinanceProducts,
} from '../../services/financeService'
import type {
  FinanceDoneState,
  FinanceListProduct,
  FinanceLoanPreview,
  FinanceProductType,
} from '../../types/finance'
import { PageScaffold } from '../PageScaffold'
import { ShopHeader } from '../shop/components/ShopHeader'
import financeMascotImageSrc from '../../assets/finance/finance-mascot.png'
import {
  FINANCE_NOTICE_LINES,
  LOAN_PREVIEW_REASON_LABEL,
  buildLoanDetailFields,
  buildSavingsDetailFields,
  buildSavingsDoneState,
  buildSavingsRateSummary,
  formatRate,
  getFinanceUnavailableReasonLabel,
} from './financeUi'

interface FinanceDetailLocationState {
  productType?: FinanceProductType
}

const LEGACY_SAVINGS_SLUG_TO_NAME: Record<string, string> = {
  'green-step-up-savings': '그린 스텝업 적금',
  'earth-guardian-savings': '지구 수호대 적금',
  'warm-companion-savings': '따뜻한 동행 적금',
  'smart-finance-savings': '바른 금융 스마트 적금',
  'esg-master-savings': 'ESG 마스터 적금',
}

const renderNoticeBlock = (noticeLines: string[]) => (
  <div className="px-[3px]">
    <h3 className="text-[12px] font-semibold leading-[1.2] text-gray-500">알아두세요</h3>
    <div className="mt-[6px] flex flex-col gap-0 text-[12px] leading-[22.75px] text-gray-500">
      {noticeLines.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  </div>
)

export const FinanceDetailPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo
  const routeState = location.state as FinanceDetailLocationState | undefined
  const [productType, setProductType] = useState<FinanceProductType | null>(routeState?.productType ?? null)
  const [loanPreview, setLoanPreview] = useState<FinanceLoanPreview | null>(null)
  const [savingsProduct, setSavingsProduct] = useState<FinanceListProduct | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const isNumericId = id ? /^\d+$/.test(id) : false

  useEffect(() => {
    const fetchFinanceDetail = async () => {
      if (!id) {
        setErrorMessage('금융 상품을 찾을 수 없어요.')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setErrorMessage('')

        if (routeState?.productType === 'LOAN') {
          if (!isNumericId) {
            throw new Error('NOT_FOUND')
          }

          const preview = await getFinanceLoanPreview(id)
          setLoanPreview(preview)
          setSavingsProduct(null)
          setProductType('LOAN')
          return
        }

        const savings = await getFinanceProducts('savings')
        const selectedSaving = savings.find((product) => {
          if (String(product.id) === id) {
            return true
          }

          if (!id) {
            return false
          }

          return LEGACY_SAVINGS_SLUG_TO_NAME[id] === product.name
        })

        if (routeState?.productType === 'SAVINGS' || selectedSaving) {
          if (!selectedSaving) {
            throw new Error('NOT_FOUND')
          }

          setSavingsProduct(selectedSaving)
          setLoanPreview(null)
          setProductType('SAVINGS')
          return
        }

        if (!isNumericId) {
          throw new Error('NOT_FOUND')
        }

        const preview = await getFinanceLoanPreview(id)
        setLoanPreview(preview)
        setSavingsProduct(null)
        setProductType('LOAN')
      } catch {
        setErrorMessage('금융 상품 상세 정보를 불러오지 못했어요.')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchFinanceDetail()
  }, [id, isNumericId, routeState?.productType])

  const handleBack = () => {
    if (returnTo) {
      navigate(returnTo, { replace: true })
      return
    }

    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate(ROUTE_PATHS.finance)
  }

  const savingsDoneState = useMemo<FinanceDoneState | null>(() => {
    if (!savingsProduct) {
      return null
    }

    return buildSavingsDoneState(savingsProduct)
  }, [savingsProduct])

  const handleSavingsApply = async () => {
    if (!savingsProduct) {
      return
    }

    if (!savingsProduct.available) {
      setErrorMessage(getFinanceUnavailableReasonLabel(savingsProduct.unavailableReason))
      return
    }

    try {
      setIsSubmitting(true)
      await applyFinanceSavings({ productId: savingsProduct.id })

      navigate(ROUTE_PATHS.financeDone, {
        state: savingsDoneState,
      })
    } catch {
      setErrorMessage('적금 가입 처리에 실패했어요. 잠시 후 다시 시도해 주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <PageScaffold
        title="금융 상품을 불러오는 중이에요"
        description="잠시만 기다려 주세요."
      />
    )
  }

  if (errorMessage && !productType) {
    return <PageScaffold title="금융 상품을 찾을 수 없어요" description={errorMessage} />
  }

  if (productType === 'LOAN' && loanPreview) {
    const detailFields = buildLoanDetailFields(loanPreview)
    const isAvailable = loanPreview.available

    return (
      <div className="relative min-h-screen bg-bg-light font-pretendard">
        <MainLayout
          header={<ShopHeader title="금융상품" onBack={handleBack} />}
          className="bg-bg-light"
        >
          <div className="-mx-2 flex flex-col gap-[28px] bg-bg-light px-5 pb-[118px] pt-5">
            <section className="flex items-start justify-between gap-3 px-[1px]">
              <div className="min-w-0 flex-1">
                <h2 className="text-[22px] font-semibold leading-[1.2] text-font-main">
                  {loanPreview.name}
                </h2>
                <p className="mt-[10px] break-keep text-[15px] leading-[1.25] text-font-sub">
                  {loanPreview.subtitle}
                </p>
              </div>

              <img
                src={financeMascotImageSrc}
                alt={loanPreview.name}
                className="h-[77px] w-[73px] shrink-0 object-contain"
              />
            </section>

            <div className="flex flex-col gap-[14px] px-[10px]">
              {detailFields.map((field, index) => (
                <div key={field.label} className="flex flex-col gap-[14px]">
                  <InfoRow
                    label={field.label}
                    value={field.value}
                    className="items-center"
                    valueClassName="text-[14px] font-semibold leading-5 text-font-main"
                  />
                  {index < detailFields.length - 1 ? <div className="h-px bg-gray-200" /> : null}
                </div>
              ))}
            </div>

            <Card className="!gap-1 !rounded-control !border-0 !bg-gray-200 !px-[23px] !py-[18px] shadow-sm">
              <h3 className="text-[16px] font-semibold leading-[1.2] text-gray-600">상품 안내</h3>
                <p className="mt-[6px] text-[12px] leading-[22.75px] text-gray-600">
                {loanPreview.description}
              </p>
              {!isAvailable ? (
                <p className="mt-2 text-[12px] leading-[22.75px] text-primary-500">
                  {LOAN_PREVIEW_REASON_LABEL[loanPreview.reason]}
                </p>
              ) : null}
            </Card>

            {renderNoticeBlock(FINANCE_NOTICE_LINES)}

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
              onClick={() => navigate(getFinanceApplyPath(loanPreview.productId))}
              className="!h-[56px]"
              disabled={!isAvailable}
            >
              {isAvailable ? '대출 신청' : LOAN_PREVIEW_REASON_LABEL[loanPreview.reason]}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (productType === 'SAVINGS' && savingsProduct) {
    const detailFields = buildSavingsDetailFields(savingsProduct)
    const rateHighlightLabel = formatRate(savingsProduct.maxRate)
    const isSavingsAvailable = savingsProduct.available
    const savingsUnavailableLabel = getFinanceUnavailableReasonLabel(
      savingsProduct.unavailableReason,
    )

    return (
      <div className="relative min-h-screen bg-bg-light font-pretendard">
        <MainLayout
          header={<ShopHeader title="금융상품" onBack={handleBack} />}
          className="bg-bg-light"
        >
          <div className="-mx-2 flex flex-col gap-[27px] bg-bg-light px-5 pb-[118px] pt-4">
            <section className="flex items-center justify-between gap-2 px-[1px]">
              <div className="min-w-0 flex-1">
                <h2 className="text-[21px] font-semibold leading-[1.2] text-font-main">
                  {savingsProduct.name}
                </h2>
                <p className="mt-[10px] break-keep text-[15px] leading-[1.2] text-font-sub">
                  {savingsProduct.subtitle ?? ''}
                </p>
              </div>

              <img
                src={financeMascotImageSrc}
                alt={savingsProduct.name}
                className="h-[77px] w-[73px] shrink-0 object-contain"
              />
            </section>

            <Card className="!gap-0 !rounded-control !px-[25px] !py-[17px] shadow-sm">
              <p className="text-[15px] font-medium leading-[1.2] text-gray-500">
                {buildSavingsRateSummary(savingsProduct)}
              </p>
              <div className="mt-[18px] flex items-end gap-[4px]">
                <span className="text-[16px] font-bold leading-[1.2] text-gray-600">최고</span>
                <span className="text-[21px] font-bold leading-[1.2] tracking-tight-sm text-primary-500">
                  {rateHighlightLabel}
                </span>
              </div>
            </Card>

            <div className="flex flex-col gap-[14px] px-[10px]">
              {detailFields.map((field, index) => (
                <div key={field.label} className="flex flex-col gap-[14px]">
                  <InfoRow
                    label={field.label}
                    value={field.value}
                    className="items-center"
                    valueClassName="text-[14px] font-semibold leading-5 text-font-main"
                  />
                  {index < detailFields.length - 1 ? <div className="h-px bg-gray-200" /> : null}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-[27px]">
              <Card className="!gap-1 !rounded-control !border-0 !bg-gray-200 !px-[23px] !py-[18px] shadow-sm">
                <h3 className="text-[16px] font-semibold leading-[1.2] text-gray-600">상품 안내</h3>
                <p className="mt-[6px] text-[12px] leading-[22.75px] text-gray-600">
                  {savingsProduct.description ?? ''}
                </p>
                {!isSavingsAvailable ? (
                  <p className="mt-2 text-[12px] leading-[22.75px] text-primary-500">
                    {savingsUnavailableLabel}
                  </p>
                ) : null}
              </Card>

              {renderNoticeBlock(FINANCE_NOTICE_LINES)}

              {errorMessage ? (
                <Card className="!rounded-control !border-0 !px-5 !py-4 shadow-sm">
                  <p className="text-sm text-red-500">{errorMessage}</p>
                </Card>
              ) : null}
            </div>
          </div>
        </MainLayout>

        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50">
          <div className="pointer-events-auto mx-auto w-full max-w-[600px] border-t border-gray-200 bg-white px-(--side-padding) pb-[calc(16px+env(safe-area-inset-bottom))] pt-4 shadow-[var(--shadow-card)]">
            <Button
              type="button"
              fullWidth
              size="md"
              onClick={handleSavingsApply}
              className="!h-[56px]"
              disabled={isSubmitting || !isSavingsAvailable}
            >
              {isSubmitting ? '가입 처리 중...' : isSavingsAvailable ? '가입하기' : savingsUnavailableLabel}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <PageScaffold
      title="금융 상품을 찾을 수 없어요"
      description="존재하지 않거나 아직 준비되지 않은 금융 상품입니다."
    />
  )
}

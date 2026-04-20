import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Button, Card, InfoRow } from '../../components/common'
import MainLayout from '../../components/layout/MainLayout'
import { getS3AssetUrl } from '../../constants/assetUrls'
import { ROUTE_PATHS, getFinanceApplyPath } from '../../constants/routePaths'
import {
  applyFinanceSavings,
  getFinanceProducts,
} from '../../services/financeService'
import type {
  FinanceDoneState,
  FinanceListProduct,
  FinanceProductType,
} from '../../types/finance'
import { ShopHeader } from '../shop/components/ShopHeader'
import {
  FINANCE_NOTICE_LINES,
  LOAN_NOTICE_LINES,
  buildSavingsDetailFields,
  buildSavingsDoneState,
  buildSavingsRateSummary,
  formatCurrency,
  formatRate,
  getFinanceUnavailableReasonLabel,
} from './financeUi'

const financeMascotImageSrc = getS3AssetUrl('sing.webp')
const MAX_LOAN_LIMIT = 3_000_000
const LOAN_RATE_RANGE_LABEL = '연 최저 6.0% ~ 최고 8.5%'

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
  const [loanProduct, setLoanProduct] = useState<FinanceListProduct | null>(null)
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

          const loans = await getFinanceProducts('loan')
          const selectedLoan = loans.find((product) => String(product.id) === id)

          if (!selectedLoan) {
            throw new Error('NOT_FOUND')
          }

          setLoanProduct(selectedLoan)
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
          setLoanProduct(null)
          setProductType('SAVINGS')
          return
        }

        if (!isNumericId) {
          throw new Error('NOT_FOUND')
        }

        const loans = await getFinanceProducts('loan')
        const selectedLoan = loans.find((product) => String(product.id) === id)

        if (!selectedLoan) {
          throw new Error('NOT_FOUND')
        }

        setLoanProduct(selectedLoan)
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

  const renderDetailFeedback = (description: string, tone: 'default' | 'error' = 'default') => (
    <div className="relative min-h-screen font-pretendard">
      <MainLayout
        header={<ShopHeader title="금융상품" onBack={handleBack} />}
        className="bg-white"
      >
        <div className="-mx-(--side-padding) flex min-h-[calc(100dvh-var(--header-h)-env(safe-area-inset-top))] flex-col gap-4 bg-gray-50 px-5 pb-[88px] pt-6">
          <Card className="!rounded-control !border-0 !px-5 !py-6 shadow-sm">
            <p className={`text-sm ${tone === 'error' ? 'text-red-500' : 'text-gray-500'}`}>
              {description}
            </p>
          </Card>
        </div>
      </MainLayout>
    </div>
  )

  if (isLoading) {
    return renderDetailFeedback('금융 상품을 불러오는 중입니다.')
  }

  if (errorMessage && !productType) {
    return renderDetailFeedback(errorMessage, 'error')
  }

  if (productType === 'LOAN' && loanProduct) {
    const detailFields = [
      { label: '가입 대상', value: '기본 심사 통과 고객' },
      { label: '계약 기간', value: `${loanProduct.durationMonths}개월` },
      { label: '최대 한도', value: formatCurrency(MAX_LOAN_LIMIT) },
      { label: '대출 금리', value: LOAN_RATE_RANGE_LABEL },
    ]

    return (
      <div className="relative min-h-screen font-pretendard">
        <MainLayout
          header={<ShopHeader title="금융상품" onBack={handleBack} />}
          className="bg-white"
        >
          <div className="-mx-(--side-padding) flex min-h-[calc(100dvh-var(--header-h)-env(safe-area-inset-top))] flex-col gap-[28px] bg-gray-50 px-5 pb-[88px] pt-6">
            <section className="flex items-start justify-between gap-3 px-[1px]">
              <div className="min-w-0 flex-1">
                <h2 className="text-[22px] font-semibold leading-[1.2] text-font-main">
                  {loanProduct.name}
                </h2>
                <p className="mt-[10px] break-keep text-[15px] leading-[1.25] text-font-sub">
                  {loanProduct.subtitle ?? ''}
                </p>
              </div>

              <img
                src={financeMascotImageSrc}
                alt={loanProduct.name}
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

            <Card className="!gap-1 !rounded-control !border-0 !bg-gray-100 !px-[23px] !py-[18px] shadow-sm">
              <h3 className="text-[16px] font-semibold leading-[1.2] text-gray-600">우대 조건</h3>
              <p className="mt-[6px] text-[12px] leading-[22.75px] text-gray-600">
                ESG 점수가 오를 때마다 우대 혜택이 적용돼요.
              </p>
            </Card>

            {renderNoticeBlock(LOAN_NOTICE_LINES)}

            {errorMessage ? (
              <Card className="!rounded-control !border-0 !px-5 !py-4 shadow-sm">
                <p className="text-sm text-red-500">{errorMessage}</p>
              </Card>
            ) : null}
          </div>
        </MainLayout>

        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50">
          <div className="pointer-events-auto mx-auto w-full max-w-[600px] bg-white px-(--side-padding) pb-[calc(16px+env(safe-area-inset-bottom))] pt-2">
            <Button
              type="button"
              fullWidth
              size="md"
              onClick={() => navigate(getFinanceApplyPath(loanProduct.id))}
              className="!h-[56px]"
            >
              나의 한도 알아보기
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
      <div className="relative min-h-screen font-pretendard">
        <MainLayout
          header={<ShopHeader title="금융상품" onBack={handleBack} />}
          className="bg-white"
        >
          <div className="-mx-(--side-padding) flex min-h-[calc(100dvh-var(--header-h)-env(safe-area-inset-top))] flex-col gap-[27px] bg-gray-50 px-5 pb-[88px] pt-6">
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
              <Card className="!gap-1 !rounded-control !border-0 !bg-gray-100 !px-[23px] !py-[18px] shadow-sm">
                <h3 className="text-[16px] font-semibold leading-[1.2] text-gray-600">상품 안내</h3>
                <p className="mt-[6px] text-[12px] leading-[22.75px] text-gray-600">
                  {savingsProduct.description ?? ''}
                </p>
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
          <div className="pointer-events-auto mx-auto w-full max-w-[600px] bg-white px-(--side-padding) pb-[calc(16px+env(safe-area-inset-bottom))] pt-2">
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
    renderDetailFeedback('존재하지 않거나 아직 준비되지 않은 금융 상품입니다.', 'error')
  )
}

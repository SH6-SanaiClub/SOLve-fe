import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Badge, Card, Icons, SectionHeader } from '../../components/common'
import BottomNavigation from '../../components/layout/BottomNavigation'
import MainLayout from '../../components/layout/MainLayout'
import {
  BOTTOM_NAVIGATION_ITEMS,
  BOTTOM_NAVIGATION_ROUTE_BY_KEY,
} from '../../constants/bottomNavigation'
import { ROUTE_PATHS, getFinanceDetailPath } from '../../constants/routePaths'
import { getFinanceProducts, getSavingsRecommend } from '../../services/financeService'
import type { FinanceListProduct, SavingsRecommendResponse } from '../../types/finance'
import { ShopHeader } from '../shop/components/ShopHeader'
import { FinanceTabs, type FinanceTabValue } from './components/FinanceTabs'
import { SavingsRecommendCard } from './components/SavingsRecommendCard'
import {
  FINANCE_SECTION_LABELS,
  formatCurrency,
  formatRate,
  getFinanceUnavailableReasonLabel,
} from './financeUi'

const getProductCardClassName = (product: FinanceListProduct, baseClassName: string) =>
  [
    baseClassName,
    product.unavailableReason === 'ALREADY_JOINED' ? 'opacity-80' : '',
  ]
    .filter(Boolean)
    .join(' ')

export const FinancePage = () => {
  const MAX_LOAN_LIMIT = 3_000_000
  const MIN_LOAN_RATE_LABEL = '연 6.0%'
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState<FinanceTabValue>('all')
  const [savingsProducts, setSavingsProducts] = useState<FinanceListProduct[]>([])
  const [loanProducts, setLoanProducts] = useState<FinanceListProduct[]>([])
  const [recommend, setRecommend] = useState<SavingsRecommendResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo

  useEffect(() => {
    const fetchFinanceProducts = async () => {
      try {
        setIsLoading(true)
        setErrorMessage('')

        const [savings, loans, savingsRecommend] = await Promise.all([
          getFinanceProducts('savings'),
          getFinanceProducts('loan'),
          getSavingsRecommend().catch(() => null),
        ])

        setSavingsProducts(savings)
        setLoanProducts(loans)
        setRecommend(savingsRecommend)
      } catch {
        setErrorMessage('금융 상품 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.')
        setRecommend(null)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchFinanceProducts()
  }, [])

  const handleBottomNavigation = (key: string) => {
    const nextPath =
      BOTTOM_NAVIGATION_ROUTE_BY_KEY[key as keyof typeof BOTTOM_NAVIGATION_ROUTE_BY_KEY]

    if (nextPath) {
      navigate(nextPath)
    }
  }

  const handleBack = () => {
    if (returnTo) {
      navigate(returnTo, { replace: true })
      return
    }

    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate(ROUTE_PATHS.home)
  }

  const loanProduct = loanProducts[0]
  const showSavingsSection = activeTab === 'all' || activeTab === 'savings'
  const showLoanSection = activeTab === 'all' || activeTab === 'loan'
  const recommendedItem = recommend?.recommendation ?? null
  const visibleRecommendation =
    activeTab === 'all' &&
    recommendedItem &&
    savingsProducts.length > 0 &&
    !recommendedItem.isAlreadyJoined

  return (
    <MainLayout
      header={<ShopHeader title="금융상품" onBack={handleBack} />}
      nav={
        <BottomNavigation
          items={BOTTOM_NAVIGATION_ITEMS}
          value="finance"
          onChange={handleBottomNavigation}
        />
      }
      subHeader={<FinanceTabs activeTab={activeTab} onChange={setActiveTab} />}
      contentSpacing="comfortable"
      className="bg-bg-light"
    >
      <div className="-mx-4 flex flex-col gap-4 bg-bg-light px-(--side-padding) pt-3 pb-2">
        {visibleRecommendation && recommendedItem ? (
          <SavingsRecommendCard
            item={recommendedItem}
            isNewUser={recommend?.isNewUser ?? false}
            onClick={() =>
              navigate(getFinanceDetailPath(recommendedItem.productId), {
                state: { productType: 'SAVINGS' },
              })
            }
          />
        ) : null}

        {isLoading ? (
          <Card className="!rounded-control !border-0 !px-5 !py-6 shadow-sm">
            <p className="text-sm text-gray-500">금융 상품을 불러오는 중입니다.</p>
          </Card>
        ) : null}

        {!isLoading && errorMessage ? (
          <Card className="!rounded-control !border-0 !px-5 !py-6 shadow-sm">
            <p className="text-sm text-red-500">{errorMessage}</p>
          </Card>
        ) : null}

        {showSavingsSection ? (
          <section className="flex flex-col gap-4">
            <SectionHeader
              title={
                <span className="text-lg font-semibold leading-[120%] text-gray-700">
                  {FINANCE_SECTION_LABELS.SAVINGS}
                </span>
              }
              right={
                <span className="text-sm font-medium text-primary-400">
                  {savingsProducts.length}건
                </span>
              }
              className="px-3"
            />

            <div className="flex flex-col gap-3">
              {savingsProducts.map((product) => (
                <Card
                  key={product.id}
                  onClick={() =>
                    navigate(getFinanceDetailPath(product.id), {
                      state: { productType: product.type },
                    })
                  }
                  className={getProductCardClassName(
                    product,
                    '!gap-0 !rounded-control !border-0 !bg-white !px-[26px] !py-4 shadow-sm',
                  )}
                >
                  <div className="flex min-h-[58px] items-center justify-between gap-5">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="break-keep text-base font-semibold leading-[1.2] text-font-main">
                          {product.name}
                        </p>
                        {!product.available ? (
                          <Badge tone="neutral" variant="soft" className="shrink-0 text-[11px]">
                            가입 불가
                          </Badge>
                        ) : null}
                      </div>
                      <p className="mt-2 whitespace-pre-line text-xs leading-[1.2] text-gray-600">
                        {product.available
                          ? product.subtitle ?? ''
                          : getFinanceUnavailableReasonLabel(product.unavailableReason)}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center">
                      <span className="text-base font-bold leading-none text-primary-500">
                        {formatRate(product.maxRate)}
                      </span>
                      <Icons.ArrowRight className="text-gray-500" size={24} />
                    </div>
                  </div>
                </Card>
              ))}

              {!isLoading && !errorMessage && savingsProducts.length === 0 ? (
                <Card className="!rounded-control !border-0 !px-5 !py-6 shadow-sm">
                  <p className="text-sm text-gray-500">가입 가능한 적금 상품이 없습니다.</p>
                </Card>
              ) : null}
            </div>
          </section>
        ) : null}

        {showLoanSection ? (
          <section className="flex flex-col gap-4">
            <SectionHeader
              title={
                <span className="text-lg font-semibold leading-[120%] text-gray-700">
                  {FINANCE_SECTION_LABELS.LOAN}
                </span>
              }
              right={
                <span className="text-sm font-medium text-primary-400">
                  {loanProducts.length}건
                </span>
              }
              className="px-3"
            />

            {loanProduct ? (
              <Card
                key={loanProduct.id}
                onClick={() =>
                  navigate(getFinanceDetailPath(loanProduct.id), {
                    state: { productType: loanProduct.type },
                  })
                }
                className={getProductCardClassName(
                  loanProduct,
                  '!gap-0 !rounded-control !border-0 !px-5 !py-[26px] shadow-sm',
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 max-w-[235px]">
                    <p className="text-[20px] font-bold leading-[1.2] text-font-main">
                      {loanProduct.name}
                    </p>
                    <p className="mt-2 text-xs leading-[1.2] text-font-main">
                      {loanProduct.subtitle ?? ''}
                    </p>
                  </div>

                  <Icons.ArrowRight className="mt-5 shrink-0 text-gray-500" size={24} />
                </div>

                <div className="mt-7 border-t border-gray-100 pt-5">
                  <p className="text-xs font-medium leading-[1.625] text-gray-500">
                    상품 기본 조건
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-[14px] bg-primary-50/70 px-4 py-3">
                      <p className="text-[11px] font-medium text-primary-400">대출 한도</p>
                      <p className="mt-1 text-base font-bold leading-6 text-font-main">
                        {formatCurrency(MAX_LOAN_LIMIT)}
                      </p>
                    </div>
                    <div className="rounded-[14px] bg-gray-50 px-4 py-3">
                      <p className="text-[11px] font-medium text-gray-500">적용 금리</p>
                      <p className="mt-1 text-base font-bold leading-6 text-primary-500">
                        {MIN_LOAN_RATE_LABEL}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ) : !isLoading && !errorMessage ? (
              <Card className="!rounded-control !border-0 !px-5 !py-6 shadow-sm">
                <p className="text-sm text-gray-500">이용 가능한 대출 상품이 없습니다.</p>
              </Card>
            ) : null}
          </section>
        ) : null}
      </div>
    </MainLayout>
  )
}

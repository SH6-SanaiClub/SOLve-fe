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
import { getSavingsRecommend } from '../../services/financeService'
import type { SavingsRecommendResponse } from '../../types/finance'
import { ShopHeader } from '../shop/components/ShopHeader'
import { FinanceTabs } from './components/FinanceTabs'
import { SavingsRecommendCard } from './components/SavingsRecommendCard'
import { financeSectionLabels, loanProducts, savingsProducts } from './financeData'

export const FinancePage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState<'all' | 'savings' | 'loan'>('all')
  const [recommend, setRecommend] = useState<SavingsRecommendResponse | null>(null)
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo

  useEffect(() => {
    const fetchSavingsRecommend = async () => {
      try {
        const response = await getSavingsRecommend()
        setRecommend(response)
      } catch {
        setRecommend(null)
      }
    }

    void fetchSavingsRecommend()
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
  const loanTiers = loanProduct?.loanTiers ?? []
  const showSavingsSection = activeTab === 'all' || activeTab === 'savings'
  const showLoanSection = activeTab === 'all' || activeTab === 'loan'

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
      className="bg-bg-light"
    >
      <div className="-mx-4 flex flex-col gap-4 bg-bg-light px-(--side-padding) pb-2">
        <FinanceTabs activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === 'all' && recommend ? (
          <SavingsRecommendCard
            item={recommend.recommendation}
            isNewUser={recommend.isNewUser}
            onClick={() => navigate(getFinanceDetailPath(recommend.recommendation.productId))}
          />
        ) : null}

        {showSavingsSection ? (
          <section className="flex flex-col gap-4">
            <SectionHeader
              title={
                <span className="text-lg leading-[120%] font-semibold text-gray-700">
                  {financeSectionLabels.SAVINGS}
                </span>
              }
              right={
                <span className="text-sm font-medium text-primary-400">
                  {savingsProducts.length}건
                </span>
              }
            />

            <div className="flex flex-col gap-3">
              {savingsProducts.map((product) => (
                <Card
                  key={product.id}
                  onClick={() => navigate(getFinanceDetailPath(product.id))}
                  className="!gap-0 !rounded-control !border-0 !px-[26px] !py-4 shadow-sm"
                >
                  <div className="flex min-h-[58px] items-center justify-between gap-5">
                    <div className="min-w-0 max-w-[160px]">
                      <p className="truncate text-base font-semibold leading-[1.2] text-font-main">
                        {product.name}
                      </p>
                      <p className="mt-2 whitespace-pre-line text-xs leading-[1.2] text-gray-600">
                        {product.listDescription}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center">
                      <span className="text-base font-bold leading-none text-primary-500">
                        {product.listRateLabel}
                      </span>
                      <Icons.ArrowRight className="text-gray-500" size={24} />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        ) : null}

        {showLoanSection ? (
          <section className="flex flex-col gap-4">
            <SectionHeader
              title={
                <span className="text-lg leading-[120%] font-semibold text-gray-700">
                  {financeSectionLabels.LOAN}
                </span>
              }
              right={
                <span className="text-sm font-medium text-primary-400">
                  {loanProducts.length}건
                </span>
              }
            />

            {loanProduct ? (
              <Card
                key={loanProduct.id}
                onClick={() => navigate(getFinanceDetailPath(loanProduct.id))}
                className="!gap-0 !rounded-control !border-0 !px-5 !py-[26px] shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 max-w-[235px]">
                    {loanProduct.badge ? (
                      <Badge
                        tone="primary"
                        variant="soft"
                        className="mb-3 !rounded-[4px] !px-[6px] !py-[2px] text-xs font-medium text-primary-400"
                      >
                        {loanProduct.badge}
                      </Badge>
                    ) : null}
                    <p className="text-[20px] font-bold leading-[1.2] text-font-main">
                      {loanProduct.name}
                    </p>
                    <p className="mt-2 text-xs leading-[1.2] text-font-main">
                      {loanProduct.listDescription}
                    </p>
                  </div>

                  <Icons.ArrowRight className="mt-5 shrink-0 text-gray-500" size={24} />
                </div>

                {loanProduct.userOfferLabel ? (
                  <div className="mt-8 rounded-control bg-gray-50 px-9 py-6 shadow-sm">
                    <p className="text-xs leading-[1.625] text-gray-600">나의 ESG 등급</p>
                    <p className="mt-1 text-base font-bold leading-7 text-font-main">
                      {loanProduct.userOfferLabel}
                    </p>
                  </div>
                ) : null}

                {loanTiers.length ? (
                  <div className="mt-[30px] flex flex-col gap-[14px]">
                    {loanTiers.map((tier, index) => (
                      <div key={tier.scoreLabel} className="flex flex-col gap-[14px]">
                        <div className="flex items-center justify-between gap-4 px-[10px]">
                          <span className="text-xs font-medium leading-5 text-gray-500">
                            {tier.scoreLabel}
                          </span>
                          <div className="text-base font-semibold leading-5 text-font-main">
                            {tier.limitLabel} / {tier.rateLabel}
                          </div>
                        </div>
                        {index < loanTiers.length - 1 ? (
                          <div className="h-px bg-gray-200" />
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : null}
              </Card>
            ) : null}
          </section>
        ) : null}
      </div>
    </MainLayout>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import goodImageSrc from '../../assets/good.png'
import { Badge, Button, Card, SectionHeader } from '../../components/common'
import BottomNavigation from '../../components/layout/BottomNavigation'
import MainLayout from '../../components/layout/MainLayout'
import {
  BOTTOM_NAVIGATION_ITEMS,
  BOTTOM_NAVIGATION_ROUTE_BY_KEY,
} from '../../constants/bottomNavigation'
import {
  ROUTE_PATHS,
  getFinanceDetailPath,
  getMyFinanceSavingsHistoryPath,
} from '../../constants/routePaths'
import { getMyFinanceProducts } from '../../services/financeService'
import type { FinanceApplicationStatus, FinanceMyLoan, FinanceMySaving } from '../../types/finance'
import { ShopHeader } from '../shop/components/ShopHeader'
import { formatCurrency, formatDate, formatRate, formatRatePoint } from '../finance/financeUi'

const isActiveFinanceStatus = (status: FinanceApplicationStatus) => status === 'ACTIVE'

const getInactiveStatusLabel = (status: FinanceApplicationStatus) =>
  status === 'COMPLETE' ? '완료됨' : '만료됨'

const sortByActiveStatus = <T extends { status: FinanceApplicationStatus }>(items: T[]) =>
  [...items].sort(
    (currentItem, nextItem) =>
      Number(isActiveFinanceStatus(nextItem.status)) -
      Number(isActiveFinanceStatus(currentItem.status)),
  )

export const MyFinancePage = () => {
  const navigate = useNavigate()
  const [savings, setSavings] = useState<FinanceMySaving[]>([])
  const [loans, setLoans] = useState<FinanceMyLoan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const fetchMyFinanceProducts = async () => {
      try {
        setIsLoading(true)
        setErrorMessage('')

        const response = await getMyFinanceProducts()
        setSavings(response.savings)
        setLoans(response.loans)
      } catch {
        setErrorMessage('금융 관리 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchMyFinanceProducts()
  }, [])

  const handleBottomNavigation = (key: string) => {
    const nextPath =
      BOTTOM_NAVIGATION_ROUTE_BY_KEY[key as keyof typeof BOTTOM_NAVIGATION_ROUTE_BY_KEY]

    if (nextPath) {
      navigate(nextPath)
    }
  }

  const sortedSavings = sortByActiveStatus(savings)
  const sortedLoans = sortByActiveStatus(loans)

  return (
    <MainLayout
      header={<ShopHeader title="금융 상품 관리" onBack={() => navigate(ROUTE_PATHS.my)} />}
      nav={
        <BottomNavigation
          items={BOTTOM_NAVIGATION_ITEMS}
          value="my"
          onChange={handleBottomNavigation}
        />
      }
      className="bg-bg-light"
    >
      <div className="mt-5 flex flex-col gap-5 pb-2">
        {isLoading ? (
          <Card className="!rounded-control !border-0 !px-5 !py-6 shadow-sm">
            <p className="text-sm text-gray-500">금융 관리 정보를 불러오는 중입니다.</p>
          </Card>
        ) : null}

        {!isLoading && errorMessage ? (
          <Card className="!rounded-control !border-0 !px-5 !py-6 shadow-sm">
            <p className="text-sm text-red-500">{errorMessage}</p>
          </Card>
        ) : null}

        <section className="flex flex-col gap-3">
          <SectionHeader
            title={<span className="text-base font-semibold text-font-main">적금 현황</span>}
            right={<span className="text-xs font-medium text-primary-400">{savings.length}건</span>}
          />

          {sortedSavings.length ? (
            sortedSavings.map((saving) => {
              const isMasterSaving = saving.productName === 'ESG 마스터 적금'
              const isActiveSaving = isActiveFinanceStatus(saving.status)

              return (
                <Card
                  key={saving.savingId}
                  onClick={() => navigate(getMyFinanceSavingsHistoryPath(saving.savingId))}
                  className="!gap-0 !rounded-control !border-0 !px-5 !py-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone="primary" variant="soft" className="!px-[8px] !py-[3px]">
                          SAVINGS
                        </Badge>
                        {!isActiveSaving ? (
                          <Badge tone="neutral" variant="soft" className="!px-[8px] !py-[3px]">
                            {getInactiveStatusLabel(saving.status)}
                          </Badge>
                        ) : null}
                      </div>
                      <p className="mt-3 text-[16px] font-semibold leading-[1.2] text-font-main">
                        {saving.productName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-medium text-gray-400">적용 금리</p>
                      <p className="mt-1 text-[18px] font-bold leading-none text-primary-500">
                        {formatRate(saving.appliedRate).replace('연 ', '')}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] text-gray-400">누적 납입액</span>
                      <span className="text-[16px] font-semibold text-gray-700">
                        {formatCurrency(saving.paidAmount).replace('원', ' 원')}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1 text-right">
                      <span className="text-[11px] text-gray-400">우대 금리</span>
                      <span className="text-[16px] font-semibold text-primary-500">
                        {formatRatePoint(saving.addedRate)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <p className="text-[11px] text-gray-400">납입 회차</p>
                      <p className="mt-1 text-[12px] font-medium text-gray-600">
                        {saving.paymentCount}회차
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-gray-400">월 납입액</p>
                      <p className="mt-1 text-[12px] font-medium text-gray-600">
                        {formatCurrency(saving.monthlyAmount).replace('원', ' 원')}
                      </p>
                    </div>
                  </div>

                  {isMasterSaving ? (
                    <div className="mt-4 flex items-center justify-between rounded-[8px] bg-gray-50 px-3 py-3">
                      <span className="text-[11px] font-medium text-gray-500">마스터 우대</span>
                      <span
                        className={`text-[12px] font-semibold ${
                          saving.masterBonusEligible ? 'text-primary-500' : 'text-gray-500'
                        }`}
                      >
                        {saving.masterBonusEligible ? '자격 유지' : '자격 소멸'}
                      </span>
                    </div>
                  ) : null}
                </Card>
              )
            })
          ) : !isLoading ? (
            <Card className="!rounded-control !border-0 !px-5 !py-6 shadow-sm">
              <p className="text-sm text-gray-500">현재 가입 중인 적금 상품이 없습니다.</p>
            </Card>
          ) : null}
        </section>

        <section className="flex flex-col gap-3">
          <SectionHeader
            title={<span className="text-base font-semibold text-font-main">대출 관리</span>}
            right={<span className="text-xs font-medium text-primary-400">{loans.length}건</span>}
          />

          {sortedLoans.length ? (
            sortedLoans.map((loan) => {
              const isActiveLoan = isActiveFinanceStatus(loan.status)

              return (
                <Card
                  key={loan.loanId}
                  onClick={() => navigate(ROUTE_PATHS.myFinanceLoanHistory)}
                  className="!gap-0 !rounded-control !border-0 !px-5 !py-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone="neutral" variant="soft" className="!px-[8px] !py-[3px]">
                          LOAN
                        </Badge>
                        {!isActiveLoan ? (
                          <Badge tone="neutral" variant="soft" className="!px-[8px] !py-[3px]">
                            {getInactiveStatusLabel(loan.status)}
                          </Badge>
                        ) : null}
                      </div>
                      <p className="mt-3 text-[16px] font-semibold leading-[1.2] text-font-main">
                        {loan.productName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-medium text-gray-400">금리</p>
                      <p className="mt-1 text-[25px] font-bold leading-none text-primary-500">
                        {formatRate(loan.currentRate).replace('연 ', '')}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] text-gray-400">누적 상환액</span>
                      <span className="text-[16px] font-semibold text-gray-700">
                        {formatCurrency(loan.paidAmount).replace('원', ' 원')}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1 text-right">
                      <span className="text-[11px] text-gray-400">남은 금액</span>
                      <span className="text-[16px] font-semibold text-primary-500">
                        {formatCurrency(loan.remainingAmount).replace('원', ' 원')}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <p className="text-[11px] text-gray-400">상환 회차</p>
                      <p className="mt-1 text-[12px] font-medium text-gray-600">
                        {loan.repaymentCount}회차
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-gray-400">다음 상환일</p>
                      <p className="mt-1 text-[12px] font-medium text-gray-600">
                        {formatDate(loan.nextRepaymentDate)}
                      </p>
                    </div>
                  </div>
                </Card>
              )
            })
          ) : !isLoading ? (
            <Card className="!rounded-control !border-0 !px-5 !py-6 shadow-sm">
              <p className="text-sm text-gray-500">현재 이용 중인 대출 상품이 없습니다.</p>
            </Card>
          ) : null}
        </section>

        <section className="flex flex-col gap-3">
          <SectionHeader
            title={<span className="text-base font-semibold text-font-main">당신을 위한 추천</span>}
          />

          <Card className="!gap-0 !overflow-hidden !rounded-control !border-0 !p-0 shadow-sm">
            <img
              src={goodImageSrc}
              alt="신규 친환경 청년 적금"
              className="h-[170px] w-full object-cover"
            />
            <div className="px-5 py-5">
              <p className="text-[20px] font-semibold leading-[1.2] text-font-main">
                신규 친환경 청년 적금
              </p>
              <p className="mt-3 text-[13px] leading-6 text-font-sub">
                ESG 점수 1점마다 이산화탄소 배출량을 막는 만큼 금리 우대.
                <span className="font-semibold text-primary-500"> 최대 연 6.0%</span> 추가 금리 혜택
              </p>
              <Button
                type="button"
                fullWidth
                className="mt-5 !h-[46px]"
                onClick={() =>
                  navigate(
                    savings[0]
                      ? getFinanceDetailPath(savings[0].productId)
                      : ROUTE_PATHS.finance,
                    {
                      state: { productType: 'SAVINGS' },
                    },
                  )
                }
              >
                상세 정보 보기
              </Button>
            </div>
          </Card>
        </section>
      </div>
    </MainLayout>
  )
}


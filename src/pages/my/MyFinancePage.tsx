import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Badge,
  Button,
  Card,
  Icons,
  SectionHeader,
  Tabs,
} from '../../components/common'
import BottomNavigation from '../../components/layout/BottomNavigation'
import MainLayout from '../../components/layout/MainLayout'
import {
  BOTTOM_NAVIGATION_ITEMS,
  BOTTOM_NAVIGATION_ROUTE_BY_KEY,
} from '../../constants/bottomNavigation'
import {
  ROUTE_PATHS,
  getMyFinanceSavingsHistoryPath,
} from '../../constants/routePaths'
import { getMyFinanceProducts } from '../../services/financeService'
import type {
  FinanceApplicationStatus,
  FinanceMyLoan,
  FinanceMySaving,
} from '../../types/finance'
import { ShopHeader } from '../shop/components/ShopHeader'
import { formatCurrency, formatDate, formatRate, formatRatePoint } from '../finance/financeUi'

type FinanceManagementTab = 'savings' | 'loan'

interface FinanceLocationState {
  initialTab?: FinanceManagementTab
}

const isActiveFinanceStatus = (status: FinanceApplicationStatus) => status === 'ACTIVE'

const getInactiveStatusLabel = (status: FinanceApplicationStatus) => {
  switch (status) {
    case 'COMPLETE':
      return '완료됨'
    case 'MATURED':
      return '만기됨'
    case 'TERMINATED':
      return '해지됨'
    case 'CLOSED':
      return '종료됨'
    default:
      return '만료됨'
  }
}

const getFinanceCardStatusLabel = (status: FinanceApplicationStatus) =>
  isActiveFinanceStatus(status) ? '진행 중' : getInactiveStatusLabel(status)

const sortByActiveStatus = <T extends { status: FinanceApplicationStatus }>(items: T[]) =>
  [...items].sort(
    (currentItem, nextItem) =>
      Number(isActiveFinanceStatus(nextItem.status)) -
      Number(isActiveFinanceStatus(currentItem.status)),
  )

const parseTime = (value: string) => {
  const timestamp = new Date(value).getTime()
  return Number.isNaN(timestamp) ? Number.POSITIVE_INFINITY : timestamp
}

const getLoanMaturityDate = (loan: FinanceMyLoan) => {
  const joinedAt = new Date(loan.joinedAt)

  if (Number.isNaN(joinedAt.getTime())) {
    return ''
  }

  const maturityDate = new Date(joinedAt)
  maturityDate.setMonth(maturityDate.getMonth() + loan.durationMonths)

  const year = maturityDate.getFullYear()
  const month = String(maturityDate.getMonth() + 1).padStart(2, '0')
  const day = String(maturityDate.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export const MyFinancePage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const routeState = location.state as FinanceLocationState | undefined
  const [activeTab, setActiveTab] = useState<FinanceManagementTab>('savings')
  const [loans, setLoans] = useState<FinanceMyLoan[]>([])
  const [savings, setSavings] = useState<FinanceMySaving[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const fetchMyFinanceProducts = async () => {
      try {
        setIsLoading(true)
        setErrorMessage('')

        const response = await getMyFinanceProducts()
        setLoans(response.loans)
        setSavings(response.savings)
      } catch {
        setErrorMessage('금융상품 관리 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchMyFinanceProducts()
  }, [])

  useEffect(() => {
    if (routeState?.initialTab === 'loan' || routeState?.initialTab === 'savings') {
      setActiveTab(routeState.initialTab)
      return
    }

    if (savings.length === 0 && loans.length > 0) {
      setActiveTab('loan')
      return
    }

    if (loans.length === 0 && savings.length > 0) {
      setActiveTab('savings')
    }
  }, [routeState, savings.length, loans.length])

  const handleBottomNavigation = (key: string) => {
    const nextPath =
      BOTTOM_NAVIGATION_ROUTE_BY_KEY[key as keyof typeof BOTTOM_NAVIGATION_ROUTE_BY_KEY]

    if (nextPath) {
      navigate(nextPath)
    }
  }

  const sortedLoans = sortByActiveStatus(loans)
  const sortedSavings = sortByActiveStatus(savings)
  const activeLoans = sortedLoans.filter((loan) => isActiveFinanceStatus(loan.status))
  const activeSavings = sortedSavings.filter((saving) => isActiveFinanceStatus(saving.status))
  const totalSavingsPaidAmount = activeSavings.reduce(
    (sum, saving) => sum + saving.paidAmount,
    0,
  )
  const totalLoanPrincipalAmount = activeLoans.reduce(
    (sum, loan) => sum + loan.principalAmount,
    0,
  )
  const nearestRepaymentDate = [...activeLoans]
    .sort((currentLoan, nextLoan) => {
      return parseTime(currentLoan.nextRepaymentDate) - parseTime(nextLoan.nextRepaymentDate)
    })[0]?.nextRepaymentDate
  const nearestMaturityDate = [...activeSavings]
    .sort((currentSaving, nextSaving) => {
      return parseTime(currentSaving.maturityDate) - parseTime(nextSaving.maturityDate)
    })[0]?.maturityDate
  const summaryLabel = nearestRepaymentDate
    ? '다음 이자 납부일'
    : nearestMaturityDate
      ? '가장 가까운 만기일'
      : '예정 일정'
  const summaryValue = nearestRepaymentDate
    ? formatDate(nearestRepaymentDate)
    : nearestMaturityDate
      ? formatDate(nearestMaturityDate)
      : '예정 일정 없음'
  const loanSummaryLabel = nearestRepaymentDate
    ? '대출 만기일'
    : nearestMaturityDate
      ? '가장 가까운 만기일'
      : '예정 일정'
  const loanSummaryValue = nearestRepaymentDate
    ? formatDate(nearestRepaymentDate)
    : nearestMaturityDate
      ? formatDate(nearestMaturityDate)
      : '예정 일정 없음'
  const financeTabs = [
    { label: `적금 ${sortedSavings.length}`, value: 'savings' },
    { label: `대출 ${sortedLoans.length}`, value: 'loan' },
  ]

  return (
    <MainLayout
      header={<ShopHeader title="금융상품 관리" onBack={() => navigate(ROUTE_PATHS.my)} />}
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
        <Card className="!gap-0 !border-0 !px-4 !py-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 [&>p:nth-child(3)]:hidden">
              <p className="text-sm font-semibold text-font-main">
                금융상품 {activeSavings.length + activeLoans.length}건
              </p>
              <p className={activeLoans.length ? 'mt-1 text-xs text-gray-500' : 'hidden'}>
                {summaryLabel} · {summaryValue}
              </p>
              <p className="mt-1 text-xs text-gray-500">{loanSummaryLabel} · {loanSummaryValue}</p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Badge tone="primary" variant="soft" className="!px-[8px] !py-[3px]">
                적금 {activeSavings.length}
              </Badge>
              <Badge tone="neutral" variant="soft" className="!px-[8px] !py-[3px]">
                대출 {activeLoans.length}
              </Badge>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 border-t border-gray-100 pt-3">
            <div className="min-w-0">
              <p className="text-[11px] text-gray-400">적금 누적 금액</p>
              <p className="mt-1 truncate text-sm font-semibold text-font-main">
                {formatCurrency(totalSavingsPaidAmount).replace('원', ' 원')}
              </p>
            </div>
            <div className="min-w-0 text-right">
              <p className="text-[11px] text-gray-400">대출 보유 금액</p>
              <p className="mt-1 truncate text-sm font-semibold text-font-main">
                {formatCurrency(totalLoanPrincipalAmount).replace('원', ' 원')}
              </p>
            </div>
          </div>
        </Card>

        {isLoading ? (
          <Card className="!rounded-control !border-0 !px-5 !py-6 shadow-sm">
            <p className="text-sm text-gray-500">금융상품 관리 정보를 불러오는 중입니다.</p>
          </Card>
        ) : null}

        {!isLoading && errorMessage ? (
          <Card className="!rounded-control !border-0 !px-5 !py-6 shadow-sm">
            <p className="text-sm text-red-500">{errorMessage}</p>
          </Card>
        ) : null}

        <section className="flex flex-col gap-3">
          <SectionHeader
            title={<span className="text-base font-semibold text-font-main">보유 상품</span>}
            right={
              <span className="text-xs font-medium text-primary-400">
                {sortedSavings.length + sortedLoans.length}건
              </span>
            }
          />

          <Tabs
            items={financeTabs}
            value={activeTab}
            onChange={(value) => setActiveTab(value as FinanceManagementTab)}
            className="
              [&_button]:flex
              [&_button]:h-12
              [&_button]:items-center
              [&_button]:justify-center
              [&_button]:pb-0
              [&_button]:pt-0
              [&_button]:text-sm
              [&_button[aria-selected=true]]:text-font-main
              [&_button[aria-selected=false]]:text-gray-400
              [&_button>span]:h-px
            "
          />

          {activeTab === 'savings' ? (
            sortedSavings.length ? (
              sortedSavings.map((saving) => (
                <Card
                  key={saving.savingId}
                  onClick={() => navigate(getMyFinanceSavingsHistoryPath(saving.savingId))}
                  className="!gap-0 !rounded-control !border-0 !px-4 !py-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[15px] font-semibold leading-[1.2] text-font-main">
                        {saving.productName}
                      </p>
                      <p className="mt-1 text-[11px] text-gray-500">
                        {getFinanceCardStatusLabel(saving.status)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-medium text-gray-400">적용 금리</p>
                      <p className="mt-1 text-[16px] font-bold leading-none text-primary-500">
                        {formatRate(saving.appliedRate).replace('연 ', '')}
                      </p>
                      <p className="mt-1 text-[11px] font-medium text-primary-400">
                        우대 {formatRatePoint(saving.addedRate).replace('%p', '%')}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] text-gray-400">누적 납입액</span>
                      <span className="text-[15px] font-semibold text-gray-700">
                        {formatCurrency(saving.paidAmount).replace('원', ' 원')}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1 text-right">
                      <span className="text-[11px] text-gray-400">월 납입액</span>
                      <span className="text-[13px] font-medium text-gray-700">
                        {formatCurrency(saving.monthlyAmount).replace('원', ' 원')}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                    <span className="text-[12px] font-medium text-gray-500">자세히 보기</span>
                    <Icons.ArrowRight className="text-gray-400" size={16} />
                  </div>
                </Card>
              ))
            ) : !isLoading ? (
              <Card className="!rounded-control !border-0 !px-5 !py-6 shadow-sm">
                <p className="text-sm text-gray-500">현재 가입 중인 적금 상품이 없습니다.</p>
                <Button
                  variant="outline"
                  fullWidth
                  className="mt-4 !h-[46px]"
                  onClick={() => navigate(ROUTE_PATHS.finance)}
                >
                  적금 상품 보러가기
                </Button>
              </Card>
            ) : null
          ) : sortedLoans.length ? (
            sortedLoans.map((loan) => (
              <Card
                key={loan.loanId}
                onClick={() => navigate(ROUTE_PATHS.myFinanceLoanHistory)}
                className="!gap-0 !rounded-control !border-0 !px-4 !py-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold leading-[1.2] text-font-main">
                      {loan.productName}
                    </p>
                    <p className="mt-1 text-[11px] text-gray-500">
                      {getFinanceCardStatusLabel(loan.status)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-medium text-gray-400">금리</p>
                    <p className="mt-1 text-[18px] font-bold leading-none text-primary-500">
                      {formatRate(loan.currentRate).replace('연 ', '')}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-gray-400">대출 보유 금액</span>
                    <span className="text-[15px] font-semibold text-gray-700">
                      {formatCurrency(loan.principalAmount).replace('원', ' 원')}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-right [&>span:first-child]:hidden">
                    <span className="text-[11px] text-gray-400">다음 이자 납부일</span>
                    <span className="text-[11px] text-gray-400">대출 만기일</span>
                    <span className="text-[14px] font-medium text-gray-700">
                      {formatDate(getLoanMaturityDate(loan))}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                  <span className="text-[12px] font-medium text-gray-500">자세히 보기</span>
                  <Icons.ArrowRight className="text-gray-400" size={16} />
                </div>
              </Card>
            ))
          ) : !isLoading ? (
            <Card className="!rounded-control !border-0 !px-5 !py-6 shadow-sm">
              <p className="text-sm text-gray-500">현재 이용 중인 대출 상품이 없습니다.</p>
              <Button
                variant="outline"
                fullWidth
                className="mt-4 !h-[46px]"
                onClick={() => navigate(ROUTE_PATHS.finance)}
              >
                대출 상품 보러가기
              </Button>
            </Card>
          ) : null}
        </section>
      </div>
    </MainLayout>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge, Card, SectionHeader } from '../../components/common'
import { PageMotionStyles, buildPageEnterStyle } from '../../components/common/PageMotion'
import BottomNavigation from '../../components/layout/BottomNavigation'
import MainLayout from '../../components/layout/MainLayout'
import {
  BOTTOM_NAVIGATION_ITEMS,
  BOTTOM_NAVIGATION_ROUTE_BY_KEY,
} from '../../constants/bottomNavigation'
import { ROUTE_PATHS } from '../../constants/routePaths'
import { getFinanceHistory, getMyFinanceProducts } from '../../services/financeService'
import type { FinanceLoanHistoryItem } from '../../types/finance'
import { ShopHeader } from '../shop/components/ShopHeader'
import { formatCurrency, formatDate } from '../finance/financeUi'

export const MyLoanHistoryPage = () => {
  const navigate = useNavigate()
  const [historyItems, setHistoryItems] = useState<FinanceLoanHistoryItem[]>([])
  const [isCompletedLoan, setIsCompletedLoan] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const fetchFinanceHistory = async () => {
      try {
        setIsLoading(true)
        setErrorMessage('')

        const response = await getFinanceHistory()
        setHistoryItems(response.loans)

        try {
          const myFinanceResponse = await getMyFinanceProducts()
          const targetLoanId =
            response.loans.find((item) => item.amount > 0)?.loanId ?? response.loans[0]?.loanId
          const targetLoan =
            myFinanceResponse.loans.find((loan) => loan.loanId === targetLoanId) ??
            myFinanceResponse.loans[0]

          setIsCompletedLoan(targetLoan?.status === 'COMPLETE')
        } catch {
          setIsCompletedLoan(false)
        }
      } catch {
        setErrorMessage('대출 이력을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchFinanceHistory()
  }, [])

  const handleBottomNavigation = (key: string) => {
    const nextPath =
      BOTTOM_NAVIGATION_ROUTE_BY_KEY[key as keyof typeof BOTTOM_NAVIGATION_ROUTE_BY_KEY]

    if (nextPath) {
      navigate(nextPath)
    }
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate(ROUTE_PATHS.myFinance, { state: { initialTab: 'loan' } })
  }
  return (
    <MainLayout
      header={<ShopHeader title="내 대출 이력" onBack={handleBack} />}
      nav={
        <BottomNavigation
          items={BOTTOM_NAVIGATION_ITEMS}
          value="my"
          onChange={handleBottomNavigation}
        />
      }
      className="bg-bg-light"
    >
      <PageMotionStyles />
      <div className="mt-5 flex flex-col gap-3" style={buildPageEnterStyle(40, 460)}>
        <SectionHeader
          title={<span className="text-base font-semibold text-font-main">최근 거래 내역</span>}
          right={<span className="text-xs font-medium text-primary-400">{historyItems.length}건</span>}
        />

        {isLoading ? (
          <Card className="!rounded-control !border-0 !px-5 !py-6 shadow-sm">
            <p className="text-sm text-gray-500">대출 이력을 불러오는 중입니다.</p>
          </Card>
        ) : null}

        {!isLoading && errorMessage ? (
          <Card className="!rounded-control !border-0 !px-5 !py-6 shadow-sm">
            <p className="text-sm text-red-500">{errorMessage}</p>
          </Card>
        ) : null}

        {!isLoading && !errorMessage && historyItems.length === 0 ? (
          <Card className="!rounded-control !border-0 !px-5 !py-6 shadow-sm">
            <p className="text-sm text-gray-500">대출 거래 이력이 없습니다.</p>
          </Card>
        ) : null}

        {historyItems.length ? (
          <Card className="!gap-0 !rounded-control !border-0 !p-0 shadow-sm">
            {historyItems.map((item, index) => {
              const isPayout = item.amount > 0
              const isFinalRepayment = !isPayout && isCompletedLoan && index === 0
              const amountText = `${isPayout ? '+' : '-'}${formatCurrency(Math.abs(item.amount))}`
              const historyLabel = isPayout
                ? '대출 실행 완료'
                : isFinalRepayment
                  ? '원금+이자 납부'
                  : '이자 납부'

              return (
                <div
                  key={item.historyId}
                  className={`px-5 py-4 ${index < historyItems.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge tone="primary" variant="soft">대출</Badge>
                        <span className="text-xs text-gray-400">{formatDate(item.paymentDate)}</span>
                      </div>
                      <p className="mt-2 truncate text-sm font-medium text-font-main">{item.productName}</p>
                      <p className="mt-1 text-xs text-gray-500">{historyLabel}</p>
                    </div>
                    <span className={`shrink-0 text-sm font-semibold ${isPayout ? 'text-primary-500' : 'text-gray-700'}`}>
                      {amountText}
                    </span>
                  </div>
                </div>
              )
            })}
          </Card>
        ) : null}
      </div>
    </MainLayout>
  )
}

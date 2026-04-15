import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge, Card, SectionHeader } from '../../components/common'
import BottomNavigation from '../../components/layout/BottomNavigation'
import MainLayout from '../../components/layout/MainLayout'
import {
  BOTTOM_NAVIGATION_ITEMS,
  BOTTOM_NAVIGATION_ROUTE_BY_KEY,
} from '../../constants/bottomNavigation'
import { ROUTE_PATHS } from '../../constants/routePaths'
import { getMyFinanceProducts } from '../../services/financeService'
import type { FinanceApplicationStatus, FinanceMyLoan } from '../../types/finance'
import { ShopHeader } from '../shop/components/ShopHeader'
import { formatCurrency, formatDate, formatRate } from '../finance/financeUi'

const isActiveFinanceStatus = (status: FinanceApplicationStatus) => status === 'ACTIVE'

const getInactiveStatusLabel = (status: FinanceApplicationStatus) =>
  status === 'COMPLETE' ? '\uC644\uB8CC\uB428' : '\uB9CC\uB8CC\uB428'

const sortByActiveStatus = <T extends { status: FinanceApplicationStatus }>(items: T[]) =>
  [...items].sort(
    (currentItem, nextItem) =>
      Number(isActiveFinanceStatus(nextItem.status)) -
      Number(isActiveFinanceStatus(currentItem.status)),
  )

export const MyLoanManagePage = () => {
  const navigate = useNavigate()
  const [loans, setLoans] = useState<FinanceMyLoan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const fetchMyLoanProducts = async () => {
      try {
        setIsLoading(true)
        setErrorMessage('')

        const response = await getMyFinanceProducts()
        setLoans(response.loans)
      } catch {
        setErrorMessage('\uB300\uCD9C \uAD00\uB9AC \uC815\uBCF4\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC5B4\uC694. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchMyLoanProducts()
  }, [])

  const handleBottomNavigation = (key: string) => {
    const nextPath =
      BOTTOM_NAVIGATION_ROUTE_BY_KEY[key as keyof typeof BOTTOM_NAVIGATION_ROUTE_BY_KEY]

    if (nextPath) {
      navigate(nextPath)
    }
  }

  const sortedLoans = sortByActiveStatus(loans)

  return (
    <MainLayout
      header={<ShopHeader title={'\uB300\uCD9C \uAD00\uB9AC'} onBack={() => navigate(ROUTE_PATHS.my)} />}
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
            <p className="text-sm text-gray-500">{'\uB300\uCD9C \uAD00\uB9AC \uC815\uBCF4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\uC785\uB2C8\uB2E4.'}</p>
          </Card>
        ) : null}

        {!isLoading && errorMessage ? (
          <Card className="!rounded-control !border-0 !px-5 !py-6 shadow-sm">
            <p className="text-sm text-red-500">{errorMessage}</p>
          </Card>
        ) : null}

        <section className="flex flex-col gap-3">
          <SectionHeader
            title={<span className="text-base font-semibold text-font-main">{'\uB300\uCD9C \uAD00\uB9AC'}</span>}
            right={<span className="text-xs font-medium text-primary-400">{`${loans.length}\uAC74`}</span>}
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
                      <p className="text-[10px] font-medium text-gray-400">{'\uAE08\uB9AC'}</p>
                      <p className="mt-1 text-[25px] font-bold leading-none text-primary-500">
                        {formatRate(loan.currentRate).replace('\uC5F0 ', '')}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] text-gray-400">{'\uB204\uC801 \uC0C1\uD658\uC561'}</span>
                      <span className="text-[16px] font-semibold text-gray-700">
                        {formatCurrency(loan.paidAmount).replace('\uC6D0', ' \uC6D0')}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1 text-right">
                      <span className="text-[11px] text-gray-400">{'\uC794\uC5EC \uAE08\uC561'}</span>
                      <span className="text-[16px] font-semibold text-primary-500">
                        {formatCurrency(loan.remainingAmount).replace('\uC6D0', ' \uC6D0')}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <p className="text-[11px] text-gray-400">{'\uC0C1\uD658 \uD68C\uCC28'}</p>
                      <p className="mt-1 text-[12px] font-medium text-gray-600">
                        {`${loan.repaymentCount}\uD68C\uCC28`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-gray-400">{'\uB2E4\uC74C \uC0C1\uD658\uC77C'}</p>
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
              <p className="text-sm text-gray-500">{'\uD604\uC7AC \uC774\uC6A9 \uC911\uC778 \uB300\uCD9C \uC0C1\uD488\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.'}</p>
            </Card>
          ) : null}
        </section>
      </div>
    </MainLayout>
  )
}
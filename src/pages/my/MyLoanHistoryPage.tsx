import { useNavigate } from 'react-router-dom'
import { Badge, Card, SectionHeader } from '../../components/common'
import BottomNavigation from '../../components/layout/BottomNavigation'
import MainLayout from '../../components/layout/MainLayout'
import {
  BOTTOM_NAVIGATION_ITEMS,
  BOTTOM_NAVIGATION_ROUTE_BY_KEY,
} from '../../constants/bottomNavigation'
import { ROUTE_PATHS } from '../../constants/routePaths'
import { loanHistoryItems } from './financeHistoryData'
import { ShopHeader } from '../shop/components/ShopHeader'

export const MyLoanHistoryPage = () => {
  const navigate = useNavigate()

  const handleBottomNavigation = (key: string) => {
    const nextPath =
      BOTTOM_NAVIGATION_ROUTE_BY_KEY[key as keyof typeof BOTTOM_NAVIGATION_ROUTE_BY_KEY]

    if (nextPath) {
      navigate(nextPath)
    }
  }

  return (
    <MainLayout
      header={<ShopHeader title="내 대출 이력" onBack={() => navigate(ROUTE_PATHS.myFinance)} />}
      nav={
        <BottomNavigation
          items={BOTTOM_NAVIGATION_ITEMS}
          value="my"
          onChange={handleBottomNavigation}
        />
      }
      className="bg-bg-light"
    >
      <div className="mt-5 flex flex-col gap-3">
        <SectionHeader
          title={<span className="text-base font-semibold text-font-main">최근 거래 내역</span>}
          right={<span className="text-xs font-medium text-primary-400">{loanHistoryItems.length}건</span>}
        />

        <Card className="!gap-0 !rounded-control !border-0 !p-0 shadow-sm">
          {loanHistoryItems.map((item, index) => (
            <div
              key={item.id}
              className={`px-5 py-4 ${index < loanHistoryItems.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge tone="primary" variant="soft">{item.category}</Badge>
                    <span className="text-xs text-gray-400">{item.date}</span>
                  </div>
                  <p className="mt-2 truncate text-sm font-medium text-font-main">{item.title}</p>
                  <p className="mt-1 text-xs text-gray-500">{item.status}</p>
                </div>
                <span className={`shrink-0 text-sm font-semibold ${item.amount.startsWith('+') ? 'text-primary-500' : 'text-gray-700'}`}>
                  {item.amount}
                </span>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </MainLayout>
  )
}

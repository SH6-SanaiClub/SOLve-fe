import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Icons, SectionHeader } from '../../components/common'
import BottomNavigation from '../../components/layout/BottomNavigation'
import MainLayout from '../../components/layout/MainLayout'
import {
  BOTTOM_NAVIGATION_ITEMS,
  BOTTOM_NAVIGATION_ROUTE_BY_KEY,
} from '../../constants/bottomNavigation'
import { ROUTE_PATHS } from '../../constants/routePaths'
import { getMyPointHistories, getMyPointSummary } from '../../services/myPointService'
import type { MyPointHistoryItem } from '../../types/myPoint'
import { ShopHeader } from '../shop/components/ShopHeader'

const numberFormatter = new Intl.NumberFormat('ko-KR')

const pointSummary = {
  guide: '적립과 사용 내역을 한눈에 확인할 수 있어요',
}

const formatPointAmount = (amount: number) => {
  const sign = amount > 0 ? '+' : ''
  return `${sign}${numberFormatter.format(amount)}P`
}

const getPointAmountClassName = (amount: number) =>
  amount > 0 ? 'text-primary-500' : 'text-gray-600'

const formatHistoryDate = (createdAt: string) => {
  const date = new Date(createdAt)

  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(
    date.getDate(),
  ).padStart(2, '0')}`
}

const groupHistoriesByDate = (histories: MyPointHistoryItem[]) => {
  const grouped = new Map<string, MyPointHistoryItem[]>()

  histories.forEach((history) => {
    const date = formatHistoryDate(history.createdAt)
    const currentGroup = grouped.get(date)

    if (currentGroup) {
      currentGroup.push(history)
      return
    }

    grouped.set(date, [history])
  })

  return Array.from(grouped.entries()).map(([date, items]) => ({
    date,
    items,
  }))
}

export const MyPointManagePage = () => {
  const navigate = useNavigate()
  const [totalPoints, setTotalPoints] = useState(0)
  const [histories, setHistories] = useState<MyPointHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPointData = async () => {
      setIsLoading(true)
      setError('')

      try {
        const [summaryResponse, historiesResponse] = await Promise.all([
          getMyPointSummary(),
          getMyPointHistories(),
        ])

        setTotalPoints(summaryResponse.totalPoints)
        setHistories(historiesResponse.histories)
      } catch (fetchError) {
        console.error(fetchError)
        setError('포인트 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchPointData()
  }, [])

  const handleBottomNavigation = (key: string) => {
    const nextPath =
      BOTTOM_NAVIGATION_ROUTE_BY_KEY[key as keyof typeof BOTTOM_NAVIGATION_ROUTE_BY_KEY]

    if (nextPath) {
      navigate(nextPath)
    }
  }

  const groupedHistories = groupHistoriesByDate(histories)

  return (
    <MainLayout
      header={<ShopHeader title="포인트 관리" onBack={() => navigate(ROUTE_PATHS.my)} />}
      nav={
        <BottomNavigation
          items={BOTTOM_NAVIGATION_ITEMS}
          value="my"
          onChange={handleBottomNavigation}
        />
      }
      className="bg-bg-light"
    >
      <section className="mt-2 flex flex-col gap-5">
        <Card className="mt-3 !gap-3">
          <div className="space-y-2">
            <p className="text-sm font-medium text-font-sub">현재 보유 포인트</p>
            <p className="text-[34px] leading-none font-semibold tracking-tight text-font-main">
              {numberFormatter.format(totalPoints)}
              <span className="ml-1 text-[20px] font-semibold text-font-sub">P</span>
            </p>
          </div>

          <p className="text-sm leading-6 text-font-sub mt-2">{pointSummary.guide}</p>
        </Card>

        <Card
          className="!gap-0 !border-primary-100  !p-0"
          onClick={() => navigate(ROUTE_PATHS.shopHistory)}
        >
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-font-main">상품 구매 내역</p>
              <p className="mt-1 text-xs text-font-sub">포인트로 구매한 상품들을 확인해보세요</p>
            </div>

            <Icons.ArrowRight className="shrink-0 text-gray-400" size={20} />
          </div>
        </Card>

        <section className="flex flex-col gap-3 mt-4">
          <SectionHeader title="포인트 내역 (최근 30일)" className='ml-0.5'/>

          {isLoading ? (
            <Card className="items-center !rounded-control !p-4 text-center">
              <span className="text-sm font-medium text-font-sub">
                포인트 내역을 불러오는 중입니다.
              </span>
            </Card>
          ) : error ? (
            <Card className="items-center !rounded-control !p-4 text-center">
              <span className="text-sm font-medium text-font-sub">{error}</span>
            </Card>
          ) : groupedHistories.length > 0 ? (
            <div className="flex flex-col gap-4">
              {groupedHistories.map((group) => (
                <section key={group.date} className="flex flex-col gap-2">
                  <p className="px-1 text-xs font-medium tracking-[0.02em] text-font-sub">
                    {group.date}
                  </p>

                  <Card className="!gap-0 !p-0">
                    {group.items.map((item, index) => (
                      <div
                        key={item.userPointId}
                        className={`flex items-center justify-between gap-4 px-5 py-4 ${
                          index < group.items.length - 1 ? 'border-b border-gray-100' : ''
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-font-main">
                            {item.title}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 text-sm font-semibold ${getPointAmountClassName(item.changedAmount)}`}
                        >
                          {formatPointAmount(item.changedAmount)}
                        </span>
                      </div>
                    ))}
                  </Card>
                </section>
              ))}
            </div>
          ) : (
            <Card className="items-center !rounded-control !p-4 text-center">
              <span className="text-sm font-medium text-font-sub">
                포인트 내역이 없습니다.
              </span>
            </Card>
          )}
        </section>
      </section>
    </MainLayout>
  )
}

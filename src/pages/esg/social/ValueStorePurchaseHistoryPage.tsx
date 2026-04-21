import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge, Card } from '../../../components/common'
import { PageMotionStyles, buildPageEnterStyle } from '../../../components/common/PageMotion'
import BottomNavigation from '../../../components/layout/BottomNavigation'
import MainLayout from '../../../components/layout/MainLayout'
import {
  BOTTOM_NAVIGATION_ITEMS,
  BOTTOM_NAVIGATION_ROUTE_BY_KEY,
} from '../../../constants/bottomNavigation'
import {
  ROUTE_PATHS,
  getValueStoreProductDetailPath,
} from '../../../constants/routePaths'
import { getValueStorePurchases } from '../../../services/productService'
import type { ValueStorePurchaseHistoryItem } from '../../../types/product'
import { ShopHeader } from '../../shop/components/ShopHeader'

const amountFormatter = new Intl.NumberFormat('ko-KR')

const formatAmount = (amount: number) => `${amountFormatter.format(amount)}원`

const resolveImageUrl = (imageUrl: string) => {
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api'
  const normalizedBaseUrl = baseUrl.endsWith('/')
    ? baseUrl.slice(0, -1)
    : baseUrl
  const normalizedImageUrl = imageUrl.startsWith('/')
    ? imageUrl
    : `/${imageUrl}`

  return `${normalizedBaseUrl}${normalizedImageUrl}`
}

const formatDateGroupLabel = (orderedAt: string) => {
  const date = new Date(orderedAt)

  if (Number.isNaN(date.getTime())) {
    return orderedAt.slice(0, 10).replace(/-/g, '.')
  }

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('.')
}

const formatDateTime = (orderedAt: string) => {
  const date = new Date(orderedAt)

  if (Number.isNaN(date.getTime())) {
    return orderedAt.replace('T', ' ').slice(0, 16)
  }

  const dateLabel = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('.')
  const timeLabel = [
    String(date.getHours()).padStart(2, '0'),
    String(date.getMinutes()).padStart(2, '0'),
  ].join(':')

  return `${dateLabel} ${timeLabel}`
}

export function ValueStorePurchaseHistoryPage() {
  const navigate = useNavigate()
  const [purchases, setPurchases] = useState<ValueStorePurchaseHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const fetchPurchases = async () => {
      setIsLoading(true)
      setError('')

      try {
        const response = await getValueStorePurchases()
        if (!isMounted) {
          return
        }

        const sortedPurchases = [...response.purchases].sort(
          (left, right) =>
            new Date(right.orderedAt).getTime() - new Date(left.orderedAt).getTime(),
        )

        setPurchases(sortedPurchases)
      } catch (fetchError) {
        console.error(fetchError)
        if (!isMounted) {
          return
        }
        setError('가치가게 구매내역을 불러오지 못했어요. 잠시 후 다시 시도해주세요.')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void fetchPurchases()

    return () => {
      isMounted = false
    }
  }, [])

  const groupedPurchases = useMemo(() => {
    const groups = new Map<string, ValueStorePurchaseHistoryItem[]>()

    purchases.forEach((purchase) => {
      const key = formatDateGroupLabel(purchase.orderedAt)
      const current = groups.get(key) ?? []
      current.push(purchase)
      groups.set(key, current)
    })

    return Array.from(groups.entries()).map(([dateLabel, items]) => ({
      dateLabel,
      items,
    }))
  }, [purchases])

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate(ROUTE_PATHS.my)
  }

  const handleBottomNavigation = (key: string) => {
    const nextPath =
      BOTTOM_NAVIGATION_ROUTE_BY_KEY[key as keyof typeof BOTTOM_NAVIGATION_ROUTE_BY_KEY]

    if (nextPath) {
      navigate(nextPath)
    }
  }

  return (
    <MainLayout
      header={<ShopHeader title="가치가게 구매 내역" onBack={handleBack} />}
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
      <section className="flex flex-col gap-4 pt-2">
        {isLoading ? (
          <div className="flex min-h-[240px] flex-col items-center justify-center gap-4 text-center">
            <div
              className="h-10 w-10 animate-spin rounded-full border-[3px] border-gray-200 border-t-primary-400"
              aria-label="구매내역 로딩 중"
            />
            <span className="text-sm font-medium text-font-sub">
              구매내역을 불러오는 중입니다.
            </span>
          </div>
        ) : error ? (
          <Card className="items-center !rounded-control !p-4 text-center">
            <span className="text-sm font-medium text-font-sub">{error}</span>
          </Card>
        ) : groupedPurchases.length > 0 ? (
          groupedPurchases.map((group, groupIndex) => (
            <section
              key={group.dateLabel}
              className="space-y-3"
              style={buildPageEnterStyle(40 + groupIndex * 70, 440)}
            >
              <div className="px-1">
                <h2 className="text-[15px] font-semibold text-font-main">
                  {group.dateLabel}
                </h2>
              </div>

              <div className="space-y-3">
                {group.items.map((purchase, itemIndex) => (
                  <div
                    key={purchase.purchaseId}
                    style={buildPageEnterStyle(90 + groupIndex * 70 + itemIndex * 45, 380)}
                  >
                    <Card
                      className="!gap-0 !overflow-hidden !rounded-control !p-0 cursor-pointer"
                      onClick={() =>
                        navigate(getValueStoreProductDetailPath(purchase.productId))
                      }
                    >
                      <div className="border-b border-gray-100 px-4 py-4">
                        <p className="text-[16px] leading-[120%] font-bold tracking-[-0.02em] text-gray-600">
                          {purchase.storeName}
                        </p>
                      </div>

                      <div className="space-y-4 px-4 py-4">
                        <div className="flex min-w-0 items-start gap-4">
                          <div className="h-[76px] w-[76px] shrink-0 overflow-hidden rounded-[8px] bg-primary-100">
                            <img
                              src={resolveImageUrl(purchase.imageUrl)}
                              alt={purchase.name}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="min-w-0 space-y-[6px]">
                            <Badge
                              tone="primary"
                              className="px-[6px] py-[2px] text-xs font-medium tracking-[-0.02em]"
                            >
                              {purchase.category}
                            </Badge>
                            <h3 className="break-keep text-[16px] leading-[140%] font-semibold text-font-main">
                              {purchase.name}
                            </h3>
                          </div>
                        </div>

                        <div className="space-y-3 rounded-control bg-gray-50 p-4">
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-font-sub">배송지</p>
                            <p className="break-keep text-[15px] leading-[160%] font-normal text-font-main">
                              {purchase.deliveryAddress}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-font-sub">주문일시</p>
                            <p className="text-[15px] leading-[160%] font-normal text-font-main">
                              {formatDateTime(purchase.orderedAt)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-100 px-4 py-4">
                        <p className="text-[16px] leading-[120%] font-semibold tracking-[-0.02em] text-font-main">
                          결제 금액
                        </p>
                        <span className="text-[18px] leading-[120%] font-bold tracking-[-0.02em] text-font-main">
                          {formatAmount(purchase.amount)}
                        </span>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </section>
          ))
        ) : (
          <Card className="items-center !rounded-control !p-4 text-center">
            <span className="text-sm font-medium text-font-sub">
              구매한 가치가게 상품이 아직 없습니다.
            </span>
          </Card>
        )}
      </section>
    </MainLayout>
  )
}

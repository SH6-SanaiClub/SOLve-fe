import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge, Card, InfoRow } from '../../components/common'
import MainLayout from '../../components/layout/MainLayout'
import { ROUTE_PATHS } from '../../constants/routePaths'
import { getPointShopPurchases } from '../../services/pointShopService'
import type { PointShopPurchaseHistoryItem } from '../../types/pointShop'
import { ShopHeader } from './components/ShopHeader'

const pointFormatter = new Intl.NumberFormat('ko-KR')

const formatPoints = (points: number) => `${pointFormatter.format(points)} P`

const formatPurchasedAt = (purchasedAt: string) => {
  const datePart = purchasedAt.slice(0, 10)
  return datePart.replace(/-/g, '.')
}

export const ShopHistoryPage = () => {
  const navigate = useNavigate()
  const [purchases, setPurchases] = useState<PointShopPurchaseHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPurchases = async () => {
      setIsLoading(true)
      setError('')

      try {
        const response = await getPointShopPurchases()
        setPurchases(response.purchases)
      } catch (fetchError) {
        console.error(fetchError)
        setError('구매내역을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchPurchases()
  }, [])

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate(ROUTE_PATHS.shop)
  }

  return (
    <MainLayout header={<ShopHeader title="구매한 상품" onBack={handleBack} />}>
      <div className="flex flex-col gap-[var(--space-4)] pt-[var(--space-2)]">
        {isLoading ? (
          <Card className="items-center !rounded-control !p-[var(--space-4)] text-center">
            <span className="text-sm font-medium text-font-sub">구매내역을 불러오는 중입니다.</span>
          </Card>
        ) : error ? (
          <Card className="items-center !rounded-control !p-[var(--space-4)] text-center">
            <span className="text-sm font-medium text-font-sub">{error}</span>
          </Card>
        ) : purchases.length > 0 ? (
          purchases.map((purchase) => (
            <Card key={purchase.userPointId}>
              <div className="flex items-start justify-between gap-[var(--space-3)]">
                <div className="space-y-[var(--space-2)]">
                  <Badge tone="success" variant="soft">
                    구매 완료
                  </Badge>
                  <h2 className="text-base font-semibold text-font-main">{purchase.itemName}</h2>
                </div>
                <span className="text-sm font-semibold text-font-main">
                  {formatPoints(purchase.usedPoints)}
                </span>
              </div>

              <div className="mt-[var(--space-4)] space-y-3 rounded-control bg-gray-50 p-[var(--space-4)]">
                <InfoRow label="구매 일자" value={formatPurchasedAt(purchase.purchasedAt)} />
                <InfoRow label="교환 코드" value={purchase.exchangeCode ?? '-'} />
              </div>
            </Card>
          ))
        ) : (
          <Card className="items-center !rounded-control !p-[var(--space-4)] text-center">
            <span className="text-sm font-medium text-font-sub">구매한 상품이 아직 없습니다.</span>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}

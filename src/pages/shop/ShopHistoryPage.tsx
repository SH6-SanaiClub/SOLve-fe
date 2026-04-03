import { useNavigate } from 'react-router-dom'
import { Badge, Card, InfoRow } from '../../components/common'
import MainLayout from '../../components/layout/MainLayout'
import { ROUTE_PATHS } from '../../constants/routePaths'
import { ShopHeader } from './components/ShopHeader'
import { purchasedShopProducts } from './shopData'

export const ShopHistoryPage = () => {
  const navigate = useNavigate()

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
        {purchasedShopProducts.length > 0 ? (
          purchasedShopProducts.map((product) => (
            <Card key={product.id}>
              <div className="flex items-start justify-between gap-[var(--space-3)]">
                <div className="space-y-[var(--space-2)]">
                  <Badge tone="success" variant="soft">
                    구매 완료
                  </Badge>
                  <h2 className="text-base font-semibold text-font-main">{product.title}</h2>
                </div>
                <span className="text-sm font-semibold text-font-main">{product.priceLabel}</span>
              </div>

              <div className="mt-[var(--space-4)] space-y-3 rounded-control bg-gray-50 p-[var(--space-4)]">
                <InfoRow label="구매 일자" value={product.purchasedAt ?? '-'} />
                <InfoRow label="교환 코드" value={product.redemptionCode ?? '-'} />
                <InfoRow label="사용처" value={product.vendor} />
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

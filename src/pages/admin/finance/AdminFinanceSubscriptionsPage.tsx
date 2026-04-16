import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Badge, Button, Card } from '../../../components/common'
import { ROUTE_PATHS } from '../../../constants/routePaths'
import {
  getAdminFinancialProductSubscriptions,
  getAdminFinancialProducts,
} from '../../../services/adminApi'
import type {
  AdminFinancialProduct,
  AdminFinancialProductSubscription,
} from '../../../types/admin'
import {
  formatDate,
  formatNumber,
  getApiErrorMessage,
} from '../../../utils/admin'

export const AdminFinanceSubscriptionsPage = () => {
  const navigate = useNavigate()
  const params = useParams<{ productId: string }>()
  const productId = Number(params.productId)
  const [product, setProduct] = useState<AdminFinancialProduct | null>(null)
  const [subscriptions, setSubscriptions] = useState<AdminFinancialProductSubscription[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      if (!Number.isFinite(productId)) {
        setError('유효하지 않은 상품 ID입니다.')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError('')

      try {
        const [products, subscriptionResponse] = await Promise.all([
          getAdminFinancialProducts(),
          getAdminFinancialProductSubscriptions(productId),
        ])

        setProduct(products.find((item) => item.finProductId === productId) ?? null)
        setSubscriptions(subscriptionResponse)
      } catch (fetchError) {
        setError(getApiErrorMessage(fetchError, '가입 현황을 불러오지 못했습니다.'))
      } finally {
        setIsLoading(false)
      }
    }

    void fetchData()
  }, [productId])

  if (isLoading) {
    return (
      <Card className="items-center !py-16 text-center">
        <p className="text-sm font-medium text-font-sub">가입 현황을 불러오는 중입니다.</p>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="items-center gap-4 !py-16 text-center">
        <p className="text-sm font-medium text-error">{error}</p>
        <Button variant="outline" onClick={() => navigate(ROUTE_PATHS.adminFinance)}>
          목록으로
        </Button>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="gap-5 !rounded-[20px] border-border-muted !p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold text-font-main">
                {product?.name ?? '금융 상품'} 가입 현황
              </h2>
              {product ? <Badge tone="primary">{product.type}</Badge> : null}
            </div>
            <p className="mt-2 text-sm text-font-sub">
              {product?.subtitle || '상품별 사용자 가입 내역을 확인합니다.'}
            </p>
          </div>

          <Button variant="outline" onClick={() => navigate(ROUTE_PATHS.adminFinance)}>
            목록으로
          </Button>
        </div>

        {product ? (
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-[18px] bg-primary-50 p-4">
              <p className="text-sm text-font-sub">기본 금리</p>
              <p className="mt-2 text-xl font-bold text-font-main">{product.baseRate}%</p>
            </div>
            <div className="rounded-[18px] border border-border-muted bg-white p-4">
              <p className="text-sm text-font-sub">최대 금리</p>
              <p className="mt-2 text-xl font-bold text-font-main">{product.maxRate}%</p>
            </div>
            <div className="rounded-[18px] border border-border-muted bg-white p-4">
              <p className="text-sm text-font-sub">기간</p>
              <p className="mt-2 text-xl font-bold text-font-main">
                {formatNumber(product.durationMonths)}개월
              </p>
            </div>
            <div className="rounded-[18px] border border-border-muted bg-white p-4">
              <p className="text-sm text-font-sub">가입 건수</p>
              <p className="mt-2 text-xl font-bold text-font-main">
                {formatNumber(subscriptions.length)}
              </p>
            </div>
          </div>
        ) : null}
      </Card>

      <Card className="gap-0 overflow-hidden !rounded-[20px] border-border-muted !p-0">
        {subscriptions.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm font-medium text-font-sub">
            현재 가입 내역이 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-50">
                <tr className="text-left text-sm text-font-sub">
                  <th className="px-5 py-4 font-medium">아이디</th>
                  <th className="px-5 py-4 font-medium">이름</th>
                  <th className="px-5 py-4 font-medium">유형</th>
                  <th className="px-5 py-4 font-medium">금액</th>
                  <th className="px-5 py-4 font-medium">적용 금리</th>
                  <th className="px-5 py-4 font-medium">상태</th>
                  <th className="px-5 py-4 font-medium">시작일</th>
                  <th className="px-5 py-4 font-medium">만기/다음 납입일</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((subscription) => (
                  <tr
                    key={`${subscription.userId}-${subscription.startDate}`}
                    className="border-t border-border-muted text-sm"
                  >
                    <td className="px-5 py-4 text-font-main">{subscription.loginId}</td>
                    <td className="px-5 py-4 text-font-main">{subscription.name}</td>
                    <td className="px-5 py-4 text-font-main">{subscription.type}</td>
                    <td className="px-5 py-4 text-font-main">
                      {formatNumber(subscription.amount)}원
                    </td>
                    <td className="px-5 py-4 text-font-main">
                      {subscription.currentRate}%
                    </td>
                    <td className="px-5 py-4 text-font-main">{subscription.status}</td>
                    <td className="px-5 py-4 text-font-sub">
                      {formatDate(subscription.startDate)}
                    </td>
                    <td className="px-5 py-4 text-font-sub">
                      {formatDate(
                        subscription.maturityDate ?? subscription.nextRepaymentDate,
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

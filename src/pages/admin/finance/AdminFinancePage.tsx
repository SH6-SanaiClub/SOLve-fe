import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge, Button, Card } from '../../../components/common'
import {
  getAdminFinanceFormPath,
  getAdminFinanceSubscriptionsPath,
} from '../../../constants/routePaths'
import {
  getAdminFinancialProducts,
  toggleFinancialProductStatus,
} from '../../../services/adminApi'
import type { AdminFinancialProduct } from '../../../types/admin'
import {
  formatDateTime,
  formatNumber,
  getApiErrorMessage,
} from '../../../utils/admin'

export const AdminFinancePage = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState<AdminFinancialProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchProducts = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await getAdminFinancialProducts()
      setProducts(response)
    } catch (fetchError) {
      setError(getApiErrorMessage(fetchError, '금융 상품 목록을 불러오지 못했습니다.'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchProducts()
  }, [])

  const handleToggleStatus = async (product: AdminFinancialProduct) => {
    try {
      await toggleFinancialProductStatus(product.finProductId, !product.isActive)
      await fetchProducts()
    } catch (submitError) {
      alert(getApiErrorMessage(submitError, '상품 상태 변경에 실패했습니다.'))
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="gap-5 !rounded-[20px] border-border-muted !p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-font-main">금융 상품 관리</h2>
            <p className="mt-1 text-sm text-font-sub">
              대출/적금 상품 등록, 수정, 상태 변경과 가입 현황 조회를 지원합니다.
            </p>
          </div>

          <Button onClick={() => navigate(getAdminFinanceFormPath({ mode: 'create' }))}>
            상품 등록
          </Button>
        </div>
      </Card>

      <Card className="gap-0 overflow-hidden !rounded-[20px] border-border-muted !p-0">
        {isLoading ? (
          <div className="px-6 py-16 text-center text-sm font-medium text-font-sub">
            금융 상품 목록을 불러오는 중입니다.
          </div>
        ) : error ? (
          <div className="px-6 py-16 text-center text-sm font-medium text-error">{error}</div>
        ) : products.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm font-medium text-font-sub">
            등록된 금융 상품이 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-50">
                <tr className="text-left text-sm text-font-sub">
                  <th className="px-5 py-4 font-medium">상품명</th>
                  <th className="w-[110px] px-5 py-4 font-medium whitespace-nowrap">유형</th>
                  <th className="w-[120px] px-5 py-4 font-medium whitespace-nowrap">기본 금리</th>
                  <th className="w-[120px] px-5 py-4 font-medium whitespace-nowrap">최대 금리</th>
                  <th className="w-[110px] px-5 py-4 font-medium whitespace-nowrap">가입자 수</th>
                  <th className="w-[110px] px-5 py-4 font-medium text-center whitespace-nowrap">상태</th>
                  <th className="w-[170px] px-5 py-4 font-medium whitespace-nowrap">수정일</th>
                  <th className="w-[240px] px-5 py-4 font-medium text-center whitespace-nowrap">액션</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const subscriptionCount =
                    product.type === 'LOAN'
                      ? product.activeLoanCount
                      : product.activeSavingCount

                  return (
                    <tr
                      key={product.finProductId}
                      className="border-t border-border-muted text-sm"
                    >
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-font-main">{product.name}</p>
                          <p className="mt-1 text-xs text-font-sub">{product.subtitle || '-'}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-font-main whitespace-nowrap">{product.type}</td>
                      <td className="px-5 py-4 text-font-main whitespace-nowrap">{product.baseRate}%</td>
                      <td className="px-5 py-4 text-font-main whitespace-nowrap">{product.maxRate}%</td>
                      <td className="px-5 py-4 text-font-main whitespace-nowrap">
                        {formatNumber(subscriptionCount)}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <Badge
                          tone={product.isActive ? 'success' : 'neutral'}
                          className="w-[56px] justify-center whitespace-nowrap"
                        >
                          {product.isActive ? '활성' : '비활성'}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-font-sub whitespace-nowrap">
                        {formatDateTime(product.updatedAt)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-nowrap justify-center gap-2 whitespace-nowrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigate(
                                getAdminFinanceSubscriptionsPath(product.finProductId),
                              )
                            }
                          >
                            가입 현황
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigate(
                                getAdminFinanceFormPath({
                                  mode: 'edit',
                                  id: product.finProductId,
                                }),
                              )
                            }
                          >
                            수정
                          </Button>
                          <Button
                            variant="gray"
                            size="sm"
                            onClick={() => void handleToggleStatus(product)}
                          >
                            {product.isActive ? '비활성' : '활성'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

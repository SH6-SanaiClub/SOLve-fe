import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge, Button, Card } from '../../../components/common'
import { getAdminShopFormPath } from '../../../constants/routePaths'
import {
  deleteItem,
  getAdminItems,
  toggleItemStatus,
} from '../../../services/adminApi'
import type { AdminItem } from '../../../types/admin'
import {
  formatDateTime,
  formatNumber,
  getApiErrorMessage,
} from '../../../utils/admin'

export const AdminShopPage = () => {
  const navigate = useNavigate()
  const [items, setItems] = useState<AdminItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchItems = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await getAdminItems()
      setItems(response)
    } catch (fetchError) {
      setError(getApiErrorMessage(fetchError, '포인트샵 상품을 불러오지 못했습니다.'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchItems()
  }, [])

  const handleToggleStatus = async (item: AdminItem) => {
    try {
      await toggleItemStatus(item.itemId, !item.isActive)
      await fetchItems()
    } catch (submitError) {
      alert(getApiErrorMessage(submitError, '상태 변경에 실패했습니다.'))
    }
  }

  const handleDelete = async (itemId: number) => {
    if (!window.confirm('이 포인트샵 상품을 삭제하시겠습니까?')) {
      return
    }

    try {
      await deleteItem(itemId)
      await fetchItems()
      alert('포인트샵 상품을 삭제했습니다.')
    } catch (submitError) {
      alert(getApiErrorMessage(submitError, '상품 삭제에 실패했습니다.'))
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="gap-5 !rounded-[20px] border-border-muted !p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-font-main">포인트샵 상품 관리</h2>
            <p className="mt-1 text-sm text-font-sub">
              아이템 등록, 수정, 활성화, 삭제를 관리합니다.
            </p>
          </div>

          <Button onClick={() => navigate(getAdminShopFormPath({ mode: 'create' }))}>
            상품 등록
          </Button>
        </div>
      </Card>

      <Card className="gap-0 overflow-hidden !rounded-[20px] border-border-muted !p-0">
        {isLoading ? (
          <div className="px-6 py-16 text-center text-sm font-medium text-font-sub">
            포인트샵 상품을 불러오는 중입니다.
          </div>
        ) : error ? (
          <div className="px-6 py-16 text-center text-sm font-medium text-error">{error}</div>
        ) : items.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm font-medium text-font-sub">
            등록된 포인트샵 상품이 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-50">
                <tr className="text-left text-sm text-font-sub">
                  <th className="px-5 py-4 font-medium">상품명</th>
                  <th className="px-5 py-4 font-medium">카테고리</th>
                  <th className="px-5 py-4 font-medium">필요 포인트</th>
                  <th className="px-5 py-4 font-medium">재고</th>
                  <th className="px-5 py-4 font-medium">교환 이력</th>
                  <th className="px-5 py-4 font-medium">상태</th>
                  <th className="px-5 py-4 font-medium">수정일</th>
                  <th className="px-5 py-4 font-medium">액션</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.itemId} className="border-t border-border-muted text-sm">
                    <td className="px-5 py-4 font-medium text-font-main">{item.name}</td>
                    <td className="px-5 py-4 text-font-main">{item.category}</td>
                    <td className="px-5 py-4 text-font-main">
                      {formatNumber(item.requiredPoints)}P
                    </td>
                    <td className="px-5 py-4 text-font-main">{formatNumber(item.stock)}</td>
                    <td className="px-5 py-4 text-font-main">
                      {formatNumber(item.exchangeCount)}
                    </td>
                    <td className="px-5 py-4">
                      <Badge tone={item.isActive ? 'success' : 'neutral'}>
                        {item.isActive ? '활성' : '비활성'}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-font-sub">{formatDateTime(item.updatedAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(
                              getAdminShopFormPath({ mode: 'edit', id: item.itemId }),
                            )
                          }
                        >
                          수정
                        </Button>
                        <Button
                          variant="gray"
                          size="sm"
                          onClick={() => void handleToggleStatus(item)}
                        >
                          {item.isActive ? '비활성' : '활성'}
                        </Button>
                        <Button
                          variant="gray"
                          size="sm"
                          onClick={() => void handleDelete(item.itemId)}
                        >
                          삭제
                        </Button>
                      </div>
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

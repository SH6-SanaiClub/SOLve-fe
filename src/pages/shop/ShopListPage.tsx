import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, SectionHeader } from '../../components/common'
import BottomNavigation from '../../components/layout/BottomNavigation'
import MainLayout from '../../components/layout/MainLayout'
import {
  BOTTOM_NAVIGATION_ITEMS,
  BOTTOM_NAVIGATION_ROUTE_BY_KEY,
} from '../../constants/bottomNavigation'
import { ROUTE_PATHS, getShopDetailPath } from '../../constants/routePaths'
import { getPointShopItems } from '../../services/pointShopService'
import type { PointShopItem } from '../../types/pointShop'
import { ShopHeader } from './components/ShopHeader'
import { ShopProductCard } from './components/ShopProductCard'
import { ShopTabs } from './components/ShopTabs'
import { usePointShopSummary } from './hooks/usePointShopSummary'
import { shopTabs, type ShopCategoryValue } from './shopData'

const numberFormatter = new Intl.NumberFormat('ko-KR')

const formatPoints = (points: number) => `${numberFormatter.format(points)}P`

const getPlaceholderLabel = (name: string) => {
  const [firstToken] = name.trim().split(/\s+/)
  return firstToken || 'ITEM'
}

const getCategoryLabel = (category: string) => {
  if (category === 'certificate') {
    return '자격증'
  }
  if (category === 'education') {
    return '교육'
  }
  if (category === 'etc') {
    return '기타'
  }
  return category
}

export const ShopListPage = () => {
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState<ShopCategoryValue>('all')
  const [items, setItems] = useState<PointShopItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const { totalPoints } = usePointShopSummary()

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true)
      setError('')

      try {
        const response = await getPointShopItems()
        setItems(response.items)
      } catch (fetchError) {
        console.error(fetchError)
        setError('포인트샵 상품 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchItems()
  }, [])

  const formattedPoints = formatPoints(totalPoints)
  const visibleProducts =
    selectedTab === 'all'
      ? items
      : items.filter((item) => item.category === selectedTab)

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

    navigate(ROUTE_PATHS.home)
  }

  return (
    <MainLayout
      header={
        <ShopHeader
          title="포인트샵"
          onBack={handleBack}
          right={
            <button
              type="button"
              onClick={() => navigate(ROUTE_PATHS.shopHistory)}
              className="text-sm font-medium text-primary-500"
            >
              구매한 상품
            </button>
          }
        />
      }
      nav={
        <BottomNavigation
          items={BOTTOM_NAVIGATION_ITEMS}
          value="shop"
          onChange={handleBottomNavigation}
        />
      }
      subHeader={<ShopTabs items={shopTabs} value={selectedTab} onChange={setSelectedTab} />}
      contentSpacing="comfortable"
    >
      <div className="-mx-4 flex flex-col gap-[var(--space-4)]">
        <div className="flex flex-col gap-[var(--space-4)] bg-bg-light px-(--side-padding) pb-[var(--space-4)]">
          <SectionHeader
            title={<span className="text-lg font-semibold text-gray-700">상품 목록</span>}
            right={
              <div className="flex shrink-0 items-center gap-[var(--space-2)] whitespace-nowrap">
                <span className="text-sm font-medium text-gray-500">보유 포인트</span>
                <span className="text-base font-semibold text-gray-700">{formattedPoints}</span>
              </div>
            }
          />

          {isLoading ? (
            <Card className="items-center !rounded-control !p-[var(--space-4)] text-center">
              <span className="text-sm font-medium text-font-sub">
                상품 목록을 불러오는 중입니다.
              </span>
            </Card>
          ) : error ? (
            <Card className="items-center !rounded-control !p-[var(--space-4)] text-center">
              <span className="text-sm font-medium text-font-sub">{error}</span>
            </Card>
          ) : visibleProducts.length > 0 ? (
            <div className="grid auto-rows-fr grid-cols-2 gap-[var(--space-3)]">
              {visibleProducts.map((item) => (
                <ShopProductCard
                  key={item.itemId}
                  title={item.name}
                  priceLabel={formatPoints(item.requiredPoints)}
                  imageSrc={item.imageUrl ?? undefined}
                  placeholderLabel={getPlaceholderLabel(item.name)}
                  placeholderSubLabel={getCategoryLabel(item.category)}
                  onClick={() => navigate(getShopDetailPath(String(item.itemId)))}
                />
              ))}
            </div>
          ) : (
            <Card className="items-center !rounded-control !p-[var(--space-4)] text-center">
              <span className="text-sm font-medium text-gray-400">
                선택한 카테고리에 등록된 상품이 없습니다.
              </span>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

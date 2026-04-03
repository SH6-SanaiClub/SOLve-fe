import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, SectionHeader } from '../../components/common'
import BottomNavigation from '../../components/layout/BottomNavigation'
import MainLayout from '../../components/layout/MainLayout'
import {
  BOTTOM_NAVIGATION_ITEMS,
  BOTTOM_NAVIGATION_ROUTE_BY_KEY,
} from '../../constants/bottomNavigation'
import { ROUTE_PATHS, getShopDetailPath } from '../../constants/routePaths'
import { useAuth } from '../../hooks/useAuth'
import { ShopHeader } from './components/ShopHeader'
import { ShopProductCard } from './components/ShopProductCard'
import { ShopTabs } from './components/ShopTabs'
import {
  fallbackPointBalance,
  shopProducts,
  shopTabs,
  type ShopCategoryValue,
} from './shopData'

const numberFormatter = new Intl.NumberFormat('ko-KR')

export const ShopListPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [selectedTab, setSelectedTab] = useState<ShopCategoryValue>('all')

  const totalPoints = user?.totalPoints ?? fallbackPointBalance
  const formattedPoints = `${numberFormatter.format(totalPoints)}P`
  const visibleProducts =
    selectedTab === 'all'
      ? shopProducts
      : shopProducts.filter((product) => product.category === selectedTab)

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
              구매 내역
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
    >
      <div className="-mx-4 flex flex-col gap-[var(--space-4)]">
        <ShopTabs items={shopTabs} value={selectedTab} onChange={setSelectedTab} />

        <div className="flex flex-col gap-[var(--space-4)] bg-bg-light px-(--side-padding) pb-[var(--space-4)]">
          <SectionHeader
            className="py-[var(--space-1)]"
            title={<span className="text-lg font-semibold text-gray-700">상품 목록</span>}
            right={
              <div className="flex shrink-0 items-center gap-[var(--space-2)] whitespace-nowrap">
                <span className="text-sm font-medium text-gray-500">보유 포인트</span>
                <span className="text-base font-semibold text-gray-700">{formattedPoints}</span>
              </div>
            }
          />

          {visibleProducts.length > 0 ? (
            <div className="grid auto-rows-fr grid-cols-2 gap-[var(--space-3)]">
              {visibleProducts.map((product) => (
                <ShopProductCard
                  key={product.id}
                  title={product.title}
                  priceLabel={product.priceLabel}
                  imageSrc={product.imageSrc}
                  imageAlt={product.imageAlt}
                  mediaBackgroundClassName={product.mediaBackgroundClassName}
                  mediaTextClassName={product.mediaTextClassName}
                  placeholderLabel={product.placeholderLabel}
                  placeholderSubLabel={product.placeholderSubLabel}
                  onClick={() => navigate(getShopDetailPath(product.id))}
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

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, IconButton } from '../../components/common'
import { Icons } from '../../components/common'
import BottomNavigation from '../../components/layout/BottomNavigation'
import Header from '../../components/layout/Header'
import MainLayout from '../../components/layout/MainLayout'
import { getValueStoreProductDetailPath, ROUTE_PATHS } from '../../constants/routePaths'
import { getValueStoreProducts } from '../../services/productService'
import type { ValueStoreProductListResponse } from '../../types/product'
import { SocialActivityTabs } from './components/SocialActivityTabs'
import { ValueStoreProductCard } from './components/ValueStoreProductCard'

export function ValueStorePage() {
  const navigate = useNavigate()
  const [productData, setProductData] = useState<ValueStoreProductListResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchProducts = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await getValueStoreProducts()
      setProductData(response)
    } catch (fetchError) {
      console.error(fetchError)
      setError('가치가게 상품 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchProducts()
  }, [])

  const handleBack = () => {
    navigate(ROUTE_PATHS.home)
  }

  const handleBottomNavigation = (key: string) => {
    if (key === 'home') {
      navigate(ROUTE_PATHS.home)
      return
    }

    if (key === 'finance') {
      navigate(ROUTE_PATHS.finance)
      return
    }

    if (key === 'mypage') {
      navigate(ROUTE_PATHS.my)
    }
  }

  return (
    <MainLayout
      header={
        <Header
          left={
            <IconButton label="뒤로가기" icon={<Icons.Back className="text-font-main" />} onClick={handleBack} />
          }
          title="S 활동"
        />
      }
      nav={<BottomNavigation value="home" onChange={handleBottomNavigation} />}
    >
      <SocialActivityTabs activeTab="store" />

      {isLoading ? (
        <div className="flex flex-col gap-6">
          <section className="space-y-4 pt-2">
            <div className="flex items-center justify-between px-3">
              <div className="h-5 w-28 animate-pulse rounded-full bg-gray-300" />
              <div className="h-4 w-20 animate-pulse rounded-full bg-primary-100" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="overflow-hidden rounded-control bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                  <div className="h-[159px] animate-pulse bg-primary-100" />
                  <div className="space-y-3 px-3 py-[14px]">
                    <div className="h-4 w-4/5 animate-pulse rounded-full bg-gray-300" />
                    <div className="h-5 w-1/2 animate-pulse rounded-full bg-gray-300" />
                    <div className="flex gap-1">
                      <div className="h-6 w-12 animate-pulse rounded-badge bg-primary-50" />
                      <div className="h-6 w-16 animate-pulse rounded-badge bg-gray-100" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : null}

      {!isLoading && error ? (
        <section className="pt-2">
          <div className="rounded-card border border-red-100 bg-red-50 px-5 py-6 text-center shadow-card">
            <h2 className="text-lg font-semibold text-font-main">가치가게 상품을 불러오지 못했어요</h2>
            <p className="mt-2 text-sm leading-6 text-font-sub">{error}</p>
            <Button className="mt-5" onClick={() => void fetchProducts()}>
              다시 시도
            </Button>
          </div>
        </section>
      ) : null}

      {!isLoading && !error && productData ? (
        <div className="flex flex-col gap-6 pt-2">
          <section className="space-y-4">
            <div className="flex items-center justify-between px-3">
              <h2 className="text-lg leading-[120%] font-semibold text-gray-700">판매중인 상품</h2>
              <span className="text-sm leading-[120%] font-medium text-primary-400">
                {productData.products.length}개의 제품
              </span>
            </div>

            {productData.products.length === 0 ? (
              <Card className="border-dashed bg-gray-50 px-5 py-10 text-center shadow-none">
                <p className="text-lg font-semibold text-font-main">등록된 가치가게 상품이 없어요</p>
                <p className="mt-2 text-sm leading-6 text-font-sub">
                  새로운 상품이 준비되면 이곳에서 바로 확인할 수 있어요.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {productData.products.map((product) => (
                  <ValueStoreProductCard
                    key={product.productId}
                    product={product}
                    onClick={(productId) => navigate(getValueStoreProductDetailPath(productId))}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      ) : null}
    </MainLayout>
  )
}

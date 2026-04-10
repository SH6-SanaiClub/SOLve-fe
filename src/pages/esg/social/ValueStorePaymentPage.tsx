import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, IconButton } from '../../../components/common'
import { Icons } from '../../../components/common'
import Header from '../../../components/layout/Header'
import MainLayout from '../../../components/layout/MainLayout'
import {
  ROUTE_PATHS,
  getValueStoreProductDetailPath,
} from '../../../constants/routePaths'
import { getValueStoreProductDetail } from '../../../services/productService'
import type { ValueStoreProductDetail } from '../../../types/product'

const formatPrice = (price: number) =>
  `${new Intl.NumberFormat('ko-KR').format(price)}원`

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

  if (
    normalizedBaseUrl.startsWith('http://') ||
    normalizedBaseUrl.startsWith('https://')
  ) {
    return `${normalizedBaseUrl}${normalizedImageUrl}`
  }

  return normalizedImageUrl
}

export function ValueStorePaymentPage() {
  const navigate = useNavigate()
  const { productId } = useParams()
  const parsedProductId = Number(productId)
  const [productDetail, setProductDetail] = useState<ValueStoreProductDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchProductDetail = useCallback(async () => {
    if (!Number.isInteger(parsedProductId) || parsedProductId <= 0) {
      setProductDetail(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    try {
      const response = await getValueStoreProductDetail(parsedProductId)
      setProductDetail(response)
    } catch (error) {
      console.error(error)
      setProductDetail(null)
    } finally {
      setIsLoading(false)
    }
  }, [parsedProductId])

  useEffect(() => {
    void fetchProductDetail()
  }, [fetchProductDetail])

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    if (productId) {
      navigate(getValueStoreProductDetailPath(productId))
      return
    }

    navigate(ROUTE_PATHS.activitySocialStore)
  }

  return (
    <MainLayout
      header={
        <Header
          left={
            <IconButton
              label="뒤로가기"
              icon={<Icons.Back className="text-font-main" />}
              onClick={handleBack}
            />
          }
          title="가치가게"
        />
      }
      className="bg-gray-50"
    >
      <section className="mx-[-16px] min-h-[calc(100vh-var(--header-h)-48px)] bg-gray-50 px-[21px] pt-6 pb-[128px]">
        {isLoading ? (
          <Card className="rounded-control !p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-6">
              <div className="h-[112px] w-[104px] animate-pulse rounded-control bg-primary-100" />
              <div className="flex flex-1 flex-col gap-4">
                <div className="h-7 w-3/4 animate-pulse rounded-full bg-gray-200" />
                <div className="h-7 w-1/2 animate-pulse rounded-full bg-gray-300" />
              </div>
            </div>
          </Card>
        ) : productDetail ? (
          <Card className="rounded-control !p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-6">
              <div className="h-[112px] w-[104px] overflow-hidden rounded-[8px] bg-primary-100">
                <img
                  src={resolveImageUrl(productDetail.imageUrl)}
                  alt={productDetail.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-4">
                <h2 className="text-[16px] leading-[120%] font-medium tracking-[-0.02em] text-font-sub">
                  {productDetail.name}
                </h2>
                <p className="text-[18px] leading-[120%] font-medium tracking-[-0.02em] text-font-main">
                  {formatPrice(productDetail.price)}
                </p>
              </div>
            </div>
          </Card>
        ) : null}
      </section>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50">
        <section className="pointer-events-auto mx-auto w-full max-w-[600px] bg-white">
          <div className="flex items-center justify-between px-5 pt-[10px] pb-[5px]">
            <p className="text-[16px] leading-4 font-normal text-font-sub">
              최종 결제 금액
            </p>
            <p className="text-[20px] leading-4 font-bold text-primary-500">
              {formatPrice(productDetail?.price ?? 0)}
            </p>
          </div>

          <div className="px-5 pt-[15px] pb-[calc(20px+env(safe-area-inset-bottom))]">
            <Button fullWidth>
              구매하기
            </Button>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}

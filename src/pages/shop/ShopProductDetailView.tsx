import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../components/common'
import { ROUTE_PATHS } from '../../constants/routePaths'
import { getPointShopItemDetail, purchasePointShopItem } from '../../services/pointShopService'
import type { PointShopItemDetail } from '../../types/pointShop'
import { PageScaffold } from '../PageScaffold'
import { ShopPurchaseCompleteView } from './components/ShopPurchaseCompleteView'
import { ShopHeader } from './components/ShopHeader'
import { ShopPurchaseConfirmModal } from './components/ShopPurchaseConfirmModal'
import { usePointShopSummary } from './hooks/usePointShopSummary'

const pointFormatter = new Intl.NumberFormat('ko-KR')

const formatPoints = (points: number) => `${pointFormatter.format(points)} P`

const resolveImageUrl = (imageUrl?: string | null) => {
  if (!imageUrl) {
    return undefined
  }

  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }

  return imageUrl
}

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

export const ShopProductDetailView = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const parsedItemId = Number(id)
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)
  const [isPurchaseComplete, setIsPurchaseComplete] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [shopProduct, setShopProduct] = useState<PointShopItemDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const { totalPoints } = usePointShopSummary()
  const [currentPoints, setCurrentPoints] = useState(0)

  useEffect(() => {
    if (!isPurchaseComplete) {
      setCurrentPoints(totalPoints)
    }
  }, [isPurchaseComplete, totalPoints])

  useEffect(() => {
    const fetchItem = async () => {
      if (!Number.isInteger(parsedItemId) || parsedItemId <= 0) {
        setShopProduct(null)
        setError('올바른 상품 정보를 찾을 수 없습니다.')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError('')

      try {
        const response = await getPointShopItemDetail(parsedItemId)
        setShopProduct(response)
      } catch (fetchError) {
        console.error(fetchError)
        setShopProduct(null)
        setError('상품 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchItem()
  }, [parsedItemId])

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate(ROUTE_PATHS.shop)
  }

  if (isLoading) {
    return (
      <div className="relative mx-auto flex min-h-screen w-full max-w-[600px] flex-col bg-gray-50 font-pretendard shadow-[var(--shadow-card)]">
        <ShopHeader title="포인트샵" onBack={handleBack} />
        <main className="flex-1 bg-gray-50 pt-(--header-h)">
          <div className="flex min-h-full items-center justify-center px-(--side-padding) pb-[calc(104px+env(safe-area-inset-bottom))]">
            <p className="text-sm font-medium text-font-sub">상품 정보를 불러오는 중입니다.</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return <PageScaffold title="상품 정보를 불러오지 못했어요" description={error} />
  }

  if (!shopProduct) {
    return (
      <PageScaffold
        title="상품 정보를 찾을 수 없어요"
        description="존재하지 않거나 더 이상 노출되지 않는 상품입니다."
      />
    )
  }

  if (isPurchaseComplete) {
    return (
      <ShopPurchaseCompleteView
        productName={shopProduct.name}
        onBack={handleBack}
        onGoHome={() => navigate(ROUTE_PATHS.home)}
        onViewPurchasedProducts={() => navigate(ROUTE_PATHS.shopHistory)}
      />
    )
  }

  const canPurchase = !shopProduct.soldOut && currentPoints >= shopProduct.requiredPoints
  const remainingPoints = Math.max(currentPoints - shopProduct.requiredPoints, 0)
  const usageGuideItems = [
    '구매한 상품 내역은 구매한 상품 화면에서 확인할 수 있습니다.',
    '본 상품의 실제 사용 절차는 제휴처 정책에 따라 달라질 수 있습니다.',
    '상품 등록 또는 교환이 완료된 이후에는 취소 또는 재발급이 제한될 수 있습니다.',
    '유효기간과 세부 사용 조건은 제휴처 안내를 확인해 주세요.',
  ]

  const handleOpenPurchaseModal = () => {
    if (!canPurchase) {
      return
    }

    setIsPurchaseModalOpen(true)
  }

  const handleClosePurchaseModal = () => {
    setIsPurchaseModalOpen(false)
  }

  const handleConfirmPurchase = () => {
    if (isSubmitting) {
      return
    }

    const submitPurchase = async () => {
      try {
        setIsSubmitting(true)
        const response = await purchasePointShopItem(parsedItemId)
        setCurrentPoints(response.remainingPoints)
        setIsPurchaseModalOpen(false)
        setIsPurchaseComplete(true)
      } catch (purchaseError: unknown) {
        console.error(purchaseError)
        const errorMessage =
          purchaseError instanceof AxiosError
            ? purchaseError.response?.data?.message ?? '구매 처리 중 오류가 발생했습니다.'
            : '구매 처리 중 오류가 발생했습니다.'
        alert(errorMessage)
      } finally {
        setIsSubmitting(false)
      }
    }

    void submitPurchase()
  }

  return (
    <>
      <div className="relative mx-auto flex min-h-screen w-full max-w-[600px] flex-col bg-gray-50 font-pretendard shadow-[var(--shadow-card)]">
        <ShopHeader title="포인트샵" onBack={handleBack} />

        <main className="flex-1 bg-gray-50 pt-(--header-h)">
          <div className="flex min-h-full flex-col bg-gray-50 pb-[calc(104px+env(safe-area-inset-bottom))]">
            <section className="flex h-[340px] items-center justify-center bg-primary-100">
              {resolveImageUrl(shopProduct.imageUrl) ? (
                <img
                  src={resolveImageUrl(shopProduct.imageUrl)}
                  alt={shopProduct.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-primary-500">
                  <p className="text-center text-[56px] font-bold leading-none tracking-[-0.04em]">
                    {getPlaceholderLabel(shopProduct.name)}
                  </p>
                  <p className="mt-3 text-center text-xl font-medium">
                    {getCategoryLabel(shopProduct.category)}
                  </p>
                </div>
              )}
            </section>

            <section className="bg-gray-50 px-(--side-padding) pt-6 pb-8">
              <h2 className="text-[18px] font-bold text-gray-600">{shopProduct.name}</h2>
              <p className="mt-2 text-[14px] leading-6 text-font-sub">{shopProduct.description}</p>
              <div className="pt-3">
                <p className="text-[20px] font-bold leading-none text-font-main">
                  {formatPoints(shopProduct.requiredPoints)}
                </p>
              </div>

              <div className="my-4 h-px bg-gray-200" />

              <div className="space-y-2">
                <h3 className="text-[16px] font-bold text-gray-500">이용안내</h3>
                <div className="space-y-1 text-[14px] leading-7 text-font-sub">
                  {usageGuideItems.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </main>

        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50">
          <section className="pointer-events-auto mx-auto w-full max-w-[600px] border-t border-gray-200 bg-surface px-(--side-padding) pt-4 pb-[calc(16px+env(safe-area-inset-bottom))] shadow-[var(--shadow-card)]">
            <Button
              type="button"
              variant="primary"
              size="md"
              fullWidth
              disabled={!canPurchase}
              onClick={handleOpenPurchaseModal}
              className="!h-[56px]"
              style={{
                backgroundColor: canPurchase ? 'var(--color-primary-500)' : 'var(--color-gray-200)',
                color: canPurchase ? 'var(--color-surface)' : 'var(--color-gray-400)',
              }}
            >
              {shopProduct.soldOut ? '품절' : canPurchase ? '구매하기' : '포인트가 부족합니다'}
            </Button>
          </section>
        </div>
      </div>

      <ShopPurchaseConfirmModal
        open={isPurchaseModalOpen}
        productName={shopProduct.name}
        pricePoints={shopProduct.requiredPoints}
        currentPoints={currentPoints}
        remainingPoints={remainingPoints}
        onClose={handleClosePurchaseModal}
        onConfirm={handleConfirmPurchase}
        isSubmitting={isSubmitting}
      />
    </>
  )
}

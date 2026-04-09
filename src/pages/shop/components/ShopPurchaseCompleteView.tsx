import { Button } from '../../../components/common'
import { getS3AssetUrl } from '../../../constants/assetUrls'
import { ShopHeader } from './ShopHeader'

interface ShopPurchaseCompleteViewProps {
  productName: string
  onBack: () => void
  onGoHome: () => void
  onViewPurchasedProducts: () => void
}

export const ShopPurchaseCompleteView = ({
  onBack,
  onGoHome,
  onViewPurchasedProducts,
}: ShopPurchaseCompleteViewProps) => {
  const completionImage = getS3AssetUrl('com.webp')

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-[600px] flex-col bg-bg-light font-pretendard shadow-[var(--shadow-card)]">
      <ShopHeader title="포인트샵" onBack={onBack} />

      <main className="flex-1 bg-bg-light pt-(--header-h)">
        <section className="flex min-h-[calc(100vh-var(--header-h))] flex-col items-center justify-center px-(--side-padding) pb-[calc(112px+env(safe-area-inset-bottom))] text-center">
          <img
            src={completionImage}
            alt=""
            className="h-[230px] w-[230px] object-contain"
          />
          <h2 className="text-[24px] font-bold leading-[1.35] text-font-main">
            구매가 완료되었습니다!
          </h2>
          <p className="mt-3 text-sm leading-6 text-font-sub">
            구매한 상품 보기에서 교환 코드와 사용처를 확인할 수 있어요.
          </p>
        </section>
      </main>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50">
        <section className="pointer-events-auto mx-auto w-full max-w-[600px] px-(--side-padding) pt-4 pb-[calc(16px+env(safe-area-inset-bottom))]">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="sub"
              fullWidth
              className="!h-[56px]"
              onClick={onGoHome}
            >
              메인으로
            </Button>
            <Button
              type="button"
              variant="primary"
              fullWidth
              className="!h-[56px]"
              onClick={onViewPurchasedProducts}
            >
              구매한 상품 보기
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}

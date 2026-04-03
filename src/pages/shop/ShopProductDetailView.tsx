import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../components/common'
import { ROUTE_PATHS } from '../../constants/routePaths'
import { useAuth } from '../../hooks/useAuth'
import { PageScaffold } from '../PageScaffold'
import { ShopHeader } from './components/ShopHeader'
import { fallbackPointBalance, getShopProductById } from './shopData'

export const ShopProductDetailView = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth()
  const shopProduct = id ? getShopProductById(id) : undefined

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate(ROUTE_PATHS.shop)
  }

  if (!shopProduct) {
    return (
      <PageScaffold
        title="상품 정보를 찾을 수 없어요."
        description="존재하지 않거나 제거된 상품입니다."
      />
    )
  }

  const totalPoints = user?.totalPoints ?? fallbackPointBalance
  const canPurchase = totalPoints >= shopProduct.price
  const usageGuideLabel = shopProduct.usageGuideLabel ?? shopProduct.vendor
  const usageGuideItems = [
    `본 교환권 코드는 ${usageGuideLabel}에서 등록 후 사용할 수 있습니다.`,
    `본 교환권은 ${usageGuideLabel} 회원 로그인 후 등록 가능하며, 최초 1회 본인인증 절차 진행 후 사용 가능합니다.`,
    `본 교환권은 ${usageGuideLabel}에 등록 후 등록취소가 불가능합니다.`,
    '상품권의 최초 유효기간은 등록 후 1년입니다.',
  ]

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-[600px] flex-col bg-bg-light font-pretendard shadow-[var(--shadow-card)]">
      <ShopHeader title="포인트샵" onBack={handleBack} />

      <main className="flex-1 bg-bg-light pt-(--header-h)">
        <div className="flex min-h-full flex-col bg-bg-light pb-[calc(104px+env(safe-area-inset-bottom))]">
          <section
            className={`flex h-[340px] items-center justify-center ${
              shopProduct.mediaBackgroundClassName ?? 'bg-primary-100'
            }`}
          >
            {shopProduct.imageSrc ? (
              <img
                src={shopProduct.imageSrc}
                alt={shopProduct.imageAlt ?? shopProduct.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className={shopProduct.mediaTextClassName ?? 'text-primary-500'}>
                <p className="text-center text-[56px] font-bold leading-none tracking-[-0.04em]">
                  {shopProduct.placeholderLabel}
                </p>
                {shopProduct.placeholderSubLabel ? (
                  <p className="mt-3 text-center text-xl font-medium">
                    {shopProduct.placeholderSubLabel}
                  </p>
                ) : null}
              </div>
            )}
          </section>

          <section className="bg-bg-light px-(--side-padding) pt-6 pb-8">
            <h2 className="text-[18px] font-bold text-gray-500">{shopProduct.title}</h2>
            <p className="mt-2 text-[14px] leading-6 text-font-sub">{shopProduct.summary}</p>
            <div className="pt-3">
              <p className="text-[20px] font-bold leading-none text-font-main">
                {shopProduct.priceLabel}
              </p>
            </div>

            <div className="my-4 h-px bg-gray-200" />

            <div className="space-y-4">
              <h3 className="text-[16px] font-bold text-font-main">이용안내</h3>
              <div className="mt-4 space-y-2 text-[14px] leading-7 text-font-sub">
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
            onClick={canPurchase ? () => navigate(ROUTE_PATHS.shopHistory) : undefined}
            className="!h-[56px]"
            style={{
              backgroundColor: canPurchase ? 'var(--color-primary-500)' : 'var(--color-gray-200)',
              color: canPurchase ? 'var(--color-surface)' : 'var(--color-gray-400)',
            }}
          >
            {canPurchase ? '구매하기' : '포인트가 부족합니다'}
          </Button>
        </section>
      </div>
    </div>
  )
}

import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, InfoRow } from '../../components/common'
import MainLayout from '../../components/layout/MainLayout'
import { ROUTE_PATHS } from '../../constants/routePaths'
import { getFinanceProductById } from './financeData'
import { PageScaffold } from '../PageScaffold'
import { ShopHeader } from '../shop/components/ShopHeader'

export const SavingsDetailTuned = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const product = id ? getFinanceProductById(id) : undefined
  const rateHighlightLabel = product?.heroRateHighlight?.replace(/^최고\s*/, '') ?? ''

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate(ROUTE_PATHS.finance)
  }

  if (!product) {
    return (
      <PageScaffold
        title="금융 상품을 찾을 수 없어요"
        description="존재하지 않거나 아직 준비되지 않은 금융 상품입니다."
      />
    )
  }

  if (product.type !== 'SAVINGS') {
    return (
      <PageScaffold
        title="대출 상세 준비 중"
        description="대출 상세 화면은 다음 단계에서 이어서 구현할 예정입니다."
      />
    )
  }

  return (
    <div className="relative min-h-screen bg-bg-light font-pretendard">
      <MainLayout
        header={<ShopHeader title="금융상품" onBack={handleBack} />}
        className="bg-bg-light"
      >
        <div className="-mx-2 flex flex-col gap-[27px] bg-bg-light px-5 pb-[118px] pt-4">
          <section className="flex items-center justify-between gap-2 px-[1px]">
            <div className="min-w-0 flex-1">
              <h2 className="text-[21px] font-semibold leading-[1.2] text-font-main">
                {product.name}
              </h2>
              <p className="mt-[10px] break-keep text-[15px] leading-[1.2] text-font-sub">
                {product.heroDescription}
              </p>
            </div>

            {product.heroImageSrc ? (
              <img
                src={product.heroImageSrc}
                alt={product.name}
                className="h-[77px] w-[73px] shrink-0 object-contain"
              />
            ) : null}
          </section>

          <Card className="!gap-0 !rounded-control !px-[25px] !py-[17px] shadow-sm">
            <p className="text-[15px] font-medium leading-[1.2] text-gray-500">
              {product.heroRateSummary}
            </p>
            <div className="mt-[18px] flex items-end gap-[4px]">
              <span className="text-[16px] font-bold leading-[1.2] text-gray-600">최고</span>
              <span className="text-[21px] font-bold leading-[1.2] tracking-tight-sm text-primary-500">
                {rateHighlightLabel}
              </span>
            </div>
          </Card>

          <div className="flex flex-col gap-[14px] px-[10px]">
            {product.detailFields.map((field, index) => (
              <div key={field.label} className="flex flex-col gap-[14px]">
                <InfoRow
                  label={field.label}
                  value={field.value}
                  className="items-center"
                  valueClassName="text-[14px] font-semibold leading-5 text-font-main"
                />
                {index < product.detailFields.length - 1 ? (
                  <div className="h-px bg-gray-200" />
                ) : null}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-[27px]">
            <Card className="!gap-1 !rounded-control !border-0 !bg-gray-200 !px-[23px] !py-[18px] shadow-sm">
              <h3 className="text-[16px] font-semibold leading-[1.2] text-gray-600">
                {product.benefitTitle}
              </h3>
              <p className="text-[12px] leading-[22.75px] text-gray-600">
                {product.benefitDescription}
              </p>
            </Card>

            <div className="px-[3px]">
              <h3 className="text-[12px] font-semibold leading-[1.2] text-gray-500">
                알아두세요
              </h3>
              <div className="mt-[6px] flex flex-col gap-0 text-[12px] leading-[22.75px] text-gray-500">
                {product.noticeLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </MainLayout>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50">
        <div className="pointer-events-auto mx-auto w-full max-w-[600px] border-t border-gray-200 bg-white px-(--side-padding) pt-4 pb-[calc(16px+env(safe-area-inset-bottom))] shadow-[var(--shadow-card)]">
          <Button
            type="button"
            fullWidth
            size="md"
            onClick={() =>
              navigate(ROUTE_PATHS.financeDone, {
                state: { productId: product.id, productType: product.type },
              })
            }
            className="!h-[56px]"
          >
            {product.actionLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

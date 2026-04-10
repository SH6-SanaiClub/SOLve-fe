import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, InfoRow } from '../../components/common'
import MainLayout from '../../components/layout/MainLayout'
import { ROUTE_PATHS } from '../../constants/routePaths'
import { getFinanceProductById } from './financeData'
import { PageScaffold } from '../PageScaffold'
import { ShopHeader } from '../shop/components/ShopHeader'

export const FinanceApplyPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const product = id ? getFinanceProductById(id) : undefined

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
        title="신청할 금융 상품이 없어요"
        description="존재하지 않거나 아직 준비되지 않은 금융 상품입니다."
      />
    )
  }

  if (product.type !== 'LOAN') {
    return (
      <PageScaffold
        title="대출 신청만 가능해요"
        description="이 화면은 대출 상품 신청에만 사용됩니다."
      />
    )
  }

  return (
    <div className="relative min-h-screen bg-bg-light font-pretendard">
      <MainLayout
        header={<ShopHeader title="대출 신청" onBack={handleBack} />}
        className="bg-bg-light"
      >
        <div className="-mx-2 flex flex-col gap-8 bg-bg-light px-5 pb-[118px] pt-5">
          <section className="px-[1px] pt-1 text-center">
            <h2 className="text-[22px] font-semibold leading-[1.25] text-font-main">
              {product.applyTitle}
            </h2>
          </section>

          <div className="flex flex-col gap-[14px] px-[10px]">
            {product.applyFields.map((field, index) => (
              <div key={field.label} className="flex flex-col gap-[14px]">
                <InfoRow
                  label={field.label}
                  value={field.value}
                  className="items-center"
                  valueClassName="text-[14px] font-semibold leading-5 text-font-main"
                />
                {index < product.applyFields.length - 1 ? (
                  <div className="h-px bg-gray-200" />
                ) : null}
              </div>
            ))}
          </div>

          <div className="px-[3px]">
            <h3 className="text-[12px] font-semibold leading-[1.2] text-gray-500">알아두세요</h3>
            <div className="mt-[8px] flex flex-col gap-0 text-[12px] leading-[22.75px] text-gray-500">
              {product.noticeLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>

          <Card className="!gap-2 !rounded-control !border-0 !bg-gray-100 !px-[23px] !py-[18px] shadow-sm">
            <h3 className="text-[16px] font-semibold leading-[1.2] text-gray-600">신청 전 확인</h3>
            <p className="text-[12px] leading-[22.75px] text-gray-600">
              기존 대출 상환 전에는 추가 대출이 불가능하며, 신청 결과에 따라 최종 한도와 금리가 조정될 수 있습니다.
            </p>
          </Card>
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
            대출 신청
          </Button>
        </div>
      </div>
    </div>
  )
}

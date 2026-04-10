import { useNavigate, useParams } from 'react-router-dom'
import { Button, IconButton } from '../../../components/common'
import { Icons } from '../../../components/common'
import Header from '../../../components/layout/Header'
import MainLayout from '../../../components/layout/MainLayout'
import {
  ROUTE_PATHS,
  getValueStoreProductDetailPath,
} from '../../../constants/routePaths'

const formatPrice = (price: number) =>
  `${new Intl.NumberFormat('ko-KR').format(price)}원`

export function ValueStorePaymentPage() {
  const navigate = useNavigate()
  const { productId } = useParams()

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
      <section className="mx-[-16px] min-h-[calc(100vh-var(--header-h)-48px)] bg-gray-50 pb-[128px]" />

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50">
        <section className="pointer-events-auto mx-auto w-full max-w-[600px] bg-white">
          <div className="flex items-center justify-between px-5 pt-[10px] pb-[5px]">
            <p className="text-[16px] leading-4 font-normal text-font-sub">
              최종 결제 금액
            </p>
            <p className="text-[20px] leading-4 font-bold text-primary-500">
              {formatPrice(0)}
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

import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Badge,
  Button,
  Card,
  IconButton,
  Radio,
} from '../../../components/common'
import { Icons } from '../../../components/common'
import Header from '../../../components/layout/Header'
import MainLayout from '../../../components/layout/MainLayout'
import {
  ROUTE_PATHS,
  getValueStoreProductDetailPath,
} from '../../../constants/routePaths'
import { useAuth } from '../../../hooks/useAuth'
import { getValueStoreProductDetail } from '../../../services/productService'
import { prepareProductPayment } from '../../../services/paymentService'
import { getMyProfile } from '../../../services/userService'
import {
  PortOnePaymentError,
  requestProductPortOnePayment,
} from '../../../services/portoneService'
import type { ValueStoreProductDetail } from '../../../types/product'
import type { UserProfileResponse } from '../../../types/user'

const formatPrice = (price: number) =>
  `${new Intl.NumberFormat('ko-KR').format(price)}원`

const formatPoint = (point: number) =>
  `${new Intl.NumberFormat('ko-KR').format(point)}P`

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
  const { user } = useAuth()
  const parsedProductId = Number(productId)
  const [productDetail, setProductDetail] =
    useState<ValueStoreProductDetail | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfileResponse | null>(
    null,
  )
  const [isLoading, setIsLoading] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState<'solpay' | 'card'>('card')
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [preparedAmount, setPreparedAmount] = useState<number | null>(null)
  const deliveryName = userProfile?.name ?? user?.name ?? 'user'
  const deliveryPhoneNumber = userProfile?.phoneNumber ?? 'phoneNumber'
  const deliveryAddress =
    '서울특별시 영등포구 선유서로25길 34 (양평동2가, 삼성코코빌) 404호'
  const finalAmount = preparedAmount ?? productDetail?.price ?? 0
  const expectedPoint = Math.floor(finalAmount * 0.01)

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

  useEffect(() => {
    let isMounted = true

    const fetchUserProfile = async () => {
      try {
        const response = await getMyProfile()
        if (!isMounted) {
          return
        }
        setUserProfile(response)
      } catch (error) {
        console.error(error)
        if (!isMounted) {
          return
        }
        setUserProfile(null)
      }
    }

    void fetchUserProfile()

    return () => {
      isMounted = false
    }
  }, [])

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

  const handlePayment = async () => {
    if (!productDetail || isSubmittingPayment) {
      return
    }

    setIsSubmittingPayment(true)
    setPaymentError('')

    try {
      const preparedPayment = await prepareProductPayment({
        productId: productDetail.productId,
      })

      setPreparedAmount(preparedPayment.amount)

      const paymentResponse = await requestProductPortOnePayment({
        merchantUid: preparedPayment.merchantUid,
        productName: preparedPayment.productName,
        amount: preparedPayment.amount,
        paymentMethod,
      })

      console.info('포트원 상품 결제 성공 콜백', {
        imp_uid: paymentResponse.imp_uid,
        merchant_uid: paymentResponse.merchant_uid,
        response: paymentResponse,
      })
    } catch (error) {
      if (error instanceof PortOnePaymentError) {
        console.error('포트원 상품 결제 실패 콜백', {
          imp_uid: error.response.imp_uid,
          merchant_uid: error.response.merchant_uid,
          response: error.response,
        })
        window.alert(error.response.error_msg ?? '결제가 완료되지 않았어요.')
      } else {
        console.error('상품 결제 준비 실패', error)
        setPaymentError('결제 준비에 실패했어요. 잠시 후 다시 시도해주세요.')
        window.alert('결제 준비에 실패했어요. 잠시 후 다시 시도해주세요.')
      }
    } finally {
      setIsSubmittingPayment(false)
    }
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
          <div className="space-y-8">
            <Card className="rounded-control !p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
              <div className="flex items-center gap-6">
                <div className="h-[96px] w-[88px] animate-pulse rounded-control bg-primary-100" />
                <div className="flex flex-1 flex-col gap-4">
                  <div className="h-7 w-3/4 animate-pulse rounded-full bg-gray-200" />
                  <div className="h-7 w-1/2 animate-pulse rounded-full bg-gray-300" />
                </div>
              </div>
            </Card>

            <div className="space-y-[10px]">
              <div className="h-8 w-32 animate-pulse rounded-full bg-gray-300" />
              <Card className="rounded-control !p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-16 animate-pulse rounded-full bg-gray-300" />
                    <div className="h-8 w-24 animate-pulse rounded-full bg-primary-50" />
                  </div>
                  <div className="h-7 w-full animate-pulse rounded-full bg-gray-200" />
                  <div className="h-7 w-1/2 animate-pulse rounded-full bg-gray-200" />
                </div>
              </Card>
            </div>
          </div>
        ) : productDetail ? (
          <div className="space-y-8">
            <Card className="rounded-control !p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
              <div className="flex items-center gap-6">
                <div className="h-[96px] w-[88px] overflow-hidden rounded-[8px] bg-primary-100">
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

            <div className="space-y-[10px]">
              <h3 className="text-[18px] leading-[120%] font-semibold tracking-[-0.02em] text-font-main">
                배송지 정보
              </h3>
              <Card className="rounded-control !p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <p className="text-[18px] leading-[120%] font-semibold tracking-[-0.02em] text-black">
                        {deliveryName}
                      </p>
                      <Badge
                        tone="primary"
                        className="px-[6px] py-[2px] text-[12px] font-medium tracking-[-0.02em]"
                      >
                        기본배송지
                      </Badge>
                    </div>

                    <Button
                      type="button"
                      variant="gray"
                      size="sm"
                      className="!h-[32px] !w-[64px] !rounded-[8px] !border !border-solid !border-gray-300 !bg-transparent !px-0 !text-[14px] !font-medium !text-gray-400"
                    >
                      변경
                    </Button>
                  </div>

                  <p className="break-keep text-[16px] leading-[160%] font-normal tracking-[-0.02em] text-black">
                    {deliveryAddress}
                  </p>

                  <p className="text-[16px] leading-[160%] font-normal tracking-[-0.02em] text-black">
                    {deliveryPhoneNumber}
                  </p>
                </div>
              </Card>
            </div>

            <div className="space-y-[6px]">
              <h3 className="text-base leading-7 font-semibold text-gray-800">
                결제 수단
              </h3>

              <div className="flex flex-col gap-3">
                <div className="rounded-control border border-gray-200 bg-white px-4 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                  <Radio
                    name="paymentMethod"
                    value="solpay"
                    checked={paymentMethod === 'solpay'}
                    onChange={() => setPaymentMethod('solpay')}
                    className="p-0"
                    label={
                      <span className="text-base leading-4 font-semibold text-font-main">
                        SOL Pay
                      </span>
                    }
                  />
                </div>

                <div className="rounded-control border border-gray-200 bg-white px-4 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                  <Radio
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="p-0"
                    label={
                      <span className="text-base leading-4 font-semibold text-font-main">
                        신용/체크카드
                      </span>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-[10px]">
            <h3 className="text-[18px] leading-[120%] font-semibold tracking-[-0.02em] text-font-main">
              배송지 정보
            </h3>
            <Card className="rounded-control !p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <p className="text-[18px] leading-[120%] font-semibold tracking-[-0.02em] text-black">
                      {deliveryName}
                    </p>
                    <Badge
                      tone="primary"
                      className="px-[6px] py-[2px] text-[12px] font-medium tracking-[-0.02em]"
                    >
                      기본배송지
                    </Badge>
                  </div>

                  <Button
                    type="button"
                    variant="gray"
                    size="sm"
                    className="!h-[32px] !w-[64px] !rounded-[8px] !border !border-solid !border-gray-300 !bg-transparent !px-0 !text-[14px] !font-medium !text-gray-400"
                  >
                    변경
                  </Button>
                </div>

                <p className="break-keep text-[16px] leading-[160%] font-normal tracking-[-0.02em] text-black">
                  {deliveryAddress}
                </p>

                <p className="text-[16px] leading-[160%] font-normal tracking-[-0.02em] text-black">
                  {deliveryPhoneNumber}
                </p>
              </div>
            </Card>

            <div className="space-y-[6px]">
              <h3 className="text-base leading-7 font-semibold text-gray-800">
                결제 수단
              </h3>

              <div className="flex flex-col gap-3">
                <div className="rounded-control border border-gray-200 bg-white px-4 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                  <Radio
                    name="paymentMethod"
                    value="solpay"
                    checked={paymentMethod === 'solpay'}
                    onChange={() => setPaymentMethod('solpay')}
                    className="p-0"
                    label={
                      <span className="text-base leading-4 font-semibold text-font-main">
                        SOL Pay
                      </span>
                    }
                  />
                </div>

                <div className="rounded-control border border-gray-200 bg-white px-4 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                  <Radio
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="p-0"
                    label={
                      <span className="text-base leading-4 font-semibold text-font-main">
                        신용/체크카드
                      </span>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50">
        <section className="pointer-events-auto mx-auto w-full max-w-[600px] bg-white">
          <div className="flex items-center justify-between px-5 pt-[10px] pb-[5px]">
            <p className="text-[16px] leading-4 font-normal text-font-sub">
              최종 결제 금액
            </p>
            <p className="text-[20px] leading-4 font-bold text-primary-500">
              {formatPrice(finalAmount)}
            </p>
          </div>

          <div className="flex items-center justify-between px-5 pt-[5px] pb-0">
            <p className="text-[12px] leading-7 font-normal text-font-sub">
              예상 적립 포인트
            </p>
            <p className="text-[12px] leading-7 font-semibold text-gray-800">
              {formatPoint(expectedPoint)}
            </p>
          </div>

          {paymentError ? (
            <p className="px-5 pt-1 text-xs text-red-500">{paymentError}</p>
          ) : null}

          <div className="px-5 pt-[15px] pb-[calc(20px+env(safe-area-inset-bottom))]">
            <Button
              fullWidth
              disabled={isLoading || !productDetail || isSubmittingPayment}
              onClick={() => void handlePayment()}
            >
              {isSubmittingPayment ? '결제 준비 중...' : '구매하기'}
            </Button>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}

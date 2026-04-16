import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Badge,
  Button,
  Card,
  IconButton,
  Input,
  Radio,
} from '../../../components/common'
import { Icons } from '../../../components/common'
import Header from '../../../components/layout/Header'
import MainLayout from '../../../components/layout/MainLayout'
import {
  ROUTE_PATHS,
  getValueStoreProductPaymentCallbackPath,
  getValueStoreProductDetailPath,
} from '../../../constants/routePaths'
import { useAuth } from '../../../hooks/useAuth'
import { getValueStoreProductDetail } from '../../../services/productService'
import {
  prepareProductPayment,
} from '../../../services/paymentService'
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

const KAKAO_POSTCODE_SCRIPT_URL =
  '//t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
const PRODUCT_PAYMENT_ADDRESS_KEY_PREFIX = 'product-payment-delivery-address:'
const PRODUCT_PAYMENT_LATEST_ADDRESS_KEY =
  'product-payment-delivery-address:latest'

interface KakaoPostcodeData {
  roadAddress: string
  jibunAddress: string
  zonecode: string
  userSelectedType: 'R' | 'J'
  bname: string
  buildingName: string
  apartment: 'Y' | 'N'
}

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: {
        oncomplete: (data: KakaoPostcodeData) => void
      }) => {
        open: () => void
      }
    }
  }
}

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
  const [baseAddress, setBaseAddress] = useState('')
  const [detailAddress, setDetailAddress] = useState('')
  const [addressError, setAddressError] = useState('')
  const [isAddressEditing, setIsAddressEditing] = useState(true)
  const deliveryName = userProfile?.name ?? user?.name ?? 'user'
  const deliveryPhoneNumber = userProfile?.phoneNumber ?? 'phoneNumber'
  const selectedBaseAddress = baseAddress || '건물명, 도로명 또는 지번 검색'
  const savedDeliveryAddress = [baseAddress, detailAddress]
    .filter(Boolean)
    .join(' ')
    .trim()
  const deliveryAddress =
    savedDeliveryAddress || '건물명, 도로명 또는 지번 검색'
  const finalAmount = preparedAmount ?? productDetail?.price ?? 0
  const expectedPoint = Math.floor(finalAmount * 0.01)

  const loadKakaoPostcodeScript = useCallback(async () => {
    if (window.daum?.Postcode) {
      return
    }

    await new Promise<void>((resolve, reject) => {
      const existingScript = document.querySelector<HTMLScriptElement>(
        `script[src="${KAKAO_POSTCODE_SCRIPT_URL}"]`,
      )

      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(), {
          once: true,
        })
        existingScript.addEventListener(
          'error',
          () => reject(new Error('카카오 우편번호 서비스를 불러오지 못했어요.')),
          { once: true },
        )
        return
      }

      const script = document.createElement('script')
      script.src = KAKAO_POSTCODE_SCRIPT_URL
      script.async = true
      script.onload = () => resolve()
      script.onerror = () =>
        reject(new Error('카카오 우편번호 서비스를 불러오지 못했어요.'))

      document.head.appendChild(script)
    })
  }, [])

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

  const handleOpenAddressSearch = async () => {
    setAddressError('')

    try {
      await loadKakaoPostcodeScript()

      if (!window.daum?.Postcode) {
        throw new Error('카카오 우편번호 서비스를 사용할 수 없어요.')
      }

      new window.daum.Postcode({
        oncomplete: (data) => {
          const selectedAddress =
            data.userSelectedType === 'R'
              ? data.roadAddress
              : data.jibunAddress

          let extraAddress = ''

          if (data.userSelectedType === 'R') {
            if (data.bname && /[동로가]$/.test(data.bname)) {
              extraAddress += data.bname
            }

            if (data.buildingName && data.apartment === 'Y') {
              extraAddress += extraAddress
                ? `, ${data.buildingName}`
                : data.buildingName
            }
          }

          const normalizedAddress = extraAddress
            ? `${selectedAddress} (${extraAddress})`
            : selectedAddress

          setBaseAddress(normalizedAddress)
        },
      }).open()
    } catch (error) {
      console.error(error)
      setAddressError('주소 검색을 불러오지 못했어요. 잠시 후 다시 시도해주세요.')
    }
  }

  const handleSaveAddress = () => {
    if (!baseAddress.trim()) {
      setAddressError('주소를 먼저 검색해주세요.')
      return
    }

    setAddressError('')
    setIsAddressEditing(false)
  }

  const handlePayment = async () => {
    if (!productDetail || isSubmittingPayment) {
      return
    }

    if (!savedDeliveryAddress) {
      setAddressError('배송지 주소를 입력하고 저장해주세요.')
      setIsAddressEditing(true)
      return
    }

    setIsSubmittingPayment(true)
    setPaymentError('')

    try {
      const preparedPayment = await prepareProductPayment({
        productId: productDetail.productId,
      })

      setPreparedAmount(preparedPayment.amount)
      sessionStorage.setItem(
        `${PRODUCT_PAYMENT_ADDRESS_KEY_PREFIX}${preparedPayment.merchantUid}`,
        savedDeliveryAddress,
      )
      localStorage.setItem(
        `${PRODUCT_PAYMENT_ADDRESS_KEY_PREFIX}${preparedPayment.merchantUid}`,
        savedDeliveryAddress,
      )
      localStorage.setItem(PRODUCT_PAYMENT_LATEST_ADDRESS_KEY, savedDeliveryAddress)

      const paymentResponse = await requestProductPortOnePayment({
        merchantUid: preparedPayment.merchantUid,
        productName: preparedPayment.productName,
        amount: preparedPayment.amount,
        paymentMethod,
        buyerName: deliveryName,
        buyerTel: deliveryPhoneNumber,
        redirectUrl: `${window.location.origin}${getValueStoreProductPaymentCallbackPath(
          preparedPayment.productId,
        )}`,
      })

      console.info('포트원 상품 결제 성공 콜백', {
        imp_uid: paymentResponse.imp_uid,
        merchant_uid: paymentResponse.merchant_uid,
        response: paymentResponse,
      })

      if (!paymentResponse.imp_uid || !paymentResponse.merchant_uid) {
        throw new Error('결제 검증에 필요한 정보가 누락되었어요.')
      }

      const callbackSearchParams = new URLSearchParams({
        imp_uid: paymentResponse.imp_uid,
        merchant_uid: paymentResponse.merchant_uid,
        imp_success: 'true',
      })

      navigate(
        `${getValueStoreProductPaymentCallbackPath(
          preparedPayment.productId,
        )}?${callbackSearchParams.toString()}`,
        {
          replace: true,
          state: {
            deliveryAddress: savedDeliveryAddress,
          },
        },
      )
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
          <div className="space-y-4">
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
            <Card className="overflow-hidden rounded-control !p-0 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between border-b border-gray-100 px-3 py-[10px]">
                <p className="text-[16px] leading-[120%] font-bold tracking-[-0.02em] text-gray-600">
                  {productDetail.storeName}
                </p>
                <p className="text-[12px] leading-[120%] font-medium tracking-[-0.02em] text-gray-400">
                  배송비 무료
                </p>
              </div>

              <div className="space-y-3 px-3 py-3">
                <div className="flex items-start gap-3">
                  <div className="h-[68px] w-[68px] shrink-0 overflow-hidden rounded-[8px] bg-primary-100">
                    <img
                      src={resolveImageUrl(productDetail.imageUrl)}
                      alt={productDetail.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="space-y-[6px]">
                      <Badge
                        tone="primary"
                        className="px-[6px] py-[2px] text-xs font-medium tracking-[-0.02em]"
                      >
                        {productDetail.category}
                      </Badge>
                      <h2 className="break-keep text-[16px] leading-[140%] font-medium tracking-[-0.02em] text-font-main">
                        {productDetail.name}
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-[16px] leading-[120%] font-semibold tracking-[-0.02em] text-font-main">
                      최종 상품 금액
                    </p>
                    <p className="text-[18px] leading-[120%] font-bold tracking-[-0.02em] text-font-main">
                      {formatPrice(finalAmount)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="space-y-[10px]">
              <h3 className="text-base leading-7 font-semibold text-gray-800">
                배송지 정보
              </h3>
              <Card className="rounded-control !p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                <div className="space-y-[10px]">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <p className="text-[18px] leading-[120%] font-semibold tracking-[-0.02em] text-black">
                        {deliveryName}
                      </p>
                      <p className="text-[16px] leading-[160%] font-normal tracking-[-0.02em] text-black">
                        {deliveryPhoneNumber}
                      </p>
                    </div>

                    {!isAddressEditing ? (
                      <Button
                        type="button"
                        variant="gray"
                        size="sm"
                        className="!h-[32px] !w-[64px] !rounded-[8px] !border !border-solid !border-gray-300 !bg-transparent !px-0 !text-[14px] !font-medium !text-gray-400"
                        onClick={() => setIsAddressEditing(true)}
                      >
                        변경
                      </Button>
                    ) : null}
                  </div>

                  {isAddressEditing ? (
                    <div className="space-y-3">
                      <h4 className="text-base leading-7 font-semibold text-gray-800">
                        주소
                      </h4>

                      <button
                        type="button"
                        className={`flex min-h-[48px] w-full items-start rounded-control border px-4 py-3 text-left text-base font-medium tracking-tight-sm ${
                          baseAddress
                            ? 'border-gray-400 bg-white text-font-main'
                            : 'border-gray-400 bg-white text-font-sub'
                        }`}
                        onClick={() => void handleOpenAddressSearch()}
                      >
                        <span className="whitespace-normal break-all">
                          {selectedBaseAddress}
                        </span>
                      </button>

                      <Input
                        value={detailAddress}
                        onChange={(event) =>
                          setDetailAddress(event.target.value)
                        }
                        placeholder="상세주소를 입력해주세요. (예 : 6층, 601호)"
                      />

                      <Button
                        type="button"
                        variant="sub"
                        fullWidth
                        className="!h-[48px]"
                        onClick={handleSaveAddress}
                      >
                        저장하기
                      </Button>

                      {addressError ? (
                        <p className="text-xs text-error font-normal tracking-tight-sm">
                          {addressError}
                        </p>
                      ) : null}
                    </div>
                  ) : (
                    <p className="whitespace-normal break-all text-[16px] leading-[160%] font-normal tracking-[-0.02em] text-black">
                      {deliveryAddress}
                    </p>
                  )}
                </div>
              </Card>
            </div>

            <div className="space-y-[6px] pb-8">
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
            <h3 className="text-base leading-7 font-semibold text-gray-800">
              배송지 정보
            </h3>
            <Card className="rounded-control !p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
              <div className="space-y-[10px]">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <p className="text-[18px] leading-[120%] font-semibold tracking-[-0.02em] text-black">
                      {deliveryName}
                    </p>
                    <p className="text-[16px] leading-[160%] font-normal tracking-[-0.02em] text-black">
                      {deliveryPhoneNumber}
                    </p>
                  </div>

                  {!isAddressEditing ? (
                    <Button
                      type="button"
                      variant="gray"
                      size="sm"
                      className="!h-[32px] !w-[64px] !rounded-[8px] !border !border-solid !border-gray-300 !bg-transparent !px-0 !text-[14px] !font-medium !text-gray-400"
                      onClick={() => setIsAddressEditing(true)}
                    >
                      변경
                    </Button>
                  ) : null}
                </div>

                {isAddressEditing ? (
                  <div className="space-y-3">
                    <h4 className="text-base leading-7 font-semibold text-gray-800">
                      주소
                    </h4>

                    <button
                      type="button"
                      className={`flex min-h-[48px] w-full items-start rounded-control border px-4 py-3 text-left text-base font-medium tracking-tight-sm ${
                        baseAddress
                          ? 'border-gray-400 bg-white text-font-main'
                          : 'border-gray-400 bg-white text-font-sub'
                      }`}
                      onClick={() => void handleOpenAddressSearch()}
                    >
                      <span className="whitespace-normal break-all">
                        {selectedBaseAddress}
                      </span>
                    </button>

                    <Input
                      value={detailAddress}
                      onChange={(event) =>
                        setDetailAddress(event.target.value)
                      }
                      placeholder="상세주소를 입력해주세요. (예 : 6층, 601호)"
                    />

                    <Button
                      type="button"
                      variant="sub"
                      fullWidth
                      className="!h-[48px]"
                      onClick={handleSaveAddress}
                    >
                      저장하기
                    </Button>

                    {addressError ? (
                      <p className="text-xs text-error font-normal tracking-tight-sm">
                        {addressError}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <p className="whitespace-normal break-all text-[16px] leading-[160%] font-normal tracking-[-0.02em] text-black">
                    {deliveryAddress}
                  </p>
                )}
              </div>
            </Card>

            <div className="space-y-[6px] pb-8">
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
              disabled={
                isLoading ||
                !productDetail ||
                isSubmittingPayment
              }
              onClick={() => void handlePayment()}
            >
              {isSubmittingPayment
                ? '결제 준비 중...'
                : '구매하기'}
            </Button>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}

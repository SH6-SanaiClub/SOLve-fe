import { isAxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import MainLayout from '../../../components/layout/MainLayout'
import { getValueStoreProductPaymentCompletePath } from '../../../constants/routePaths'
import { verifyProductPayment } from '../../../services/paymentService'

const PRODUCT_PAYMENT_ADDRESS_KEY_PREFIX = 'product-payment-delivery-address:'
const PRODUCT_PAYMENT_LATEST_ADDRESS_KEY =
  'product-payment-delivery-address:latest'

export function ValueStorePaymentRedirectPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { productId } = useParams()
  const parsedProductId = Number(productId)
  const [error, setError] = useState('')
  const searchParams = new URLSearchParams(location.search)
  const impUid = searchParams.get('imp_uid')
  const merchantUid = searchParams.get('merchant_uid')
  const impSuccess = searchParams.get('imp_success')
  const success = searchParams.get('success')
  const deliveryAddressFromState =
    (location.state as { deliveryAddress?: string } | null)?.deliveryAddress ??
    ''
  const deliveryAddressFromStorage = merchantUid
    ? sessionStorage.getItem(
        `${PRODUCT_PAYMENT_ADDRESS_KEY_PREFIX}${merchantUid}`,
      ) ?? ''
    : ''
  const deliveryAddressFromLocalStorage = merchantUid
    ? localStorage.getItem(
        `${PRODUCT_PAYMENT_ADDRESS_KEY_PREFIX}${merchantUid}`,
      ) ?? ''
    : ''
  const latestDeliveryAddress =
    localStorage.getItem(PRODUCT_PAYMENT_LATEST_ADDRESS_KEY) ?? ''
  const deliveryAddress =
    deliveryAddressFromState ||
    deliveryAddressFromStorage ||
    deliveryAddressFromLocalStorage ||
    latestDeliveryAddress ||
    ''
  const immediateError =
    !Number.isInteger(parsedProductId) || parsedProductId <= 0
      ? '올바른 결제 정보가 아니에요.'
      : impSuccess === 'false' || success === 'false'
        ? '결제가 완료되지 않았어요. 다시 시도해주세요.'
        : !impUid || !merchantUid
          ? '결제 검증에 필요한 정보가 없어요.'
          : !deliveryAddress
            ? '배송지 정보가 없어요. 다시 결제를 시도해주세요.'
          : ''
  const verificationKey =
    !immediateError && impUid && merchantUid
      ? `product-payment-verify:${parsedProductId}:${impUid}:${merchantUid}`
      : ''
  const currentMessage = immediateError || error
  const title = currentMessage
    ? '결제 확인 중 문제가 발생했어요'
    : '결제 정보를 확인하고 있어요'
  const description = currentMessage || '잠시만 기다려주세요.'

  useEffect(() => {
    if (immediateError || !impUid || !merchantUid) {
      return
    }

    if (verificationKey && sessionStorage.getItem(verificationKey)) {
      return
    }

    const verifyPayment = async () => {
      const payload = {
        productId: parsedProductId,
        impUid,
        merchantUid,
        deliveryAddress,
      }

      try {
        if (verificationKey) {
          sessionStorage.setItem(verificationKey, 'pending')
        }

        const paymentResult = await verifyProductPayment(payload)

        if (verificationKey) {
          sessionStorage.setItem(verificationKey, 'done')
        }
        sessionStorage.removeItem(
          `${PRODUCT_PAYMENT_ADDRESS_KEY_PREFIX}${merchantUid}`,
        )
        localStorage.removeItem(
          `${PRODUCT_PAYMENT_ADDRESS_KEY_PREFIX}${merchantUid}`,
        )
        localStorage.removeItem(PRODUCT_PAYMENT_LATEST_ADDRESS_KEY)

        navigate(getValueStoreProductPaymentCompletePath(parsedProductId), {
          replace: true,
          state: {
            paymentResult,
          },
        })
      } catch (verifyError) {
        if (isAxiosError(verifyError)) {
          console.error('상품 결제 리디렉션 검증 실패', {
            requestPayload: payload,
            status: verifyError.response?.status,
            responseBody: verifyError.response?.data,
            message: verifyError.message,
          })
        } else {
          console.error('상품 결제 리디렉션 검증 실패', {
            requestPayload: payload,
            error: verifyError,
          })
        }

        if (verificationKey) {
          sessionStorage.removeItem(verificationKey)
        }

        setError('결제 검증에 실패했어요. 잠시 후 다시 시도해주세요.')
      }
    }

    void verifyPayment()
  }, [
    immediateError,
    impUid,
    merchantUid,
    navigate,
    parsedProductId,
    deliveryAddress,
    verificationKey,
  ])

  return (
    <MainLayout className="bg-white">
      <section className="mx-[-16px] flex min-h-[calc(100vh-48px)] items-center justify-center bg-white px-8">
        <div className="flex w-full max-w-[320px] flex-col items-center justify-center text-center">
          <div className="space-y-3">
            <h2 className="text-[22px] leading-[140%] font-semibold tracking-[-0.02em] text-font-main">
              {title}
            </h2>
            <p className="text-[15px] leading-[160%] font-normal tracking-[-0.02em] text-font-sub">
              {description}
            </p>
          </div>

          <div
            className="mt-8 h-10 w-10 animate-spin rounded-full border-[3px] border-gray-200 border-t-primary-500"
            aria-label="결제 확인 중"
          />
        </div>
      </section>
    </MainLayout>
  )
}

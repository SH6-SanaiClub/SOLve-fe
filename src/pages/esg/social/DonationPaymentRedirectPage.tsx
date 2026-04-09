import { isAxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import MainLayout from '../../../components/layout/MainLayout'
import { getDonationPaymentCompletePath } from '../../../constants/routePaths'
import { verifyDonationPayment } from '../../../services/paymentService'

export function DonationPaymentRedirectPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { donationId } = useParams()
  const parsedDonationId = Number(donationId)
  const [error, setError] = useState('')
  const searchParams = new URLSearchParams(location.search)
  const impUid = searchParams.get('imp_uid')
  const merchantUid = searchParams.get('merchant_uid')
  const impSuccess = searchParams.get('imp_success')
  const success = searchParams.get('success')
  const immediateError =
    !Number.isInteger(parsedDonationId) || parsedDonationId <= 0
      ? '올바른 결제 정보가 아니에요.'
      : impSuccess === 'false' || success === 'false'
        ? '결제가 완료되지 않았어요. 다시 시도해주세요.'
        : !impUid || !merchantUid
          ? '결제 검증에 필요한 정보가 없어요.'
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

    const verifyPayment = async () => {
      const payload = {
        donationId: parsedDonationId,
        impUid,
        merchantUid,
      }

      try {
        const paymentResult = await verifyDonationPayment(payload)

        navigate(getDonationPaymentCompletePath(parsedDonationId), {
          replace: true,
          state: {
            paymentResult,
          },
        })
      } catch (verifyError) {
        if (isAxiosError(verifyError)) {
          console.error('리디렉션 결제 검증 실패', {
            requestPayload: payload,
            status: verifyError.response?.status,
            responseBody: verifyError.response?.data,
            message: verifyError.message,
          })
        } else {
          console.error('리디렉션 결제 검증 실패', {
            requestPayload: payload,
            error: verifyError,
          })
        }

        setError('결제 검증에 실패했어요. 잠시 후 다시 시도해주세요.')
      }
    }

    void verifyPayment()
  }, [immediateError, impUid, merchantUid, navigate, parsedDonationId])

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

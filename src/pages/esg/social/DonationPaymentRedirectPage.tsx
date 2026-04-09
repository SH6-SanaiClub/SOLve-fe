import { isAxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../../components/common'
import Header from '../../../components/layout/Header'
import MainLayout from '../../../components/layout/MainLayout'
import {
  getDonationPaymentCompletePath,
  getDonationPaymentPath,
  ROUTE_PATHS,
} from '../../../constants/routePaths'
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
    <MainLayout header={<Header title="결제 확인 중" />} className="bg-gray-50">
      <section className="mx-[-16px] flex min-h-[calc(100vh-var(--header-h)-48px)] items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-[420px] rounded-card bg-white p-6 text-center shadow-card">
          {immediateError || error ? (
            <>
              <h2 className="text-lg font-semibold text-font-main">
                결제 확인 중 문제가 발생했어요
              </h2>
              <p className="mt-2 text-sm leading-6 text-font-sub">
                {immediateError || error}
              </p>
              <div className="mt-5">
                <Button
                  onClick={() =>
                    navigate(
                      donationId
                        ? getDonationPaymentPath(donationId)
                        : ROUTE_PATHS.activitySocialDonation,
                      { replace: true },
                    )
                  }
                >
                  결제 페이지로 돌아가기
                </Button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-font-main">
                결제 정보를 확인하고 있어요
              </h2>
              <p className="mt-2 text-sm leading-6 text-font-sub">
                잠시만 기다려주세요.
              </p>
            </>
          )}
        </div>
      </section>
    </MainLayout>
  )
}

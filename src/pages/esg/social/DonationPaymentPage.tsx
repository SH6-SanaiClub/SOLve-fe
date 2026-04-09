import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, IconButton, Radio } from '../../../components/common'
import { Icons } from '../../../components/common'
import Header from '../../../components/layout/Header'
import MainLayout from '../../../components/layout/MainLayout'
import {
  getDonationDetailPath,
  getDonationPaymentCallbackPath,
  getDonationPaymentCompletePath,
  ROUTE_PATHS,
} from '../../../constants/routePaths'
import { getDonationDetail } from '../../../services/donationService'
import {
  prepareDonationPayment,
  verifyDonationPayment,
} from '../../../services/paymentService'
import {
  PortOnePaymentError,
  requestDonationPortOnePayment,
} from '../../../services/portoneService'
import type { DonationDetail } from '../../../types/donation'
import type { VerifyDonationPaymentResponse } from '../../../types/payment'

const PRESET_AMOUNTS = [30000, 50000, 70000, 100000] as const
const MIN_DONATION_AMOUNT = 30000

const formatAmountOption = (amount: number) =>
  `${new Intl.NumberFormat('ko-KR').format(amount)} 원`
const formatAmountInput = (value: string) =>
  value ? new Intl.NumberFormat('ko-KR').format(Number(value)) : ''
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

  return `${normalizedBaseUrl}${normalizedImageUrl}`
}

export function DonationPaymentPage() {
  const navigate = useNavigate()
  const { donationId } = useParams()
  const parsedDonationId = Number(donationId)
  const [donationDetail, setDonationDetail] = useState<DonationDetail | null>(
    null,
  )
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAmount, setSelectedAmount] = useState<number | null>(30000)
  const [customAmountInput, setCustomAmountInput] = useState('')
  const [isCustomInputActive, setIsCustomInputActive] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'solpay' | 'card'>('card')
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false)
  const [verifyError, setVerifyError] = useState('')

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    if (donationId) {
      navigate(getDonationDetailPath(donationId))
      return
    }

    navigate(ROUTE_PATHS.activitySocialDonation)
  }

  const requestDonationDetail = useCallback(async () => {
    if (!Number.isInteger(parsedDonationId) || parsedDonationId <= 0) {
      setDonationDetail(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    try {
      const response = await getDonationDetail(parsedDonationId)
      setDonationDetail(response)
    } catch (fetchError) {
      console.error(fetchError)
      setDonationDetail(null)
    } finally {
      setIsLoading(false)
    }
  }, [parsedDonationId])

  useEffect(() => {
    void requestDonationDetail()
  }, [requestDonationDetail])

  const verifyAndMoveToCompletePage = useCallback(
    async (impUid: string, merchantUid: string) => {
      const verifiedPayment: VerifyDonationPaymentResponse =
        await verifyDonationPayment({
          donationId: parsedDonationId,
          impUid,
          merchantUid,
        })

      navigate(getDonationPaymentCompletePath(parsedDonationId), {
        replace: true,
        state: {
          paymentResult: verifiedPayment,
        },
      })
    },
    [navigate, parsedDonationId],
  )

  const customAmount = customAmountInput ? Number(customAmountInput) : 0
  const finalAmount = isCustomInputActive ? customAmount : (selectedAmount ?? 0)
  const expectedPoint = Math.floor(finalAmount * 0.03)
  const isPaymentDisabled =
    finalAmount < MIN_DONATION_AMOUNT ||
    isSubmittingPayment ||
    !donationDetail

  const handlePayment = async () => {
    if (!donationDetail || isPaymentDisabled) {
      return
    }

    setIsSubmittingPayment(true)
    setVerifyError('')

    try {
      const preparedPayment = await prepareDonationPayment({
        donationId: donationDetail.donationId,
        amount: finalAmount,
      })

      const paymentResponse = await requestDonationPortOnePayment({
        merchantUid: preparedPayment.merchantUid,
        donationName: preparedPayment.donationName,
        amount: preparedPayment.amount,
        paymentMethod,
        redirectUrl: `${window.location.origin}${getDonationPaymentCallbackPath(donationDetail.donationId)}`,
      })

      console.info('포트원 결제 성공 콜백', {
        imp_uid: paymentResponse.imp_uid,
        merchant_uid: paymentResponse.merchant_uid,
        response: paymentResponse,
      })

      if (!paymentResponse.imp_uid || !paymentResponse.merchant_uid) {
        throw new Error('결제 검증에 필요한 정보가 누락되었어요.')
      }

      await verifyAndMoveToCompletePage(
        paymentResponse.imp_uid,
        paymentResponse.merchant_uid,
      )
    } catch (error) {
      if (error instanceof PortOnePaymentError) {
        console.error('포트원 결제 실패 콜백', {
          imp_uid: error.response.imp_uid,
          merchant_uid: error.response.merchant_uid,
          response: error.response,
        })
        window.alert(error.response.error_msg ?? '결제가 완료되지 않았어요.')
      } else {
        console.error('결제 준비 또는 검증 실패', error)
        setVerifyError('결제 검증에 실패했어요. 잠시 후 다시 시도해주세요.')
        window.alert('결제 준비 또는 검증에 실패했어요. 잠시 후 다시 시도해주세요.')
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
          title="기부"
        />
      }
      className="bg-gray-50"
    >
      <section className="mx-[-16px] mb-[-24px] bg-gray-50 pt-6 pb-[104px]">
        {isLoading ? (
          <div className="space-y-5 px-[21px]">
            <div className="h-[216px] animate-pulse rounded-control bg-gray-300" />
            <div className="space-y-3">
              <div className="h-8 w-3/4 animate-pulse rounded-full bg-gray-300" />
              <div className="h-5 w-1/2 animate-pulse rounded-full bg-gray-200" />
            </div>
          </div>
        ) : donationDetail ? (
          <div className="space-y-[27px]">
            <div className="px-[21px]">
              <div className="relative overflow-hidden rounded-control border border-gray-200 bg-black">
                <img
                  src={resolveImageUrl(donationDetail.imageUrl)}
                  alt={donationDetail.name}
                  className="h-[216px] w-full object-contain"
                />
                <div className="absolute inset-x-0 bottom-0 h-[96px] bg-linear-to-t from-black to-transparent" />
                <div className="absolute right-[24px] bottom-[20px] left-[24px] flex flex-col gap-[8px]">
                  <h2 className="text-[20px] leading-4 font-bold text-white">
                    {donationDetail.name}
                  </h2>
                  <p className="text-base leading-4 font-light text-gray-300">
                    {donationDetail.summary}
                  </p>
                </div>
              </div>
            </div>

            <section className="px-[21px]">
              <div className="flex flex-col gap-[6px]">
                <h3 className="text-base leading-7 font-semibold text-gray-800">
                  기부 금액 선택
                </h3>

                <div className="flex flex-col gap-[25px]">
                  <div className="flex flex-col">
                    <div className="grid grid-cols-2 gap-4">
                      {PRESET_AMOUNTS.map((amount) => {
                        const isSelected =
                          !isCustomInputActive && selectedAmount === amount

                        return (
                          <Button
                            key={amount}
                            type="button"
                            variant="gray"
                            fullWidth
                            onClick={() => {
                              setSelectedAmount(amount)
                              setCustomAmountInput('')
                              setIsCustomInputActive(false)
                            }}
                            className={`!border !border-solid !bg-transparent shadow-[0_2px_8px_rgba(0,0,0,0.05)] ${
                              isSelected
                                ? '!border-primary-500 !text-primary-500'
                                : '!border-gray-400 !text-gray-400'
                            }`}
                          >
                            {formatAmountOption(amount)}
                          </Button>
                        )
                      })}
                    </div>

                    <div
                      className={`mt-4 h-12 overflow-hidden rounded-control bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)] ${
                        isCustomInputActive
                          ? 'border border-primary-500'
                          : 'border border-transparent'
                      }`}
                    >
                      <label className="flex h-full items-center justify-between px-[18px]">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={formatAmountInput(customAmountInput)}
                          onFocus={() => {
                            setIsCustomInputActive(true)
                            setSelectedAmount(null)
                          }}
                          onChange={(event) => {
                            const numericValue = event.target.value.replace(
                              /[^0-9]/g,
                              '',
                            )
                            const normalizedValue = numericValue.replace(
                              /^0+/,
                              '',
                            )

                            setCustomAmountInput(normalizedValue)
                            setIsCustomInputActive(true)
                            setSelectedAmount(null)
                          }}
                          onBlur={() => {
                            if (
                              customAmountInput &&
                              Number(customAmountInput) < MIN_DONATION_AMOUNT
                            ) {
                              setCustomAmountInput(String(MIN_DONATION_AMOUNT))
                            }
                          }}
                          placeholder="직접 입력하기"
                          className="w-full border-0 bg-transparent text-right text-base leading-4 font-normal text-font-main outline-none placeholder:text-left placeholder:text-gray-400"
                        />
                        <span className="ml-3 shrink-0 text-base leading-4 font-medium text-font-main">
                          원
                        </span>
                      </label>
                    </div>

                    <div className="mt-3 flex items-center justify-between px-3">
                      <p className="text-xs leading-7 font-normal text-gray-800">
                        예상 적립 포인트
                      </p>
                      <p className="text-xs leading-7 font-semibold text-gray-800">
                        {formatPoint(expectedPoint)}
                      </p>
                    </div>

                    {verifyError ? (
                      <p className="mt-2 px-1 text-xs text-red-500">{verifyError}</p>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-[6px]">
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
              </div>
            </section>
          </div>
        ) : null}
      </section>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50">
        <section className="pointer-events-auto mx-auto w-full max-w-[600px] bg-white px-5 pt-4 pb-[calc(20px+env(safe-area-inset-bottom))]">
          <Button fullWidth disabled={isPaymentDisabled} onClick={() => void handlePayment()}>
            결제하기
          </Button>
        </section>
      </div>
    </MainLayout>
  )
}

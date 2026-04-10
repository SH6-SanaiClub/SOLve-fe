import type {
  PortOneGlobal,
  PortOnePaymentResponse,
  PortOneRequestPayParams,
} from '../types/portone'

const PORTONE_SDK_URL = 'https://cdn.iamport.kr/v1/iamport.js'
const PORTONE_IMP_CODE = import.meta.env.VITE_PORTONE_IMP_CODE
const PORTONE_CHANNEL_KEY = import.meta.env.VITE_PORTONE_CHANNEL_KEY

const loadPortOneSdk = async (): Promise<PortOneGlobal> => {
  if (window.IMP) {
    return window.IMP
  }

  await new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${PORTONE_SDK_URL}"]`,
    )

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true })
      existingScript.addEventListener(
        'error',
        () => reject(new Error('포트원 SDK를 불러오지 못했어요.')),
        { once: true },
      )
      return
    }

    const script = document.createElement('script')
    script.src = PORTONE_SDK_URL
    script.async = true
    script.onload = () => resolve()
    script.onerror = () =>
      reject(new Error('포트원 SDK를 불러오지 못했어요.'))

    document.head.appendChild(script)
  })

  if (!window.IMP) {
    throw new Error('포트원 SDK가 초기화되지 않았어요.')
  }

  return window.IMP
}

export const getPortOne = async (): Promise<PortOneGlobal> => {
  if (!PORTONE_IMP_CODE) {
    throw new Error('포트원 가맹점 식별 코드가 설정되지 않았어요.')
  }

  const IMP = await loadPortOneSdk()
  IMP.init(PORTONE_IMP_CODE)

  return IMP
}

export interface RequestDonationPortOnePaymentParams {
  merchantUid: string
  donationName: string
  amount: number
  paymentMethod: 'solpay' | 'card'
  buyerName?: string
  buyerTel?: string
  redirectUrl?: string
}

export interface RequestProductPortOnePaymentParams {
  merchantUid: string
  productName: string
  amount: number
  paymentMethod: 'solpay' | 'card'
  buyerName?: string
  buyerTel?: string
  redirectUrl?: string
}

export class PortOnePaymentError extends Error {
  response: PortOnePaymentResponse

  constructor(response: PortOnePaymentResponse) {
    super(response.error_msg ?? '결제가 완료되지 않았어요.')
    this.name = 'PortOnePaymentError'
    this.response = response
  }
}

const buildRequestParams = ({
  merchantUid,
  donationName,
  amount,
  paymentMethod,
  buyerName,
  buyerTel,
  redirectUrl,
}: RequestDonationPortOnePaymentParams): PortOneRequestPayParams => {
  if (!PORTONE_CHANNEL_KEY) {
    throw new Error('포트원 채널 키가 설정되지 않았어요.')
  }

  return {
    channelKey: PORTONE_CHANNEL_KEY,
    pay_method: paymentMethod === 'card' ? 'card' : 'trans',
    merchant_uid: merchantUid,
    name: donationName,
    amount,
    buyer_name: buyerName,
    buyer_tel: buyerTel,
    m_redirect_url: redirectUrl,
  }
}

export const requestDonationPortOnePayment = async (
  params: RequestDonationPortOnePaymentParams,
): Promise<PortOnePaymentResponse> => {
  const IMP = await getPortOne()
  const requestParams = buildRequestParams(params)

  return new Promise<PortOnePaymentResponse>((resolve, reject) => {
    IMP.request_pay(requestParams, (response) => {
      if (response.success) {
        resolve(response)
        return
      }

      reject(new PortOnePaymentError(response))
    })
  })
}

export const requestProductPortOnePayment = async ({
  merchantUid,
  productName,
  amount,
  paymentMethod,
  buyerName,
  buyerTel,
  redirectUrl,
}: RequestProductPortOnePaymentParams): Promise<PortOnePaymentResponse> => {
  const IMP = await getPortOne()
  const requestParams = buildRequestParams({
    merchantUid,
    donationName: productName,
    amount,
    paymentMethod,
    buyerName,
    buyerTel,
    redirectUrl,
  })

  return new Promise<PortOnePaymentResponse>((resolve, reject) => {
    IMP.request_pay(requestParams, (response) => {
      if (response.success) {
        resolve(response)
        return
      }

      reject(new PortOnePaymentError(response))
    })
  })
}

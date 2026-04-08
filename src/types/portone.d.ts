export interface PortOneRequestPayParams {
  channelKey: string
  pay_method: string
  merchant_uid: string
  name: string
  amount: number
  m_redirect_url?: string
}

export interface PortOnePaymentResponse {
  success: boolean
  imp_uid?: string | null
  merchant_uid?: string | null
  error_code?: string | null
  error_msg?: string | null
  pay_method?: string | null
  paid_amount?: number | null
}

export interface PortOneGlobal {
  init: (userCode: string) => void
  request_pay: (
    params: PortOneRequestPayParams,
    callback: (response: PortOnePaymentResponse) => void,
  ) => void
}

declare global {
  interface Window {
    IMP?: PortOneGlobal
  }
}

export {}


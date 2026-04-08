import { apiClient } from './apiClient'
import type {
  PrepareDonationPaymentRequest,
  PrepareDonationPaymentResponse,
} from '../types/payment'

export const prepareDonationPayment = async (
  payload: PrepareDonationPaymentRequest,
): Promise<PrepareDonationPaymentResponse> => {
  const response = await apiClient.post<PrepareDonationPaymentResponse>(
    '/v1/payments/prepare',
    payload,
  )

  return response.data
}


import { apiClient } from './apiClient'
import type {
  PrepareDonationPaymentRequest,
  PrepareDonationPaymentResponse,
  PrepareProductPaymentRequest,
  PrepareProductPaymentResponse,
  VerifyDonationPaymentRequest,
  VerifyDonationPaymentResponse,
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

export const prepareProductPayment = async (
  payload: PrepareProductPaymentRequest,
): Promise<PrepareProductPaymentResponse> => {
  const response = await apiClient.post<PrepareProductPaymentResponse>(
    '/v1/payments/products/prepare',
    payload,
  )

  return response.data
}

export const verifyDonationPayment = async (
  payload: VerifyDonationPaymentRequest,
): Promise<VerifyDonationPaymentResponse> => {
  const response = await apiClient.post<VerifyDonationPaymentResponse>(
    '/v1/payments/verify',
    payload,
  )

  return response.data
}

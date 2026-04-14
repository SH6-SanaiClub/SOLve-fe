import { apiClient } from './apiClient'
import type {
  FinanceApplyResponse,
  FinanceHistoryResponse,
  FinanceListProduct,
  FinanceListResponse,
  FinanceLoanApplyRequest,
  FinanceLoanPreview,
  FinanceMyResponse,
  FinanceProductListQueryType,
  FinanceSavingsApplyRequest,
  FinanceSavingHistoryItem,
  SavingsRecommendResponse,
} from '../types/finance'

export const getSavingsRecommend = async (): Promise<SavingsRecommendResponse> => {
  const response = await apiClient.get<SavingsRecommendResponse>('/v1/finance/recommend')
  return response.data
}

export const getFinanceProducts = async (
  type: FinanceProductListQueryType,
): Promise<FinanceListProduct[]> => {
  const response = await apiClient.get<FinanceListResponse>('/v1/finance/list', {
    params: { type },
  })

  return response.data.products
}

export const getFinanceLoanPreview = async (
  productId: number | string,
): Promise<FinanceLoanPreview> => {
  const response = await apiClient.get<FinanceLoanPreview>(
    `/v1/finance/loans/${productId}/preview`,
  )

  return response.data
}

export const applyFinanceLoan = async (
  payload: FinanceLoanApplyRequest,
): Promise<FinanceApplyResponse> => {
  const response = await apiClient.post<FinanceApplyResponse>(
    '/v1/finance/loans/apply',
    payload,
  )

  return response.data
}

export const applyFinanceSavings = async (
  payload: FinanceSavingsApplyRequest,
): Promise<FinanceApplyResponse> => {
  const response = await apiClient.post<FinanceApplyResponse>(
    '/v1/finance/savings/apply',
    payload,
  )

  return response.data
}

export const getMyFinanceProducts = async (): Promise<FinanceMyResponse> => {
  const response = await apiClient.get<FinanceMyResponse>('/v1/finance/my')
  return response.data
}

export const getFinanceHistory = async (): Promise<FinanceHistoryResponse> => {
  const response = await apiClient.get<FinanceHistoryResponse>('/v1/finance/history')
  return response.data
}

export const getFinanceSavingHistory = async (
  savingId: number | string,
): Promise<FinanceSavingHistoryItem[]> => {
  const response = await apiClient.get<FinanceSavingHistoryItem[]>(
    `/v1/finance/savings/${savingId}/history`,
  )

  return response.data
}

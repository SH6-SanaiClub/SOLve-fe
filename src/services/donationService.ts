import { apiClient } from './apiClient'
import type {
  DonationDetail,
  DonationHistoryResponse,
  DonationListResponse,
} from '../types/donation'

export const getDonationCampaigns = async (): Promise<DonationListResponse> => {
  const response = await apiClient.get<DonationListResponse>('/v1/esg/s/donations')
  return response.data
}

export const getDonationDetail = async (donationId: number): Promise<DonationDetail> => {
  const response = await apiClient.get<DonationDetail>(`/v1/esg/s/donations/${donationId}`)
  return response.data
}

export const getDonationHistories = async (): Promise<DonationHistoryResponse> => {
  const response = await apiClient.get<DonationHistoryResponse>('/v1/esg/s/donations/history')
  return response.data
}

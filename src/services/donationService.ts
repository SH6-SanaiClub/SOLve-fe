import { apiClient } from './apiClient'
import type { DonationDetail, DonationListResponse } from '../types/donation'

export const getDonationCampaigns = async (): Promise<DonationListResponse> => {
  const response = await apiClient.get<DonationListResponse>('/v1/esg/s/donations')
  return response.data
}

export const getDonationDetail = async (donationId: number): Promise<DonationDetail> => {
  const response = await apiClient.get<DonationDetail>(`/v1/esg/s/donations/${donationId}`)
  return response.data
}

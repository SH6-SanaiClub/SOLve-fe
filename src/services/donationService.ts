import { apiClient } from './apiClient'
import { donationMockResponse } from '../pages/activities/donationData'
import type { DonationListResponse } from '../types/donation'

const DONATION_MOCK_DELAY_MS = 250

const wait = (delayMs: number) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, delayMs)
  })

const shouldUseDonationMock = import.meta.env.VITE_USE_DONATION_MOCK === 'true'

export const getDonationCampaigns = async (): Promise<DonationListResponse> => {
  if (shouldUseDonationMock) {
    await wait(DONATION_MOCK_DELAY_MS)
    return donationMockResponse
  }

  try {
    const response = await apiClient.get<DonationListResponse>('/v1/esg/s/donations')
    return response.data
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('기부 API 연결에 실패해 mock 데이터를 사용합니다.', error)
      await wait(DONATION_MOCK_DELAY_MS)
      return donationMockResponse
    }

    throw error
  }
}

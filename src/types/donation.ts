export interface DonationSummary {
  totalDonationAmount: number
  totalParticipantCount: number
  donationCount: number
}

export interface DonationCampaign {
  donationId: number
  name: string
  description: string
  targetAmount: number
  currentAmount: number
  imageUrl: string
  participantCount: number
  progressPercentage: number
  startDate: string
  endDate: string
}

export interface DonationListResponse {
  summary: DonationSummary
  donations: DonationCampaign[]
}

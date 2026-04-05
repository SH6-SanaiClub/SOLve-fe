export interface DonationSummary {
  totalDonationAmount: number
  totalParticipantCount: number
  donationCount: number
}

export interface DonationCampaign {
  donationId: number
  name: string
  summary: string
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

export interface DonationDetail {
  donationId: number
  name: string
  summary: string
  description: string
  targetAmount: number
  currentAmount: number
  imageUrl: string
  participantCount: number
  progressPercentage: number
  remainingDays: number
  startDate: string
  endDate: string
}

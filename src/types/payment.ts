export interface PrepareDonationPaymentRequest {
  donationId: number
  amount: number
}

export interface PrepareDonationPaymentResponse {
  merchantUid: string
  donationId: number
  donationName: string
  amount: number
}


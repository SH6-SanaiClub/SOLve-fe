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

export interface VerifyDonationPaymentRequest {
  donationId: number
  impUid: string
  merchantUid: string
}

export interface VerifyDonationPaymentResponse {
  paymentId: number
  donationId: number
  donationName: string
  amount: number
  paymentStatus: 'paid' | string
  awardedPoint: number
  currentPoint: number
}

export interface PrepareProductPaymentRequest {
  productId: number
}

export interface PrepareProductPaymentResponse {
  merchantUid: string
  productId: number
  storeName: string
  productName: string
  amount: number
}

export interface VerifyProductPaymentRequest {
  productId: number
  impUid: string
  merchantUid: string
  deliveryAddress: string
}

export interface VerifyProductPaymentResponse {
  paymentId: number
  productId: number
  storeName: string
  productName: string
  amount: number
  paymentStatus: 'paid' | string
  awardedPoint: number
  currentPoint: number
}

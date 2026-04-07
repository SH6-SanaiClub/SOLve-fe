export type EnvActivityType = 'tumbler' | 'shared-bike' | 'ev-rental'

export interface EnvironmentVerificationExtractedData {
  amount?: number
  merchantName?: string
  transactionDateTime?: string
  rideMinutes?: number
  distanceKm?: number
  vehicleModel?: string
  carNumber?: string
  fuelType?: string
}

export interface EnvironmentVerificationResponse {
  verificationId: number
  activityType: EnvActivityType
  approved: boolean
  rewardPoint?: number
  extracted?: EnvironmentVerificationExtractedData | null
}

export interface EnvironmentVerificationAvailabilityResponse {
  activityType: EnvActivityType
  attemptedToday: boolean
}

export interface SubmitEnvironmentVerificationRequest {
  activityType: EnvActivityType
  image: File
}

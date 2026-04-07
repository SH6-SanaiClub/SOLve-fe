export type EnvActivityType = 'tumbler' | 'shared-bike' | 'ev-rental'

export interface EnvironmentVerificationResponse {
  verificationId: number
  activityType: EnvActivityType
  approved: boolean
  rewardPoint?: number
}

export interface EnvironmentVerificationAvailabilityResponse {
  activityType: EnvActivityType
  attemptedToday: boolean
  approved: boolean | null
}

export interface SubmitEnvironmentVerificationRequest {
  activityType: EnvActivityType
  image: File
}

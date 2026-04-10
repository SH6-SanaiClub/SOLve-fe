export interface UserProfile {
  loginId: string
  name: string
  email: string
  phoneNumber: string
  birthdate: string
  joinedAt: string
}

export interface UpdateMyPhoneNumberResponse {
  phoneNumber: string
  message: string
}

export interface UpdateMyEmailResponse {
  email: string
  message: string
}

export interface CheckMyPasswordResponse {
  matched: boolean
  message: string
}

export interface UpdateMyPasswordResponse {
  message: string
}

export interface WithdrawMyAccountResponse {
  message: string
}

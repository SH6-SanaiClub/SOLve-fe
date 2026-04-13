import { apiClient } from './apiClient'
import type {
  CheckMyPasswordResponse,
  UpdateMyEmailResponse,
  UpdateMyPasswordResponse,
  UpdateMyPhoneNumberResponse,
  WithdrawMyAccountResponse,
  UserProfile,
} from '../types/userProfile'

export const getMyProfile = async (): Promise<UserProfile> => {
  const response = await apiClient.get<UserProfile>('/my/profile')
  return response.data
}

export const updateMyPhoneNumber = async (
  impUid: string,
): Promise<UpdateMyPhoneNumberResponse> => {
  const response = await apiClient.patch<UpdateMyPhoneNumberResponse>('/my/profile/phone', {
    impUid,
  })

  return response.data
}

export const updateMyEmail = async (email: string): Promise<UpdateMyEmailResponse> => {
  const response = await apiClient.patch<UpdateMyEmailResponse>('/my/profile/email', {
    email,
  })

  return response.data
}

export const checkMyPassword = async (
  currentPassword: string,
): Promise<CheckMyPasswordResponse> => {
  const response = await apiClient.post<CheckMyPasswordResponse>('/my/profile/password/check', {
    currentPassword,
  })

  return response.data
}

export const updateMyPassword = async (
  currentPassword: string,
  newPassword: string,
  newPasswordConfirm: string,
): Promise<UpdateMyPasswordResponse> => {
  const response = await apiClient.patch<UpdateMyPasswordResponse>('/my/profile/password', {
    currentPassword,
    newPassword,
    newPasswordConfirm,
  })

  return response.data
}

export const withdrawMyAccount = async (): Promise<WithdrawMyAccountResponse> => {
  const response = await apiClient.patch<WithdrawMyAccountResponse>('/my/profile/withdraw')

  return response.data
}

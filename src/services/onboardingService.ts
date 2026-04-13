import { apiClient } from './apiClient'
import type { UserType } from '../types/user'

export interface SurveyStatusResponse {
  surveyCompleted: boolean
  userType: string
}

export const getSurveyStatus = async (): Promise<SurveyStatusResponse> => {
  const res = await apiClient.get<SurveyStatusResponse>('/v1/onboarding/status')
  return res.data
}

export const submitSurvey = async (userType: UserType): Promise<void> => {
  await apiClient.post('/v1/onboarding/survey', { userType })
}

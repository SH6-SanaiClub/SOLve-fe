import { apiClient } from './apiClient'
import type { UserType } from '../types/user'

export interface SurveyStatusResponse {
  surveyCompleted: boolean
  userType: UserType | null
}

export interface SurveySubmitPayload {
  environmentWeight: number
  socialWeight: number
  financeWeight: number
}

export const getSurveyStatus = async (): Promise<SurveyStatusResponse> => {
  const res = await apiClient.get<SurveyStatusResponse>('/v1/survey/status')
  return res.data
}

export const submitSurvey = async (
  payload: SurveySubmitPayload,
): Promise<SurveyStatusResponse> => {
  await apiClient.post('/v1/survey/submit', payload)
  return getSurveyStatus()
}

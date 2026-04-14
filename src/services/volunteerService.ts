import { apiClient } from './apiClient'
import type {
  ApplyVolunteerRequest,
  VolunteerApplicationResponse,
  VolunteerAttendanceInfo,
  VolunteerCheckInRequest,
  VolunteerCheckInResponse,
  VolunteerCheckOutRequest,
  VolunteerCheckOutResponse,
  VolunteerDetail,
  VolunteerListResponse,
} from '../types/volunteer'

export const getVolunteerActivities = async (): Promise<VolunteerListResponse> => {
  const response = await apiClient.get<VolunteerListResponse>('/v1/esg/s/volunteers')
  return response.data
}

export const getVolunteerApplications = async (): Promise<VolunteerListResponse> => {
  const response = await apiClient.get<VolunteerListResponse>(
    '/v1/esg/s/volunteers/applications',
  )
  return response.data
}

export const getVolunteerDetail = async (
  volunteerId: number,
): Promise<VolunteerDetail> => {
  const response = await apiClient.get<VolunteerDetail>(
    `/v1/esg/s/volunteers/${volunteerId}`,
  )
  return response.data
}

export const applyVolunteer = async (
  payload: ApplyVolunteerRequest,
): Promise<VolunteerApplicationResponse> => {
  const response = await apiClient.post<VolunteerApplicationResponse>(
    '/v1/esg/s/volunteers/apply',
    payload,
  )
  return response.data
}

export const getVolunteerAttendanceInfo = async (
  token: string,
): Promise<VolunteerAttendanceInfo> => {
  const response = await apiClient.get<VolunteerAttendanceInfo>(
    `/v1/esg/s/volunteers/attendance?token=${encodeURIComponent(token)}`,
  )
  return response.data
}

export const checkInVolunteerAttendance = async (
  payload: VolunteerCheckInRequest,
): Promise<VolunteerCheckInResponse> => {
  const response = await apiClient.post<VolunteerCheckInResponse>(
    '/v1/esg/s/volunteers/check-in',
    payload,
  )
  return response.data
}

export const checkOutVolunteerAttendance = async (
  payload: VolunteerCheckOutRequest,
): Promise<VolunteerCheckOutResponse> => {
  const response = await apiClient.post<VolunteerCheckOutResponse>(
    '/v1/esg/s/volunteers/check-out',
    payload,
  )
  return response.data
}

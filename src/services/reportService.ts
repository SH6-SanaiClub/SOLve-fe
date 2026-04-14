import axios from 'axios'
import { APP_CONFIG } from '../constants/config'
import { apiClient } from './apiClient'
import type {
  ReportIssueResponse,
  ReportPeriodType,
  ReportPreviewResponse,
  ReportVerificationResponse,
} from '../types/report'

interface GetReportPreviewParams {
  periodType: ReportPeriodType
}

export const getReportPreview = async (
  params: GetReportPreviewParams,
): Promise<ReportPreviewResponse> => {
  const response = await apiClient.get<ReportPreviewResponse>('/my/reports/preview', {
    params,
  })
  return response.data
}

export const issueReport = async (periodType: ReportPeriodType): Promise<ReportIssueResponse> => {
  const response = await apiClient.post<ReportIssueResponse>('/my/reports/issues', {
    periodType,
  })
  return response.data
}

export const downloadReportPdf = async (issueId: number): Promise<Blob> => {
  const response = await apiClient.get<Blob>(`/my/reports/issues/${issueId}/pdf`, {
    responseType: 'blob',
  })
  return response.data
}

export const verifyReport = async (token: string): Promise<ReportVerificationResponse> => {
  const response = await axios.get<ReportVerificationResponse>(
    `${APP_CONFIG.apiBaseUrl}/reports/verify/${token}`,
  )
  return response.data
}

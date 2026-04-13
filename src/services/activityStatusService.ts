import { apiClient } from './apiClient'
import type {
  ActivityStatusFilter,
  ActivityStatusLogResponse,
  ActivityStatusOverviewResponse,
} from '../types/activityStatus'

interface GetActivityStatusLogsParams {
  category?: ActivityStatusFilter
  size?: number
  cursor?: string
}

export const getActivityStatusOverview = async (): Promise<ActivityStatusOverviewResponse> => {
  const response = await apiClient.get<ActivityStatusOverviewResponse>('/my/activity-status/overview')
  return response.data
}

export const getActivityStatusLogs = async (
  params: GetActivityStatusLogsParams = {},
): Promise<ActivityStatusLogResponse> => {
  const response = await apiClient.get<ActivityStatusLogResponse>('/my/activity-status/logs', {
    params,
  })
  return response.data
}

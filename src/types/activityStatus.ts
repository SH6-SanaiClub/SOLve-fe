import type { UserGrade } from './user'

export type ActivityStatusFilter = 'ALL' | 'E' | 'S' | 'G'
export type ActivityStatusCategory = Exclude<ActivityStatusFilter, 'ALL'>
export type ActivityStatusReason =
  | 'DONATION'
  | 'VOLUNTEER'
  | 'PURCHASE'
  | 'QUIZ'
  | 'PHOTO'
  | 'LOAN_REPAY'
  | 'CONSECUTIVE_BONUS'
  | 'ABUSE'
  | 'NO_ACTIVITY'
  | 'INITIAL_SCORE'

export interface ActivityStatusSummary {
  currentGrade: UserGrade
  totalScore: number
  progressCurrent: number
  progressTarget: number
  progressPercent: number
  currentMonthActivityCount: number
  consecutiveMaxAchievementMonths: number
  showConsecutiveAchievementBadge: boolean
  referenceDate: string
}

export interface ActivityStatusGradeHistoryItem {
  year: number
  month: number
  grade: UserGrade
  totalScore: number
  currentMonth: boolean
}

export interface ActivityStatusMonthlyScorePoint {
  year: number
  month: number
  score: number
  currentMonth: boolean
}

export interface ActivityStatusOverviewResponse {
  summary: ActivityStatusSummary
  gradeHistories: ActivityStatusGradeHistoryItem[]
  monthlyScoreGraph: ActivityStatusMonthlyScorePoint[]
}

export interface ActivityStatusLogItem {
  scoreHistoryId: number
  title: string
  category: ActivityStatusCategory
  reason: ActivityStatusReason
  occurredAt: string
}

export interface ActivityStatusLogResponse {
  totalCount: number
  hasNext: boolean
  nextCursor: string | null
  items: ActivityStatusLogItem[]
}

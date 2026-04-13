import type { UserGrade } from './user'

export type ReportPeriodType = '3M' | '6M' | '1Y'

export interface ReportCategorySummary {
  categoryKey: string
  label: string
  value: number
  unit: string
}

export interface ReportCertificateSnapshot {
  recipientName: string
  periodType: ReportPeriodType
  periodLabel: string
  referenceDate: string
  targetStartDate: string
  targetEndDate: string
  currentGrade: UserGrade
  totalScore: number
  verifiedActivityCount: number
  consecutiveMaxAchievementMonths: number
  showConsecutiveAchievementBadge: boolean
  categories: ReportCategorySummary[]
}

export interface ReportPreviewResponse {
  snapshot: ReportCertificateSnapshot
}

export interface ReportCertificateMeta {
  issueId: number
  certificateNumber: string
  verificationCode: string
  verificationUrl: string
  issuedAt: string
}

export interface ReportIssueResponse {
  certificate: ReportCertificateMeta
  snapshot: ReportCertificateSnapshot
}

export type ReportVerificationStatus = 'ACTIVE' | 'REVOKED' | 'INVALID'

export interface ReportVerificationResponse {
  valid: boolean
  verificationStatus: ReportVerificationStatus
  certificate: ReportCertificateMeta | null
  snapshot: ReportCertificateSnapshot | null
}

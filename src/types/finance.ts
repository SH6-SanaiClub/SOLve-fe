export type FinanceProductType = 'LOAN' | 'SAVINGS'
export type FinancialProductType = FinanceProductType
export type FinanceProductListQueryType = 'loan' | 'savings'
export type FinanceUnavailableReason =
  | 'AVAILABLE'
  | 'LOW_SCORE'
  | 'HAS_ACTIVE_LOAN'
  | 'LOAN_BLOCKED'
export type FinanceApplicationStatus =
  | 'ACTIVE'
  | 'COMPLETE'
  | 'EXPIRED'
  | 'CLOSED'
  | 'TERMINATED'
  | 'MATURED'
  | (string & {})
export type FinanceRateValue = number | string
export type FinanceSavingHistoryType = 'PAYMENT' | 'INTEREST'

export interface FinanceInfoField {
  label: string
  value: string
}

export interface FinanceLoanTier {
  scoreLabel: string
  limitLabel: string
  rateLabel: string
}

export interface FinanceProductCompletion {
  title: string
  description: string
  fields: FinanceInfoField[]
  primaryActionLabel: string
  primaryActionPath?: string
  secondaryActionLabel: string
}

export interface FinanceProduct {
  id: string
  type: FinancialProductType
  name: string
  badge?: string
  listDescription: string
  listRateLabel: string
  heroDescription: string
  heroImageSrc?: string
  heroRateSummary?: string
  heroRateHighlight?: string
  detailFields: FinanceInfoField[]
  benefitTitle: string
  benefitDescription: string
  noticeLines: string[]
  actionLabel: string
  loanTiers?: FinanceLoanTier[]
  userOfferLabel?: string
  applyTitle: string
  applyFields: FinanceInfoField[]
  completion: FinanceProductCompletion
}

export interface SavingsRecommendItem {
  productId: string
  productName: string
  matchScore: number
  expectedMaxRate: string
  reason: string
  actionable: string
  isNewUserRecommend: boolean
  isAlreadyJoined: boolean
  isIneligible: boolean
}

export interface SavingsRecommendResponse {
  isNewUser: boolean
  recommendation: SavingsRecommendItem
}

export interface FinanceListProduct {
  id: number
  name: string
  subtitle: string | null
  type: FinanceProductType
  baseRate: FinanceRateValue
  maxRate: FinanceRateValue
  appliedRate: FinanceRateValue | null
  loanLimit: number | null
  available: boolean
  durationMonths: number
  monthlyPaymentAmount: number | null
  description: string | null
}

export interface FinanceListResponse {
  products: FinanceListProduct[]
}

export interface FinanceLoanPreview {
  productId: number
  name: string
  subtitle: string
  description: string
  available: boolean
  reason: FinanceUnavailableReason
  loanLimit: number | null
  appliedRate: FinanceRateValue | null
  durationMonths: number
  baseScore: number
  hasActiveLoan: boolean
  loanBlocked: boolean
}

export interface FinanceLoanApplyRequest {
  loanId: number
  amount: number
}

export interface FinanceSavingsApplyRequest {
  productId: number
}

export interface FinanceApplyResponse {
  status: FinanceApplicationStatus
}

export interface FinanceMyLoan {
  loanId: number
  productId: number
  productName: string
  principalAmount: number
  totalAmount: number
  paidAmount: number
  remainingAmount: number
  repaymentCount: number
  currentRate: FinanceRateValue
  status: FinanceApplicationStatus
  durationMonths: number
  nextRepaymentDate: string
  createdAt: string
}

export interface FinanceMySaving {
  savingId: number
  productId: number
  productName: string
  monthlyAmount: number
  addedRate: FinanceRateValue
  appliedRate: FinanceRateValue
  paidAmount: number
  paymentCount: number
  remainingCount: number
  status: FinanceApplicationStatus
  durationMonths: number
  hasPenalty: boolean
  masterBonusEligible: boolean
  maturityDate: string
  joinedAt: string
}

export interface FinanceMyResponse {
  loans: FinanceMyLoan[]
  savings: FinanceMySaving[]
}

export interface FinanceLoanHistoryItem {
  historyId: number
  loanId: number
  productId: number
  productName: string
  amount: number
  paymentDate: string
}

export interface FinanceSavingHistoryItem {
  historyId: number
  savingId: number
  productId: number
  productName: string
  amount: number
  type: FinanceSavingHistoryType
  paymentDate: string
}

export interface FinanceHistoryResponse {
  loans: FinanceLoanHistoryItem[]
  savings: FinanceSavingHistoryItem[]
}

export interface FinanceDoneState {
  title: string
  description: string
  fields: FinanceInfoField[]
  primaryActionLabel: string
  primaryActionPath?: string
  secondaryActionLabel: string
}

export type FinancialProductType = 'LOAN' | 'SAVINGS'

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

import type {
  FinanceDoneState,
  FinanceInfoField,
  FinanceListProduct,
  FinanceLoanPreview,
  FinanceRateValue,
  FinanceUnavailableReason,
} from '../../types/finance'
import { ROUTE_PATHS } from '../../constants/routePaths'

const numberFormatter = new Intl.NumberFormat('ko-KR')

export const FINANCE_SECTION_LABELS = {
  SAVINGS: 'ESG \uC801\uAE08 \uC0C1\uD488',
  LOAN: 'ESG \uB300\uCD9C \uC0C1\uD488',
} as const

export const FINANCE_NOTICE_LINES = [
  '\uB9CC\uAE30 \uC804 \uD574\uC9C0 \uC2DC \uC57D\uC815\uD55C \uC774\uC728\uBCF4\uB2E4 \uB0AE\uC740 \uC911\uB3C4\uD574\uC9C0 \uAE08\uB9AC\uAC00 \uC801\uC6A9\uB429\uB2C8\uB2E4.',
  '\uC6B0\uB300 \uAE08\uB9AC\uB294 \uAC01 \uC870\uAC74 \uCDA9\uC871 \uC2DC \uB2E4\uC74C \uB2EC 1\uC77C\uBD80\uD130 \uB9CC\uAE30 \uC804\uC77C\uAE4C\uC9C0 \uC801\uC6A9\uB429\uB2C8\uB2E4.',
  '\uC774 \uC608\uAE08\uC740 \uC608\uAE08\uC790\uBCF4\uD638\uBC95\uC5D0 \uB530\uB77C 1\uC778\uB2F9 \uCD5C\uACE0 5\uCC9C\uB9CC \uC6D0\uAE4C\uC9C0 \uBCF4\uD638\uB429\uB2C8\uB2E4.',
]

export const LOAN_PREVIEW_REASON_LABEL: Record<FinanceUnavailableReason, string> = {
  AVAILABLE: '\uC2E0\uCCAD \uAC00\uB2A5\uD55C \uC0C1\uD488\uC785\uB2C8\uB2E4.',
  LOW_SCORE: '\uD604\uC7AC ESG \uC810\uC218\uB85C\uB294 \uB300\uCD9C \uC2E0\uCCAD\uC774 \uC5B4\uB824\uC6CC\uC694.',
  HAS_ACTIVE_LOAN: '\uAE30\uC874 \uB300\uCD9C\uC744 \uBCF4\uC720 \uC911\uC774\uB77C \uCD94\uAC00 \uB300\uCD9C\uC774 \uBD88\uAC00\uD569\uB2C8\uB2E4.',
  LOAN_BLOCKED: '\uD328\uB110\uD2F0 \uC0C1\uD0DC\uB85C \uB300\uCD9C \uC2E0\uCCAD\uC774 \uC81C\uD55C\uB418\uC5B4 \uC788\uC5B4\uC694.',
}

export const formatCurrency = (value: number | null | undefined) => {
  if (value == null) {
    return '-'
  }

  return `${numberFormatter.format(value)}\uC6D0`
}

export const toRateNumber = (value: FinanceRateValue | null | undefined) => {
  if (value == null) {
    return null
  }

  const numericValue = typeof value === 'number' ? value : Number(value)

  return Number.isFinite(numericValue) ? numericValue : null
}

export const formatRate = (value: FinanceRateValue | null | undefined) => {
  const numericValue = toRateNumber(value)

  if (numericValue == null) {
    return '-'
  }

  return `\uC5F0 ${numericValue.toFixed(1)}%`
}

export const formatRatePoint = (value: FinanceRateValue | null | undefined) => {
  const numericValue = toRateNumber(value)

  if (numericValue == null) {
    return '-'
  }

  return `+${numericValue.toFixed(1)}%p`
}

export const buildSavingsRateSummary = (product: FinanceListProduct) => {
  const baseRate = toRateNumber(product.baseRate) ?? 0
  const maxRate = toRateNumber(product.maxRate) ?? baseRate
  const bonusRate = Math.max(maxRate - baseRate, 0)

  return `\uAE30\uBCF8 \uC5F0 ${baseRate.toFixed(1)}% + \uC6B0\uB300 \uCD5C\uACE0 ${bonusRate.toFixed(1)}%`
}

export const formatDate = (value: string) => {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')

  return `${year}.${month}.${day}`
}

export const buildLoanLimitRateLabel = (
  loanLimit: number | null | undefined,
  appliedRate: FinanceRateValue | null | undefined,
) => {
  if (loanLimit == null || toRateNumber(appliedRate) == null) {
    return '\uD604\uC7AC \uC2E0\uCCAD \uBD88\uAC00'
  }

  return `${formatCurrency(loanLimit)} / ${formatRate(appliedRate)}`
}

export const buildSavingsDetailFields = (product: FinanceListProduct): FinanceInfoField[] => [
  { label: '\uAC00\uC785 \uB300\uC0C1', value: '\uC81C\uD55C \uC5C6\uC74C' },
  { label: '\uACC4\uC57D \uAE30\uAC04', value: `${product.durationMonths}\uAC1C\uC6D4` },
  {
    label: '\uAC00\uC785 \uAE08\uC561',
    value: formatCurrency(product.monthlyPaymentAmount ?? 300000),
  },
]

export const buildSavingsDoneState = (product: FinanceListProduct): FinanceDoneState => ({
  title: '\uAC00\uC785\uC774 \uC644\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4!',
  description: '\uC9C0\uC18D \uAC00\uB2A5\uD55C \uB0B4\uC77C\uC744 \uC704\uD55C\n\uB2F9\uC2E0\uC758 \uAC00\uCE58 \uC788\uB294 \uC120\uD0DD\uC744 \uC751\uC6D0\uD569\uB2C8\uB2E4.',
  fields: [
    { label: '\uAC00\uC785 \uC0C1\uD488', value: product.name },
    { label: '\uC801\uC6A9 \uAE08\uB9AC', value: `\uCD5C\uACE0 ${formatRate(product.maxRate)}` },
    {
      label: '\uC6D4 \uB0A9\uC785\uC561',
      value: formatCurrency(product.monthlyPaymentAmount ?? 300000),
    },
    {
      label: '\uB9CC\uAE30\uC77C',
      value: `${formatDate(new Date(Date.now() + product.durationMonths * 30 * 24 * 60 * 60 * 1000).toISOString())} (${product.durationMonths}\uAC1C\uC6D4)`,
    },
  ],
  primaryActionLabel: '\uB0B4 \uC801\uAE08 \uD655\uC778\uD558\uAE30',
  primaryActionPath: ROUTE_PATHS.myFinance,
  secondaryActionLabel: '\uBA54\uC778\uC73C\uB85C \uAC00\uAE30',
})

export const buildLoanDetailFields = (preview: FinanceLoanPreview): FinanceInfoField[] => [
  {
    label: '\uC2E0\uCCAD \uAC00\uB2A5 \uC5EC\uBD80',
    value: preview.available ? '\uC2E0\uCCAD \uAC00\uB2A5' : LOAN_PREVIEW_REASON_LABEL[preview.reason],
  },
  { label: '\uB300\uCD9C \uAE30\uAC04', value: `${preview.durationMonths}\uAC1C\uC6D4` },
  { label: '\uCD5C\uB300 \uD55C\uB3C4', value: formatCurrency(preview.loanLimit) },
  { label: '\uC801\uC6A9 \uAE08\uB9AC', value: formatRate(preview.appliedRate) },
]

export const buildLoanDoneState = (
  preview: FinanceLoanPreview,
  amount: number,
): FinanceDoneState => ({
  title: '\uC2E0\uCCAD\uC774 \uC644\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4!',
  description: '\uC9C0\uC18D \uAC00\uB2A5\uD55C \uB0B4\uC77C\uC744 \uC704\uD55C\n\uB2F9\uC2E0\uC758 \uAC00\uCE58 \uC788\uB294 \uC120\uD0DD\uC744 \uC751\uC6D0\uD569\uB2C8\uB2E4.',
  fields: [
    { label: '\uC2E0\uCCAD \uC0C1\uD488', value: preview.name },
    { label: '\uD655\uC815 \uAE08\uB9AC', value: formatRate(preview.appliedRate) },
    { label: '\uB300\uCD9C\uAE08', value: formatCurrency(amount) },
    { label: '\uB300\uCD9C \uAE30\uAC04', value: `${preview.durationMonths}\uAC1C\uC6D4` },
  ],
  primaryActionLabel: '\uB0B4 \uB300\uCD9C \uD604\uD669 \uBCF4\uAE30',
  primaryActionPath: ROUTE_PATHS.myFinanceLoanManage,
  secondaryActionLabel: '\uBA54\uC778\uC73C\uB85C \uAC00\uAE30',
})

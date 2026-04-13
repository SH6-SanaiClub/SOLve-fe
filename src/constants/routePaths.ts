export const ROUTE_PATHS = {
  root: '/',
  login: '/auth/login',
  signup: '/auth/signup-info',
  signupAgreement: '/auth/signup-agreement',
  verify: '/auth/verify',
  signupComplete: '/auth/signup-complete',
  onboarding: '/onboarding',
  home: '/home',
  shop: '/shop',
  shopHistory: '/shop/history',
  shopDetail: '/shop/:id',
  esgEnv: '/esg/env',
  esgEnvVerify: '/esg/env/verify',
  esgSocial: '/esg/social',
  esgSocialDonation: '/esg/social/donation',
  esgQuiz: '/esg/quiz',
  activityEnvironment: '/activities/environment',
  activitySocial: '/activities/social',
  activitySocialDonation: '/esg/social/donation',
  activitySocialStore: '/esg/social/store',
  activitySocialProductDetail: '/esg/social/products/:productId',
  donationDetail: '/esg/social/donations/:donationId',
  donationPayment: '/esg/social/donations/:donationId/payment',
  donationPaymentCallback: '/esg/social/donations/:donationId/payment/callback',
  donationPaymentComplete: '/esg/social/donations/:donationId/payment/complete',
  activityGovernance: '/activities/governance',
  finance: '/finance',
  financeDetail: '/finance/:id',
  financeApply: '/finance/apply/:id',
  financeDone: '/finance/done',
  my: '/my',
  myProfile: '/my/profile',
  myGrade: '/my/grade',
  myHistory: '/my/history',
  myFinance: '/my/finance',
  myFinanceSavingsHistory: '/my/finance/savings/:savingId',
  myFinanceLoanHistory: '/my/finance/loan',
  myPointManage: '/my/point-manage',
  myReport: '/my/report',
  chatbot: '/chatbot',
} as const

export const getDonationDetailPath = (donationId: number | string) =>
  `/esg/social/donations/${donationId}`

export const getDonationPaymentPath = (donationId: number | string) =>
  `/esg/social/donations/${donationId}/payment`

export const getDonationPaymentCallbackPath = (donationId: number | string) =>
  `/esg/social/donations/${donationId}/payment/callback`

export const getDonationPaymentCompletePath = (donationId: number | string) =>
  `/esg/social/donations/${donationId}/payment/complete`

export const getValueStoreProductDetailPath = (productId: number | string) =>
  `/esg/social/products/${productId}`

export const getFinanceDetailPath = (productId: number | string) =>
  `/finance/${productId}`

export const getFinanceApplyPath = (productId: number | string) =>
  `/finance/apply/${productId}`

export const getMyFinanceSavingsHistoryPath = (savingId: number | string) =>
  `/my/finance/savings/${savingId}`

export const getShopDetailPath = (productId: string) => `/shop/${productId}`

export const getEnvVerifyPath = (activityType: string) =>
  `/esg/env/verify?type=${encodeURIComponent(activityType)}`

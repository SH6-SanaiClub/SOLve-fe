export const ROUTE_PATHS = {
  root: '/',
  login: '/login',
  signup: '/signup',
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
  activityGovernance: '/activities/governance',
  finance: '/finance',
  financeDetail: '/finance/:id',
  financeApply: '/finance/apply/:id',
  financeDone: '/finance/done',
  my: '/my',
  chatbot: '/chatbot',
} as const

export const getDonationDetailPath = (donationId: number | string) =>
  `/esg/social/donations/${donationId}`

export const getValueStoreProductDetailPath = (productId: number | string) =>
  `/esg/social/products/${productId}`

export const getFinanceDetailPath = (productId: number | string) =>
  `/finance/${productId}`

export const getFinanceApplyPath = (productId: number | string) =>
  `/finance/apply/${productId}`

export const getShopDetailPath = (productId: string) => `/shop/${productId}`

export const getEnvVerifyPath = (activityType: string) =>
  `/esg/env/verify?type=${encodeURIComponent(activityType)}`

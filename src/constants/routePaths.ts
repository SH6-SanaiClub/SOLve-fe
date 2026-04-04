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
  finance: '/finance',
  my: '/my',
  chatbot: '/chatbot',
} as const

export const getShopDetailPath = (productId: string) => `/shop/${productId}`
export const getEnvVerifyPath = (activityType: string) =>
  `/esg/env/verify?type=${encodeURIComponent(activityType)}`

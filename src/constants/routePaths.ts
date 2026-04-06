export const ROUTE_PATHS = {
  root: '/',
  login: '/login',
  signup: '/signup',
  onboarding: '/onboarding',
  home: '/home',
  shop: '/shop',
  shopHistory: '/shop/history',
  shopDetail: '/shop/:id',
  activityEnvironment: '/activities/environment',
  activitySocial: '/activities/social',
  activitySocialDonation: '/esg/social/donation',
  activitySocialStore: '/esg/social/store',
  activitySocialProductDetail: '/esg/social/products/:productId',
  donationDetail: '/esg/social/donations/:donationId',
  donationPayment: '/esg/social/donations/:donationId/payment',
  activityGovernance: '/activities/governance',
  finance: '/finance',
  my: '/my',
  chatbot: '/chatbot',
} as const

export const getDonationDetailPath = (donationId: number | string) =>
  `/esg/social/donations/${donationId}`

export const getDonationPaymentPath = (donationId: number | string) =>
  `/esg/social/donations/${donationId}/payment`

export const getValueStoreProductDetailPath = (productId: number | string) =>
  `/esg/social/products/${productId}`

export const getShopDetailPath = (productId: string) => `/shop/${productId}`

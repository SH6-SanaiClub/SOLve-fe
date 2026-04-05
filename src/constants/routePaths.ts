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
  donationDetail: '/esg/social/donations/:donationId',
  activityGovernance: '/activities/governance',
  finance: '/finance',
  my: '/my',
  chatbot: '/chatbot',
} as const

<<<<<<< HEAD
export const getDonationDetailPath = (donationId: number | string) =>
  `/esg/social/donations/${donationId}`
=======
export const getShopDetailPath = (productId: string) => `/shop/${productId}`
>>>>>>> origin/develop

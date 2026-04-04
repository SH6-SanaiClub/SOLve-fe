export const ROUTE_PATHS = {
  root: '/',
  login: '/login',
  signup: '/signup',
  onboarding: '/onboarding',
  home: '/home',
  activities: '/activities',
  activityEnvironment: '/activities/environment',
  activitySocial: '/activities/social',
  activitySocialDonation: '/esg/social/donation',
  donationDetail: '/esg/social/donations/:donationId',
  activityGovernance: '/activities/governance',
  finance: '/finance',
  my: '/my',
  chatbot: '/chatbot',
} as const

export const getDonationDetailPath = (donationId: number | string) =>
  `/esg/social/donations/${donationId}`

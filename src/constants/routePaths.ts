export const ROUTE_PATHS = {
  root: '/',
  login: '/auth/login',
  signup: '/auth/signup-info',
  signupAgreement: '/auth/signup-agreement',
  verify: '/auth/verify',
  signupComplete: '/auth/signup-complete',
  survey: '/survey',
  home: '/home',
  shop: '/shop',
  shopHistory: '/shop/history',
  shopDetail: '/shop/:id',
  esgEnv: '/esg/env',
  esgEnvVerify: '/esg/env/verify',
  esgSocial: '/esg/social',
  esgSocialDonation: '/esg/social/donation',
  esgQuiz: '/esg/quiz',
  esgQuizResult: '/esg/quiz/result',
  activityEnvironment: '/activities/environment',
  activitySocial: '/activities/social',
  activitySocialDonation: '/esg/social/donation',
  activitySocialStore: '/esg/social/store',
  activitySocialStorePurchases: '/esg/social/store/purchases',
  activitySocialVolunteer: '/esg/social/volunteer',
  activitySocialVolunteerApplications: '/esg/social/volunteers/applications',
  activitySocialVolunteerAttendance: '/esg/social/volunteers/attendance',
  activitySocialVolunteerAttendanceComplete:
    '/esg/social/volunteers/attendance/complete',
  activitySocialVolunteerDetail: '/esg/social/volunteers/:volunteerId',
  activitySocialVolunteerComplete: '/esg/social/volunteers/:volunteerId/complete',
  activitySocialProductDetail: '/esg/social/products/:productId',
  activitySocialProductPayment: '/esg/social/products/:productId/payment',
  activitySocialProductPaymentCallback:
    '/esg/social/products/:productId/payment/callback',
  activitySocialProductPaymentComplete:
    '/esg/social/products/:productId/payment/complete',
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
  myFinanceLoanManage: '/my/finance/loans',
  myFinanceSavingsHistory: '/my/finance/savings/:savingId',
  myFinanceLoanHistory: '/my/finance/loan',
  myPointManage: '/my/point-manage',
  myReport: '/my/report',
  reportVerify: '/report/verify/:token',
  chatbot: '/chatbot',
  recommend: '/recommend',
  adminLogin: '/admin/login',
  adminDashboard: '/admin/dashboard',
  adminUsers: '/admin/users',
  adminUserDetail: '/admin/users/:userId',
  adminActivities: '/admin/activities',
  adminActivityForm: '/admin/activities/form',
  adminShop: '/admin/shop',
  adminShopForm: '/admin/shop/form',
  adminFinance: '/admin/finance',
  adminFinanceForm: '/admin/finance/form',
  adminFinanceSubscriptions: '/admin/finance/:productId/subscriptions',
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

export const getVolunteerDetailPath = (volunteerId: number | string) =>
  `/esg/social/volunteers/${volunteerId}`

export const getVolunteerCompletePath = (volunteerId: number | string) =>
  `/esg/social/volunteers/${volunteerId}/complete`

export const getValueStoreProductPaymentPath = (productId: number | string) =>
  `/esg/social/products/${productId}/payment`

export const getValueStoreProductPaymentCallbackPath = (
  productId: number | string,
) => `/esg/social/products/${productId}/payment/callback`

export const getValueStoreProductPaymentCompletePath = (
  productId: number | string,
) => `/esg/social/products/${productId}/payment/complete`

export const getFinanceDetailPath = (productId: number | string) =>
  `/finance/${productId}`

export const getFinanceApplyPath = (productId: number | string) =>
  `/finance/apply/${productId}`

export const getMyFinanceSavingsHistoryPath = (savingId: number | string) =>
  `/my/finance/savings/${savingId}`

export const getShopDetailPath = (productId: string) => `/shop/${productId}`

export const getEnvVerifyPath = (activityType: string) =>
  `/esg/env/verify?type=${encodeURIComponent(activityType)}`

export const getReportVerifyPath = (token: string) =>
  `/report/verify/${encodeURIComponent(token)}`

export const getAdminUserDetailPath = (userId: number | string) =>
  `/admin/users/${userId}`

export const getAdminActivityFormPath = ({
  type,
  mode,
  id,
}: {
  type: 'activity' | 'donation' | 'volunteer' | 'eco-product'
  mode: 'create' | 'edit'
  id?: number | string
}) => {
  const params = new URLSearchParams({ type, mode })

  if (id !== undefined) {
    params.set('id', String(id))
  }

  return `/admin/activities/form?${params.toString()}`
}

export const getAdminShopFormPath = ({
  mode,
  id,
}: {
  mode: 'create' | 'edit'
  id?: number | string
}) => {
  const params = new URLSearchParams({ mode })

  if (id !== undefined) {
    params.set('id', String(id))
  }

  return `/admin/shop/form?${params.toString()}`
}

export const getAdminFinanceFormPath = ({
  mode,
  id,
}: {
  mode: 'create' | 'edit'
  id?: number | string
}) => {
  const params = new URLSearchParams({ mode })

  if (id !== undefined) {
    params.set('id', String(id))
  }

  return `/admin/finance/form?${params.toString()}`
}

export const getAdminFinanceSubscriptionsPath = (productId: number | string) =>
  `/admin/finance/${productId}/subscriptions`

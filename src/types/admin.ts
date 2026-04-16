export type AdminFormMode = 'create' | 'edit'
export type AdminActivityFormType = 'activity' | 'donation' | 'volunteer' | 'eco-product'

export interface AdminLoginRequest {
  loginId: string
  password: string
}

export interface AdminLoginResponse {
  accessToken: string
  tokenType: string
}

export interface AdminDashboardData {
  totalUsers: number
  todayNewUsers: number
  weekNewUsers: number
  activeUsers: number
  gradeDistribution: Record<string, number>
  thisMonthDonationCount: number
  thisMonthDonationAmount: number
  thisMonthVolunteerCount: number
  thisMonthPurchaseCount: number
  activeLoanCount: number
  activeLoanAmount: number
  activeSavingCount: number
}

export interface AdminPageResponse<T> {
  content: T[]
  page: number
  size: number
  totalPages: number
  totalElements: number
  numberOfElements: number
  first: boolean
  last: boolean
  hasNext: boolean
  hasPrevious: boolean
}

export interface AdminUserListItem {
  userId: number
  loginId: string
  name: string
  email: string
  phoneNumber: string
  totalScore: number
  currentGrade: string
  userType: string
  isActive: boolean
  createdAt: string
}

export interface AdminUserDetail extends AdminUserListItem {
  birthdate: string
  eScore: number
  sScore: number
  gActivityScore: number
  gRepaymentScore: number
  totalPoints: number
  abuseCount: number
  isLinked: boolean
  lastActivityDate: string | null
}

export interface AdminActivity {
  activityId: number
  name: string
  verificationCount: number
  createdAt: string
  updatedAt: string
}

export interface AdminDonationParticipant {
  userId: number
  loginId: string
  name: string
  amount: number
  createdAt: string
}

export interface AdminDonation {
  donationId: number
  name: string
  summary: string
  description: string
  targetAmount: number
  currentAmount: number
  imageUrl: string
  startDate: string
  endDate: string
  isActive: boolean
  participantCount: number
  participants: AdminDonationParticipant[]
  createdAt: string
  updatedAt: string
}

export interface AdminVolunteerParticipant {
  userId: number
  loginId: string
  name: string
  status: string
  volunteerHour: number
  checkInAt: string | null
  checkOutAt: string | null
  createdAt: string
}

export interface AdminVolunteer {
  volunteerId: number
  name: string
  description: string
  activityDate: string
  location: string
  capacity: number
  currentEnrolled: number
  volunteerHour: number
  organization: string
  qrToken: string
  latitude: number
  longitude: number
  isActive: boolean
  participantCount: number
  participants: AdminVolunteerParticipant[]
  createdAt: string
  updatedAt: string
}

export interface AdminEcoProduct {
  productId: number
  name: string
  storeName: string
  category: string
  price: number
  imageUrl: string
  description: string
  stock: number
  isActive: boolean
  purchaseCount: number
  createdAt: string
  updatedAt: string
}

export interface AdminItem {
  itemId: number
  name: string
  category: string
  requiredPoints: number
  imageUrl: string | null
  description: string
  stock: number
  isActive: boolean
  exchangeCount: number
  createdAt: string
  updatedAt: string
}

export interface AdminFinancialProduct {
  finProductId: number
  name: string
  subtitle: string | null
  type: 'LOAN' | 'SAVINGS'
  baseRate: number
  maxRate: number
  durationMonths: number
  monthlyPaymentAmount: number | null
  isActive: boolean
  activeLoanCount: number
  activeSavingCount: number
  description: string
  createdAt: string
  updatedAt: string
}

export interface AdminFinancialProductSubscription {
  userId: number
  loginId: string
  name: string
  type: 'LOAN' | 'SAVINGS'
  amount: number
  currentRate: number
  status: string
  startDate: string
  maturityDate: string | null
  nextRepaymentDate: string | null
}

export interface AdminUserStatusPayload {
  isActive: boolean
}

export interface AdminPenaltyPayload {
  reason: string
}

export interface AdminActivityPayload {
  name: string
}

export interface AdminDonationPayload {
  name: string
  summary: string
  description: string
  targetAmount: number
  startDate: string
  endDate: string
  imageUrl: string
  isActive?: boolean
}

export interface AdminVolunteerPayload {
  name: string
  description: string
  location: string
  capacity: number
  activityDate: string
  volunteerHour: number
  organization: string
  qrToken: string
  latitude: number
  longitude: number
  isActive?: boolean
}

export interface AdminEcoProductPayload {
  name: string
  storeName: string
  category: string
  price: number
  imageUrl: string
  description: string
  stock: number
  isActive?: boolean
}

export interface AdminItemPayload {
  name: string
  category: string
  requiredPoints: number
  imageUrl: string
  description: string
  stock: number
  isActive?: boolean
}

export interface AdminFinancialProductPayload {
  name: string
  subtitle: string
  type: 'LOAN' | 'SAVINGS'
  baseRate: number
  maxRate: number
  description: string
  durationMonths: number
  monthlyPaymentAmount: number | null
  isActive?: boolean
}

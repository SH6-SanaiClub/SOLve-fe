export type UserType = 'GREEN' | 'SOCIAL' | 'FINANCE' | 'ALL_ROUNDER'
export type UserGrade = 'SEED' | 'SPROUT' | 'TREE' | 'FOREST' | 'EARTH'

export interface UserSummary {
  userId: number
  loginId: string
  name: string
  userType: UserType | null
  currentGrade: UserGrade
  totalPoints: number
  isLinked: boolean
  phoneNumber?: string
  isSurveyCompleted: boolean
}

export interface UserProfileResponse {
  loginId: string
  name: string
  phoneNumber: string
  userType: UserType | null
  currentGrade: UserGrade
  message: string
}

export type UserType = 'GREEN' | 'SOCIAL' | 'FINANCE' | 'ALL-ROUNDER'
export type UserGrade = 'SEED' | 'SPROUT' | 'TREE' | 'FOREST' | 'EARTH'

export interface UserSummary {
  userId: number
  loginId: string
  name: string
  userType: UserType
  currentGrade: UserGrade
  totalPoints: number
  isLinked: boolean
  phoneNumber?: string
}

export interface UserProfileResponse {
  loginId: string
  name: string
  phoneNumber: string
  userType: UserType
  currentGrade: UserGrade
  message: string
}

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
}

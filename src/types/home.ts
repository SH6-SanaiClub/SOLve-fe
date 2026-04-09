import type { UserGrade } from './user'

export interface GradeProgress {
  current: number
  target: number
  visualValue: number
}

export interface WeeklyActivityStatus {
  day: string
  completed: boolean
}

export interface HomeDashboardSummary {
  name: string
  currentGrade: UserGrade
  totalPoints: number
  gradeProgress: GradeProgress
  weeklyActivities: WeeklyActivityStatus[]
}

import type { UserGrade } from '../../types/user'

export const defaultPoints = 12400

export const defaultGradeProgress = {
  current: 100,
  target: 690,
  visualValue: 68,
}

export const gradeLabelMap: Record<UserGrade, string> = {
  SEED: '씨앗',
  SPROUT: '새싹',
  TREE: '나무',
  FOREST: '숲',
  EARTH: '지구',
}

export interface WeeklyActivityStatus {
  day: string
  completed: boolean
}

export const weeklyActivityStatuses: WeeklyActivityStatus[] = [
  { day: '일', completed: false },
  { day: '월', completed: true },
  { day: '화', completed: false },
  { day: '수', completed: true },
  { day: '목', completed: true },
  { day: '금', completed: false },
  { day: '토', completed: false },
]

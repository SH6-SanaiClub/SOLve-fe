export type ActivityType = 'DONATION' | 'VOLUNTEER' | 'PHOTO' | 'QUIZ' | 'PURCHASE'
export type ScoreCategory = 'E' | 'S' | 'G'

export interface RecommendedActivity {
  activityType: ActivityType
  referenceId: number
  name: string
  scoreCategory: ScoreCategory
  scoreValue: number
  pointValue: number
  pointRate: number
  deadlineDate: string | null
  finalScore: number
  mainReason: string | null
  currentAmount: number | null
  targetAmount: number | null
  currentEnrolled: number | null
  capacity: number | null
  description: string | null
  alreadyParticipatedToday?: boolean | null
  monthlyLimitReached?: boolean | null
}

export interface ActivityRecommendResponse {
  activities: RecommendedActivity[]
  popularActivity: RecommendedActivity | null
  llmSummary: string | null
}

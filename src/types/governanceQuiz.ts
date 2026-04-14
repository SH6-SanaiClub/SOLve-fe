export interface GovernanceQuizOption {
  id: string
  text: string
  order: number
}

export interface GovernanceQuizToday {
  status: 'available' | 'completed' | 'empty'
  quizId: string
  title: string
  question: string
  options: GovernanceQuizOption[]
  alreadySolved: boolean
  selectedOptionId: string | null
  correctOptionId: string | null
  explanation: string | null
  rewardPoint: number
  message: string | null
  correctMessage: string | null
  incorrectMessage: string | null
}

export interface GovernanceQuizSubmitRequest {
  quizId: string
  selectedOptionId: string
}

export interface GovernanceQuizResult {
  quizId: string
  selectedOptionId: string
  selectedOptionText: string
  correctOptionId: string | null
  correctOptionText: string
  isCorrect: boolean
  explanation: string | null
  rewardPoint: number
  message: string | null
  alreadySolved: boolean
}

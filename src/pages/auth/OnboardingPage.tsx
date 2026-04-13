import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logoImage from '../../assets/home/logo.png'
import { Button, Card } from '../../components/common'
import MainLayout from '../../components/layout/MainLayout'
import { ROUTE_PATHS } from '../../constants/routePaths'
import { useAuth } from '../../hooks/useAuth'
import { submitSurvey } from '../../services/onboardingService'
import type { UserType } from '../../types/user'
import { OnboardingCompleteModal } from './components/OnboardingCompleteModal'

const QUESTIONS = [
  {
    id: 'q1',
    question: '평소 환경 관련 활동을 하고 있거나, 관심이 있나요?',
    category: 'E' as const,
    options: [
      { label: '적극적으로 하고 있다', score: 2 },
      { label: '관심은 있지만 실천은 못 하고 있다', score: 1 },
      { label: '별로 관심 없다', score: 0 },
    ],
  },
  {
    id: 'q2',
    question: '기부나 봉사, 사회적 가치 소비에 관심이 있나요?',
    category: 'S' as const,
    options: [
      { label: '정기적으로 하고 있다', score: 2 },
      { label: '기회가 되면 하고 싶다', score: 1 },
      { label: '별로 관심 없다', score: 0 },
    ],
  },
  {
    id: 'q3',
    question: '금융 목표를 세우고 달성하는 걸 좋아하나요?',
    category: 'G' as const,
    options: [
      { label: '적금/저축 목표를 세우고 실천 중이다', score: 2 },
      { label: '목표를 세우고 싶지만 아직 못 했다', score: 1 },
      { label: '별로 관심 없다', score: 0 },
    ],
  },
] as const

const calcUserType = (answers: Record<string, number>): UserType => {
  const e = answers.q1 ?? 0
  const s = answers.q2 ?? 0
  const g = answers.q3 ?? 0
  const max = Math.max(e, s, g)

  const winners = [
    e === max ? 'E' : null,
    s === max ? 'S' : null,
    g === max ? 'G' : null,
  ].filter(Boolean)

  if (winners.length > 1) {
    return 'ALL-ROUNDER'
  }

  return winners[0] === 'E' ? 'GREEN' : winners[0] === 'S' ? 'SOCIAL' : 'FINANCE'
}

export function OnboardingPage() {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false)

  const currentQuestion = QUESTIONS[step]
  const isLastStep = step === QUESTIONS.length - 1
  const isFirstStep = step === 0
  const hasAnswer = answers[currentQuestion.id] !== undefined

  useEffect(() => {
    if (user?.isSurveyCompleted && !isCompleteModalOpen) {
      navigate(ROUTE_PATHS.home, { replace: true })
    }
  }, [isCompleteModalOpen, navigate, user?.isSurveyCompleted])

  const handleSelect = (score: number) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: score }))
  }

  const handleNext = async () => {
    if (!hasAnswer || isSubmitting) {
      return
    }

    if (!isLastStep) {
      setStep((prev) => prev + 1)
      return
    }

    setIsSubmitting(true)

    try {
      const userType = calcUserType(answers)

      await submitSurvey(userType)

      if (user) {
        updateUser({
          ...user,
          isSurveyCompleted: true,
          userType,
        })
      }

      setIsCompleteModalOpen(true)
    } catch {
      navigate(ROUTE_PATHS.home, { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePrev = () => {
    if (isFirstStep || isSubmitting) {
      return
    }

    setStep((prev) => prev - 1)
  }

  const handleCompleteClose = () => {
    setIsCompleteModalOpen(false)
    navigate(ROUTE_PATHS.home, { replace: true })
  }

  return (
    <MainLayout className="bg-bg-light">
      <div className="flex min-h-[calc(100vh-48px)] flex-col px-2 pt-6 pb-32">
        <div className="flex flex-col gap-8">
          <img src={logoImage} alt="SOLve" className="h-9 w-fit object-contain" />

          <div className="flex flex-col gap-2">
            <h1 className="text-[24px] leading-[1.35] font-bold tracking-[-0.02em] text-font-main break-keep">
              맞춤 추천을 위한 간단한 설문
            </h1>
            <p className="text-base leading-6 text-font-sub break-keep">
              간단한 답변 후 맞춤 추천을 받아보세요!
            </p>
          </div>

          <div className="flex gap-2">
            {QUESTIONS.map((question, index) => (
              <div
                key={question.id}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  index <= step ? 'bg-primary-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          <Card className="gap-6 !rounded-[20px] !p-6 shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-font-sub">
                {step + 1} / {QUESTIONS.length}
              </span>
              <h2 className="text-[20px] leading-[1.45] font-bold tracking-[-0.02em] text-font-main break-keep">
                {currentQuestion.question}
              </h2>
            </div>

            <div className="mt-3 flex flex-col gap-4">
              {currentQuestion.options.map((option) => {
                const isSelected = answers[currentQuestion.id] === option.score

                return (
                  <Card
                    key={option.label}
                    onClick={() => handleSelect(option.score)}
                    className={`!rounded-[16px] !border !p-4 shadow-none ${
                      isSelected
                        ? '!border-primary-500 bg-primary-50'
                        : '!border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`flex h-6 w-6 shrink-0 rounded-full border-2 transition-all ${
                          isSelected
                            ? 'border-primary-500 bg-primary-500/10'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        <span
                          className={`m-auto h-2.5 w-2.5 rounded-full transition-all ${
                            isSelected ? 'bg-primary-500' : 'bg-transparent'
                          }`}
                        />
                      </span>
                      <p
                        className={`text-[15px] leading-6 font-medium break-keep ${
                          isSelected ? 'text-primary-500' : 'text-font-main'
                        }`}
                      >
                        {option.label}
                      </p>
                    </div>
                  </Card>
                )
              })}
            </div>
          </Card>
        </div>

        <div className="fixed bottom-0 left-1/2 z-10 w-full max-w-[600px] -translate-x-1/2 bg-bg-light px-6 pb-4 pt-4">
          <div className="flex gap-3">
            <Button
              variant="sub"
              size="lg"
              fullWidth
              disabled={isFirstStep || isSubmitting}
              onClick={handlePrev}
            >
              이전
            </Button>
            <Button
              variant="primary"
              fullWidth
              size="lg"
              disabled={!hasAnswer || isSubmitting}
              onClick={handleNext}
            >
              {isLastStep ? (isSubmitting ? '저장 중...' : '설문 완료') : '다음'}
            </Button>
          </div>
        </div>
      </div>

      <OnboardingCompleteModal
        open={isCompleteModalOpen}
        onClose={handleCompleteClose}
      />
    </MainLayout>
  )
}

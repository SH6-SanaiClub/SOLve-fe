import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle2, LoaderCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, IconButton, Icons } from '../../../components/common'
import Header from '../../../components/layout/Header'
import MainLayout from '../../../components/layout/MainLayout'
import { ROUTE_PATHS } from '../../../constants/routePaths'
import {
  getTodayGovernanceQuiz,
  submitGovernanceQuiz,
} from '../../../services/governanceQuizService'
import type { GovernanceQuizToday } from '../../../types/governanceQuiz'

function QuizChoiceButton({
  active,
  disabled,
  text,
  onClick,
}: {
  active: boolean
  disabled: boolean
  text: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        'w-full rounded-[10px] border px-4 py-4 text-center text-[14px] leading-[1.5] font-medium transition-all',
        active
          ? 'border-primary-500 bg-white text-primary-500 shadow-[0_6px_18px_rgba(0,70,255,0.08)]'
          : 'border-[#C9D4E5] bg-[#F8FAFD] text-[#8B99AE]',
        disabled ? 'cursor-not-allowed opacity-60' : 'active:scale-[0.99]',
      ].join(' ')}
    >
      {text}
    </button>
  )
}

export function GovernanceQuizPage() {
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState<GovernanceQuizToday | null>(null)
  const [completedQuiz, setCompletedQuiz] = useState<GovernanceQuizToday | null>(null)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const loadQuiz = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const todayQuiz = await getTodayGovernanceQuiz()

        if (!mounted) {
          return
        }

        if (todayQuiz.status === 'completed') {
          setCompletedQuiz(todayQuiz)
          setQuiz(null)
          return
        }

        setCompletedQuiz(null)
        setQuiz(todayQuiz)
        setSelectedOptionId(todayQuiz.selectedOptionId)

        if (todayQuiz.status === 'empty') {
          setError(todayQuiz.message ?? '오늘의 퀴즈를 아직 불러오지 못했어요.')
        }
      } catch {
        if (!mounted) {
          return
        }

        setError('오늘의 퀴즈를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.')
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    void loadQuiz()

    return () => {
      mounted = false
    }
  }, [navigate])

  const handleSubmit = async () => {
    if (!quiz || !selectedOptionId || isSubmitting) {
      return
    }

    setIsSubmitting(true)

    try {
      const result = await submitGovernanceQuiz(
        { quizId: quiz.quizId, selectedOptionId },
        quiz.options,
      )

      navigate(ROUTE_PATHS.esgQuizResult, {
        state: { result },
      })
    } catch {
      setError('답안 제출에 실패했어요. 다시 한번 시도해 주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (completedQuiz) {
    return (
      <MainLayout
        className="bg-[#EEF3FF]"
        header={
          <Header
            bgColor="bg-white"
            left={
              <IconButton
                label="뒤로 가기"
                icon={<Icons.Back size={20} />}
                size="sm"
                onClick={() => navigate(ROUTE_PATHS.home, { replace: true })}
              />
            }
            title="오늘의 퀴즈"
            right={<div className="w-8" aria-hidden="true" />}
            className="border-b border-[#E8EEF8]"
          />
        }
      >
        <section className="flex min-h-[calc(100vh-56px-48px)] items-center justify-center py-6">
          <article className="w-full max-w-[360px] rounded-[20px] bg-white px-6 py-8 text-center shadow-[0_24px_48px_rgba(15,23,42,0.12)]">
            <div className="mx-auto flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[#EAF2FF]">
              <div className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[#D8E7FF] text-[#1F5FFF]">
                <CheckCircle2 size={24} strokeWidth={2.6} />
              </div>
            </div>

            <h2 className="mt-6 text-[26px] leading-none font-bold tracking-[-0.03em] text-[#1E293B]">
              오늘 퀴즈를 이미 완료했어요
            </h2>
            <p className="mt-4 text-[14px] leading-[1.7] text-[#6C7B91]">
              금융 퀴즈는 하루에 한 번만 참여할 수 있어요.
              <br />
              내일 다시 새로운 문제로 만나요.
            </p>

            {completedQuiz.rewardPoint > 0 ? (
              <p className="mt-3 text-[15px] font-semibold text-primary-500">
                오늘 적립 포인트 +{completedQuiz.rewardPoint}P
              </p>
            ) : null}

            <div className="mt-6 rounded-[14px] border border-[#D8E4FF] bg-[#F8FBFF] px-4 py-4 text-left">
              <p className="text-[13px] font-semibold text-[#475569]">안내</p>
              <p className="mt-2 text-[13px] leading-[1.7] text-[#64748B]">
                {completedQuiz.message ?? '이미 오늘 퀴즈를 완료한 상태입니다.'}
              </p>
            </div>

            <Button
              type="button"
              variant="primary"
              size="md"
              fullWidth
              className="mt-6 !h-[50px] !rounded-[10px]"
              onClick={() => navigate(ROUTE_PATHS.home, { replace: true })}
            >
              홈으로 가기
            </Button>
          </article>
        </section>
      </MainLayout>
    )
  }

  return (
    <MainLayout
      className="bg-[#EEF3FF]"
      header={
        <Header
          bgColor="bg-white"
          left={
            <IconButton
              label="뒤로 가기"
              icon={<Icons.Back size={20} />}
              size="sm"
              onClick={() => navigate(-1)}
            />
          }
          title="오늘의 퀴즈"
          right={<div className="w-8" aria-hidden="true" />}
          className="border-b border-[#E8EEF8]"
        />
      }
    >
      <section className="flex min-h-[calc(100vh-56px-48px)] flex-col gap-5 px-1 pt-4">
        <div className="space-y-2">
          <p className="text-[14px] font-semibold text-[#6C7B91]">오늘의 금융 Quiz!</p>
          <div className="rounded-[12px] border border-white/80 bg-white px-4 py-5 shadow-[0_8px_20px_rgba(111,137,194,0.10)]">
            {isLoading ? (
              <div className="flex items-center gap-2 text-[14px] text-[#6C7B91]">
                <LoaderCircle className="animate-spin" size={16} />
                퀴즈를 불러오는 중입니다.
              </div>
            ) : (
              <p className="text-[14px] leading-[1.65] font-medium text-[#4A5A72]">
                {quiz?.question ?? error ?? '오늘의 퀴즈가 준비 중입니다.'}
              </p>
            )}
          </div>
        </div>

        {error && !quiz?.options.length ? (
          <div className="flex items-start gap-2 rounded-[12px] border border-[#FFD3D3] bg-[#FFF4F4] px-4 py-3 text-[13px] leading-[1.5] text-[#D64545]">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        <div className="flex flex-col gap-3">
          {quiz?.options.map((option) => (
            <QuizChoiceButton
              key={option.id}
              active={selectedOptionId === option.id}
              disabled={isLoading || isSubmitting}
              text={option.text}
              onClick={() => setSelectedOptionId(option.id)}
            />
          ))}
        </div>

        {quiz && quiz.options.length > 0 ? (
          <div className="mt-auto rounded-[12px] border border-[#D9E4FF] bg-[#F7FAFF] px-4 py-3 text-[13px] leading-[1.55] text-[#607089]">
            <div className="flex items-start gap-2">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary-500" />
              <p>정답/오답 보상은 1일 1회 기준으로 반영돼요.</p>
            </div>
          </div>
        ) : null}
      </section>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50">
        <section className="pointer-events-auto mx-auto w-full max-w-[600px] bg-transparent px-(--side-padding) pt-3 pb-[calc(16px+env(safe-area-inset-bottom))]">
          <Button
            type="button"
            variant="primary"
            size="md"
            fullWidth
            className="!h-[48px] !rounded-[10px] shadow-[0_14px_32px_rgba(0,70,255,0.22)]"
            disabled={!selectedOptionId || isLoading || isSubmitting || !quiz}
            onClick={handleSubmit}
          >
            {isSubmitting ? '제출 중...' : '정답 확인하기'}
          </Button>
        </section>
      </div>
    </MainLayout>
  )
}

import { useEffect, useLayoutEffect, useState } from 'react'
import { AlertCircle, LoaderCircle } from 'lucide-react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, IconButton, Icons } from '../../../components/common'
import {
  PageMotionStyles,
  buildFloatingStyle,
  buildPageEnterStyle,
  buildPulseGlowStyle,
} from '../../../components/common/PageMotion'
import Header from '../../../components/layout/Header'
import MainLayout from '../../../components/layout/MainLayout'
import { getS3AssetUrl } from '../../../constants/assetUrls'
import { ROUTE_PATHS } from '../../../constants/routePaths'
import useReturnNavigation from '../../../hooks/useReturnNavigation'
import {
  getTodayGovernanceQuiz,
  submitGovernanceQuiz,
} from '../../../services/governanceQuizService'
import type { GovernanceQuizToday } from '../../../types/governanceQuiz'

function QuizChoiceButton({
  active,
  disabled,
  hasSelection,
  text,
  onClick,
}: {
  active: boolean
  disabled: boolean
  hasSelection: boolean
  text: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        'w-full rounded-[10px] border px-4 py-3.5 text-center text-[14px] leading-[1.45] font-semibold transition-all',
        active
          ? 'border-primary-400 bg-primary-50 text-primary-400 shadow-[0_10px_24px_rgba(0,70,255,0.12)]'
          : [
              'border-[#D9E2F1] bg-transparent text-[#34445C] shadow-[0_8px_20px_rgba(43,70,110,0.05)]',
              hasSelection
                ? ''
                : 'hover:border-primary-300 hover:bg-primary-50 hover:text-primary-500 hover:shadow-[0_10px_24px_rgba(0,70,255,0.10)]',
            ].join(' '),
        disabled ? 'cursor-not-allowed opacity-60' : 'active:scale-[0.99]',
      ].join(' ')}
    >
      {text}
    </button>
  )
}

export function GovernanceQuizPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { goBack } = useReturnNavigation(ROUTE_PATHS.home)
  const routeState = location.state as { returnTo?: string } | undefined
  const completeImage = getS3AssetUrl('quiz.png')
  const [quiz, setQuiz] = useState<GovernanceQuizToday | null>(null)
  const [completedQuiz, setCompletedQuiz] = useState<GovernanceQuizToday | null>(null)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errorDetails, setErrorDetails] = useState<{
    status: string
    code: string
    message: string
  } | null>(null)

  useLayoutEffect(() => {
    const scrollToTop = () => {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      document.scrollingElement?.scrollTo(0, 0)
    }

    scrollToTop()

    const frameId = window.requestAnimationFrame(scrollToTop)

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [])
  useEffect(() => {
    let mounted = true

    const loadQuiz = async () => {
      setIsLoading(true)
      setError(null)
      setErrorDetails(null)

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
      } catch (caughtError) {
        if (!mounted) {
          return
        }

        setError('오늘의 퀴즈를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.')

        if (axios.isAxiosError(caughtError)) {
          setErrorDetails({
            status: String(caughtError.response?.status ?? 'unknown'),
            code: caughtError.code ?? 'unknown',
            message:
              (caughtError.response?.data as { message?: string } | null)?.message ??
              caughtError.message ??
              'unknown',
          })
        } else if (caughtError instanceof Error) {
          setErrorDetails({
            status: 'unknown',
            code: 'unknown',
            message: caughtError.message,
          })
        }
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
        state: {
          result,
          returnTo: routeState?.returnTo,
        },
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
                onClick={goBack}
              />
            }
            title="오늘의 퀴즈"
            right={<div className="w-8" aria-hidden="true" />}
            className="border-b border-[#E8EEF8]"
          />
        }
      >
        <PageMotionStyles />
        <section className="mb-[-24px] flex min-h-full items-center justify-center px-4 pt-6 pb-0">
          <article
            className="w-full max-w-[360px] rounded-[10px] bg-white px-6 py-8 text-center shadow-[0_24px_48px_rgba(15,23,42,0.12)]"
            style={buildPageEnterStyle(60, 520)}
          >
            <img
              src={completeImage}
              alt=""
              aria-hidden="true"
              className="mx-auto h-[96px] w-auto object-contain"
              style={buildFloatingStyle(3400)}
            />

            <h2 className="mt-6 text-[24px] leading-none font-bold tracking-[-0.03em] text-[#1E293B]">
              오늘 퀴즈를 이미 완료했어요!
            </h2>
            <p className="mt-4 text-[14px] leading-[1.7] text-[#6C7B91]">
              금융 퀴즈는 하루에 한 번만 참여할 수 있어요.
              <br />
              내일 다시 새로운 문제로 만나요!
            </p>

            {completedQuiz.rewardPoint > 0 ? (
              <p className="mt-3 text-[15px] font-semibold text-primary-500">
                오늘 적립 포인트 +{completedQuiz.rewardPoint}P
              </p>
            ) : null}

            <Button
              type="button"
              variant="primary"
              size="md"
              fullWidth
              className="mt-6"
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
              onClick={goBack}
            />
          }
          title="오늘의 퀴즈"
          right={<div className="w-8" aria-hidden="true" />}
          className="border-b border-[#E8EEF8]"
        />
      }
    >
      <PageMotionStyles />
      <section className="flex min-h-full flex-col px-1 pt-4 pb-[150px]">
        <p
          className="text-[15px] font-bold tracking-[-0.02em] text-[#64748B]"
          style={buildPageEnterStyle(30, 420)}
        >
          <span className="mr-[4px]">오늘의 금융</span>
          <span className="text-[16px] text-primary-500">Quiz</span>
        </p>

        <div
          className="relative mt-4 overflow-hidden rounded-[10px] bg-white px-5 py-5 text-center"
          style={buildPageEnterStyle(90, 480)}
        >
          {quiz?.options.length ? (
            <div
              className="pointer-events-none absolute left-1/2 top-4 h-[112px] w-[112px] -translate-x-1/2 rounded-full bg-primary-50 blur-2xl"
              style={buildPulseGlowStyle(2800)}
            />
          ) : null}
          {isLoading ? (
            <div className="flex min-h-[136px] items-center justify-center gap-2 text-[15px] font-medium text-[#5B6B82]">
              <LoaderCircle className="animate-spin" size={18} />
              퀴즈를 불러오는 중입니다.
            </div>
          ) : (
            <div className="relative z-10 flex min-h-[136px] flex-col items-center justify-center gap-3">
              {quiz?.options.length ? (
                <img
                  src={completeImage}
                  alt=""
                  aria-hidden="true"
                  className="h-[78px] w-auto object-contain"
                  style={buildFloatingStyle(3200, 120)}
                />
              ) : null}
              <p className="mx-auto max-w-[300px] text-[18px] leading-[1.6] font-bold tracking-[-0.02em] text-[#1E293B] break-keep">
                {quiz?.question ?? error ?? '오늘의 퀴즈가 준비 중입니다.'}
              </p>
            </div>
          )}
        </div>

        {error && !quiz?.options.length ? (
          <div className="mt-4 rounded-[10px] border border-[#FFD3D3] bg-[#FFF4F4] px-4 py-3 text-[13px] leading-[1.5] text-[#D64545]">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
              {errorDetails ? (
                <div className="mt-2 border-t border-[#F2C3C3] pt-2 text-[12px] leading-[1.5] text-[#A94444]">
                  <p>status: {errorDetails.status}</p>
                  <p>code: {errorDetails.code}</p>
                  <p>message: {errorDetails.message}</p>
                </div>
              ) : null}
          </div>
        ) : null}

        {quiz?.options.length ? (
          <>
            <div
              className="mt-5 flex shrink-0 items-center gap-3"
              style={buildPageEnterStyle(150, 420)}
            >
              <span className="h-px flex-1 bg-[#D3DDEA]" aria-hidden="true" />
              <p className="text-center text-[11px] font-semibold tracking-[-0.01em] text-[#7B89A1]">
                아래 4문항 중 정답을 선택해 주세요
              </p>
              <span className="h-px flex-1 bg-[#D3DDEA]" aria-hidden="true" />
            </div>

            <article
              className="relative mt-4 flex shrink-0 flex-col overflow-hidden rounded-[10px] bg-white px-5 py-5"
              style={buildPageEnterStyle(190, 460)}
            >
              <div className="absolute inset-0 z-0 opacity-[100] bg-no-repeat bg-center pointer-events-none" />
              <div className="relative z-10 flex flex-col gap-3">
                {quiz.options.map((option, index) => (
                  <div key={option.id} style={buildPageEnterStyle(220 + index * 60, 380)}>
                    <QuizChoiceButton
                      active={selectedOptionId === option.id}
                      disabled={isLoading || isSubmitting}
                      hasSelection={Boolean(selectedOptionId)}
                      text={option.text}
                      onClick={() => setSelectedOptionId(option.id)}
                    />
                  </div>
                ))}
              </div>

              <p className="relative z-10 mt-5.5 text-center text-[11px] font-semibold leading-[1.35] text-primary-500">
                정답/오답 보상은 1일 1회 기준으로 반영돼요.
              </p>
            </article>
          </>
        ) : null}
      </section>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50">
        <div className="pointer-events-auto mx-auto w-full max-w-[600px] border-t border-gray-200 bg-white px-(--side-padding) pb-[calc(16px+env(safe-area-inset-bottom))] pt-4 shadow-[var(--shadow-card)]">
          <Button
            type="button"
            variant="primary"
            size="md"
            fullWidth
            className="!h-[56px]"
            disabled={!selectedOptionId || isLoading || isSubmitting || !quiz}
            onClick={handleSubmit}
          >
            {isSubmitting ? '제출 중...' : '정답 확인하기'}
          </Button>
        </div>
      </div>
    </MainLayout>
  )
}

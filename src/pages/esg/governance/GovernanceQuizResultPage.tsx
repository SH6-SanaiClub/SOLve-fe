import { useEffect, useState } from 'react'
import { Check, Lightbulb, LoaderCircle, X } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, IconButton, Icons } from '../../../components/common'
import {
  CelebrationBurst,
  PageMotionStyles,
  buildPageEnterStyle,
} from '../../../components/common/PageMotion'
import Header from '../../../components/layout/Header'
import MainLayout from '../../../components/layout/MainLayout'
import { ROUTE_PATHS } from '../../../constants/routePaths'
import {
  getTodayGovernanceQuiz,
  toGovernanceQuizResult,
} from '../../../services/governanceQuizService'
import type { GovernanceQuizResult } from '../../../types/governanceQuiz'

interface ResultLocationState {
  result?: GovernanceQuizResult
  returnTo?: string
}

function AnswerRow({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: 'blue' | 'red'
}) {
  const toneStyles =
    tone === 'blue'
      ? 'border-[#CFE0FF] bg-[#F4F8FF] text-[#1F5FFF]'
      : 'border-[#FFD2D2] bg-[#FFF5F5] text-[#E14B4B]'

  const iconStyles =
    tone === 'blue'
      ? 'bg-[#1F5FFF] text-white'
      : 'bg-[#E14B4B] text-white'

  return (
    <div className={`flex items-center gap-3 rounded-[10px] border px-4 py-3 ${toneStyles}`}>
      <span className={`flex h-5 w-5 items-center justify-center rounded-full ${iconStyles}`}>
        {tone === 'blue' ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
      </span>
      <div>
        <p className="text-[12px] leading-none font-semibold opacity-80">{label}</p>
        <p className="mt-1 text-[14px] leading-[1.5] font-semibold">{value || '-'}</p>
      </div>
    </div>
  )
}

export function GovernanceQuizResultPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const routeState = location.state as ResultLocationState | undefined
  const [result, setResult] = useState<GovernanceQuizResult | null>(routeState?.result ?? null)
  const [isLoading, setIsLoading] = useState(!routeState?.result)
  const backTarget = routeState?.returnTo ?? ROUTE_PATHS.home

  useEffect(() => {
    if (routeState?.result) {
      return
    }

    let mounted = true

    const loadCompletedQuiz = async () => {
      setIsLoading(true)

      try {
        const todayQuiz = await getTodayGovernanceQuiz()

        if (!mounted) {
          return
        }

        if (todayQuiz.status !== 'completed') {
          navigate(backTarget, { replace: true })
          return
        }

        setResult(toGovernanceQuizResult(todayQuiz))
      } catch {
        if (!mounted) {
          return
        }

        navigate(backTarget, { replace: true })
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    void loadCompletedQuiz()

    return () => {
      mounted = false
    }
  }, [backTarget, navigate, routeState?.result])

  if (isLoading) {
    return (
      <MainLayout
        className="bg-[#EEF1F6]"
        header={
          <Header
            bgColor="bg-white"
            left={
              <IconButton
                label="뒤로 가기"
                icon={<Icons.Back size={20} />}
                size="sm"
                onClick={() => navigate(backTarget, { replace: true })}
              />
            }
            title="오늘의 퀴즈"
            right={<div className="w-8" aria-hidden="true" />}
            className="border-b border-[#E8EEF8]"
          />
        }
      >
        <PageMotionStyles />
        <div className="flex min-h-[70vh] items-center justify-center text-[14px] text-[#6C7B91]">
          <LoaderCircle className="mr-2 animate-spin" size={16} />
          결과를 불러오는 중입니다.
        </div>
      </MainLayout>
    )
  }

  if (!result) {
    return null
  }

  const title = result.isCorrect ? '정답입니다!' : '오답입니다!'
  const description = result.isCorrect
    ? '대단해요! 정답을 맞히셨어요. 함께 내용을 알아볼까요?'
    : '아쉽지만 정답이 아니에요. 정답을 확인하고 지식을 쌓아볼까요?'
  const expertTip =
    result.explanation ??
    (result.isCorrect
      ? '정답의 근거를 짧게 확인하고 넘어가면 다음 퀴즈 정답률을 더 높일 수 있어요.'
      : '정답 해설을 읽어두면 비슷한 금융 보안 상황에서 더 빠르게 판단할 수 있어요.')

  return (
    <MainLayout
      className="bg-[#EEF1F6]"
      header={
        <Header
          bgColor="bg-white"
          left={
            <IconButton
                label="뒤로 가기"
                icon={<Icons.Back size={20} />}
                size="sm"
                onClick={() => navigate(backTarget, { replace: true })}
              />
          }
          title="오늘의 퀴즈"
          right={<div className="w-8" aria-hidden="true" />}
          className="border-b border-[#E8EEF8]"
        />
      }
    >
      <PageMotionStyles />
      <div className="fixed inset-0 top-[56px] bg-[rgba(15,23,42,0.18)]" aria-hidden="true" />

      <section className="relative z-10 flex min-h-[calc(100vh-56px-48px)] items-center justify-center py-6">
        <article
          className="w-full max-w-[360px] rounded-[10px] bg-white px-5 pt-7 pb-5 shadow-[0_24px_48px_rgba(15,23,42,0.12)]"
          style={buildPageEnterStyle(40, 500)}
        >
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              {result.isCorrect ? <CelebrationBurst className="-top-1" /> : null}
              <div
                className={[
                  'relative z-10 flex h-[76px] w-[76px] items-center justify-center rounded-full',
                  result.isCorrect ? 'bg-[#EAF2FF]' : 'bg-[#FFE9E9]',
                ].join(' ')}
              >
                <div
                  className={[
                    'flex h-[44px] w-[44px] items-center justify-center rounded-full',
                    result.isCorrect ? 'bg-[#D8E7FF] text-[#1F5FFF]' : 'bg-[#FFD5D5] text-[#E14B4B]',
                  ].join(' ')}
                >
                  {result.isCorrect ? <Check size={24} strokeWidth={3} /> : <X size={24} strokeWidth={3} />}
                </div>
              </div>
            </div>

            <h2 className="mt-6 text-[28px] leading-none font-bold tracking-[-0.03em] text-[#1E293B]">
              {title}
            </h2>
            <p className="mt-4 text-[14px] leading-[1.7] text-[#6C7B91]">{description}</p>
            {result.rewardPoint > 0 ? (
              <p className="mt-2 text-[15px] font-semibold text-primary-500">+{result.rewardPoint}P 적립</p>
            ) : null}
          </div>

          <div className="mt-6 space-y-3">
            <AnswerRow
              label="내가 선택한 답"
              value={result.selectedOptionText}
              tone={result.isCorrect ? 'blue' : 'red'}
            />
            <AnswerRow label="정답" value={result.correctOptionText} tone="blue" />
          </div>

          <div
            className={[
              'mt-5 rounded-[10px] border px-4 py-4',
              result.isCorrect
                ? 'border-[#D8E4FF] bg-[#F8FBFF]'
                : 'border-[#FFD9D9] bg-[#FFF7F7]',
            ].join(' ')}
          >
            <div className="flex items-start gap-3">
              <div
                className={[
                  'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                  result.isCorrect ? 'bg-[#E9F1FF] text-[#1F5FFF]' : 'bg-[#FFE7E7] text-[#E14B4B]',
                ].join(' ')}
              >
                <Lightbulb size={16} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[#475569]">전문가 팁</p>
                <p className="mt-2 text-[13px] leading-[1.7] text-[#64748B]">{expertTip}</p>
              </div>
            </div>
          </div>

          <Button
            type="button"
            variant="primary"
            size="md"
            fullWidth
            className="mt-6 !h-[50px] !rounded-[10px]"
            onClick={() => navigate(ROUTE_PATHS.home, { replace: true })}
          >
            퀴즈 마치기
          </Button>
        </article>
      </section>
    </MainLayout>
  )
}

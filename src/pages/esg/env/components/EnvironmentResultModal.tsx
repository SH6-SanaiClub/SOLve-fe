import { useEffect } from 'react'
import { X } from 'lucide-react'
import Button from '../../../../components/common/Button'
import {
  CelebrationBurst,
  PageMotionStyles,
} from '../../../../components/common/PageMotion'
import { getS3AssetUrl } from '../../../../constants/assetUrls'

export type EnvironmentResultVariant = 'success' | 'failure'

interface EnvironmentResultModalProps {
  open: boolean
  variant: EnvironmentResultVariant
  reason?: string | null
  rewardPoint?: number
  onClose: () => void
}

const RESULT_CONTENT: Record<
  EnvironmentResultVariant,
  {
    title: string
    description: string[]
    reward?: string
  }
> = {
  success: {
    title: '인증에 성공했어요',
    description: ['여러분의 성실함이 신용이 되는 소중한 한걸음입니다.'],
  },
  failure: {
    title: '인증에 실패했어요',
    description: ['올바른 이미지가 아닙니다.'],
  },
}

export function EnvironmentResultModal({
  open,
  variant,
  reason,
  rewardPoint,
  onClose,
}: EnvironmentResultModalProps) {
  const goodImage = getS3AssetUrl('good.webp')

  useEffect(() => {
    if (!open) {
      return
    }

    const previousOverflow = document.body.style.overflow

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEscape)
    }
  }, [open, onClose])

  if (!open) {
    return null
  }

  const content = RESULT_CONTENT[variant]
  const description =
    variant === 'success' || !reason ? content.description : [reason]
  const rewardLabel =
    variant === 'success' && typeof rewardPoint === 'number' && rewardPoint > 0
      ? `+ ${rewardPoint}P 적립 완료`
      : content.reward

  return (
    <div className="fixed inset-y-0 left-1/2 z-[110] flex w-full max-w-[600px] -translate-x-1/2 items-center justify-center px-6 py-8">
      <PageMotionStyles />
      <button
        type="button"
        aria-label="인증 결과 모달 닫기"
        className="absolute inset-0 bg-[rgba(2,6,23,0.22)]"
        onClick={onClose}
      />

      <section className="relative flex min-h-[420px] w-full max-w-[360px] flex-col rounded-[8px] bg-white px-5 pt-4 pb-5 shadow-[0_20px_48px_rgba(15,23,42,0.14)]">
        <div className="flex justify-end">
          <button
            type="button"
            aria-label="닫기"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-50"
            onClick={onClose}
          >
            <X size={20} strokeWidth={2.2} />
          </button>
        </div>

        <div className="flex flex-1 flex-col items-center px-3 pt-6 text-center">
          {variant === 'success' ? (
            <div className="relative">
              <CelebrationBurst className="-top-2" />
              <img
                src={goodImage}
                alt=""
                className="relative z-10 h-[96px] w-[96px] object-contain"
              />
            </div>
          ) : (
            <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-[#FFE1E1]">
              <X size={28} strokeWidth={2.8} className="text-[#D92D20]" />
            </div>
          )}

          <div className={`${variant === 'failure' ? 'mt-11' : 'mt-6'} flex flex-col items-center`}>
            <h2 className="text-[20px] leading-[1.35] font-bold tracking-[-0.02em] text-gray-700">
              {content.title}
            </h2>

            <div className={`flex flex-col items-center ${rewardLabel ? 'mt-1 gap-5' : 'mt-3 gap-0'}`}>
              <div className="space-y-1.5">
                {description.map((line) => (
                  <p key={line} className="text-sm leading-[1.7] font-medium text-gray-500">
                    {line}
                  </p>
                ))}
              </div>

              {rewardLabel ? (
                <p className="text-[16px] leading-none font-semibold text-primary-500">
                  {rewardLabel}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <Button
          type="button"
          variant="primary"
          size="lg"
          fullWidth
          className="!h-[48px] text-[16px] font-semibold"
          onClick={onClose}
        >
          확인
        </Button>
      </section>
    </div>
  )
}

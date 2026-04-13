import { useEffect } from 'react'
import goodImage from '../../../assets/good.png'
import { Button } from '../../../components/common'

interface OnboardingCompleteModalProps {
  open: boolean
  onClose: () => void
}

export function OnboardingCompleteModal({
  open,
  onClose,
}: OnboardingCompleteModalProps) {
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
  }, [onClose, open])

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-y-0 left-1/2 z-[110] flex w-full max-w-[600px] -translate-x-1/2 items-center justify-center px-6 py-8">
      <button
        type="button"
        aria-label="설문 완료 모달 닫기"
        className="absolute inset-0 bg-[rgba(2,6,23,0.22)]"
        onClick={onClose}
      />

      <section className="relative flex min-h-[420px] w-full max-w-[360px] flex-col rounded-[12px] bg-white px-5 pt-6 pb-5 shadow-[0_20px_48px_rgba(15,23,42,0.14)]">
        <div className="flex flex-1 flex-col items-center justify-center px-3 text-center">
          <img
            src={goodImage}
            alt="설문 완료 캐릭터"
            className="h-[112px] w-[112px] object-contain"
          />

          <div className="mt-6 flex flex-col items-center">
            <h2 className="text-[20px] leading-[1.35] font-bold tracking-[-0.02em] text-gray-700">
              설문이 완료되었어요
            </h2>

            <div className="mt-3 space-y-1.5">
              <p className="text-sm leading-[1.7] font-medium text-gray-500 break-keep">
                이제 SOLve가 회원님에게 맞는 활동을 더 잘 추천해드릴게요.
              </p>
              <p className="text-sm leading-[1.7] font-medium text-gray-500 break-keep">
                앞으로의 실천도 함께 응원할게요!
              </p>
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
          SOLve 시작하기
        </Button>
      </section>
    </div>
  )
}

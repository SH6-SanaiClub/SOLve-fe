import { useEffect } from 'react'
import { Button } from '../../../components/common'

interface PopularActivityGuideModalProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  onClose: () => void
  onConfirm?: () => void
}

export const PopularActivityGuideModal = ({
  open,
  title,
  message,
  confirmLabel,
  onClose,
  onConfirm,
}: PopularActivityGuideModalProps) => {
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
        aria-label="인기 활동 안내 모달 닫기"
        className="absolute inset-0 bg-[rgba(2,6,23,0.22)]"
        onClick={onClose}
      />

      <section className="relative w-full max-w-[360px] rounded-[12px] bg-white px-5 pt-6 pb-5 shadow-[0_20px_48px_rgba(15,23,42,0.14)]">
        <div className="text-center">
          <h2 className="text-[20px] leading-[1.35] font-bold tracking-[-0.02em] text-gray-700">
            {title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-font-sub break-keep">{message}</p>
        </div>

        {confirmLabel && onConfirm ? (
          <div className="mt-6 flex gap-3">
            <Button variant="sub" fullWidth className="!h-[48px]" onClick={onClose}>
              닫기
            </Button>
            <Button fullWidth className="!h-[48px]" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </div>
        ) : (
          <Button fullWidth className="mt-6 !h-[48px]" onClick={onClose}>
            확인
          </Button>
        )}
      </section>
    </div>
  )
}

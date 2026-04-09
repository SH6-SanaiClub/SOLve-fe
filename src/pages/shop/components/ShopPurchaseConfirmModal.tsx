import { useEffect } from 'react'
import { Button, InfoRow } from '../../../components/common'

interface ShopPurchaseConfirmModalProps {
  open: boolean
  productName: string
  pricePoints: number
  currentPoints: number
  remainingPoints: number
  onClose: () => void
  onConfirm: () => void
  isSubmitting?: boolean
}

const pointFormatter = new Intl.NumberFormat('ko-KR')

const formatPoints = (points: number) => `${pointFormatter.format(points)} P`

const modalText = {
  ariaLabel: '\uAD6C\uB9E4 \uD655\uC778 \uBAA8\uB2EC \uB2EB\uAE30',
  title: '\uAD6C\uB9E4\uD558\uC2DC\uACA0\uC5B4\uC694?',
  description: '\uAD6C\uB9E4 \uC815\uBCF4\uB97C \uD655\uC778\uD55C \uB4A4 \uC9C4\uD589\uD574 \uC8FC\uC138\uC694.',
  productName: '\uC0C1\uD488\uBA85',
  pricePoints: '\uCC28\uAC10 \uD3EC\uC778\uD2B8',
  currentPoints: '\uD604\uC7AC \uBCF4\uC720 \uD3EC\uC778\uD2B8',
  remainingPoints: '\uAD6C\uB9E4 \uD6C4 \uC794\uC5EC \uD3EC\uC778\uD2B8',
  cancel: '\uCDE8\uC18C',
  confirm: '\uAD6C\uB9E4\uD558\uAE30',
}

export const ShopPurchaseConfirmModal = ({
  open,
  productName,
  pricePoints,
  currentPoints,
  remainingPoints,
  onClose,
  onConfirm,
  isSubmitting = false,
}: ShopPurchaseConfirmModalProps) => {
  useEffect(() => {
    if (!open) {
      return
    }

    const previousOverflow = document.body.style.overflow

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isSubmitting, onClose, open])

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-y-0 left-1/2 z-[110] flex w-full max-w-[600px] -translate-x-1/2 items-center justify-center px-6 py-8">
      <button
        type="button"
        aria-label={modalText.ariaLabel}
        className="absolute inset-0 bg-[rgba(2,6,23,0.22)]"
        onClick={isSubmitting ? undefined : onClose}
      />

      <section className="relative w-full max-w-[360px] rounded-[8px] bg-white px-5 pt-6 pb-5 shadow-[0_20px_48px_rgba(15,23,42,0.14)]">
        <div className="text-center">
          <h2 className="text-[20px] leading-[1.35] font-bold tracking-[-0.02em] text-gray-700">
            {modalText.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-font-sub">
            {modalText.description}
          </p>
        </div>

        <div className="mt-6 rounded-control bg-gray-50 p-4">
          <div className="space-y-3">
            <InfoRow label={modalText.productName} value={productName} />
            <InfoRow label={modalText.pricePoints} value={formatPoints(pricePoints)} />
            <InfoRow label={modalText.currentPoints} value={formatPoints(currentPoints)} />
            <div className="h-px bg-gray-200" />
            <InfoRow
              label={modalText.remainingPoints}
              value={formatPoints(remainingPoints)}
              valueClassName="font-semibold text-primary-500"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            type="button"
            variant="sub"
            fullWidth
            className="!h-[48px]"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {modalText.cancel}
          </Button>
          <Button
            type="button"
            variant="primary"
            fullWidth
            className="!h-[48px]"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {modalText.confirm}
          </Button>
        </div>
      </section>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { PageMotionStyles } from '../../../../components/common/PageMotion'

interface EnvBottomSheetProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

export function EnvBottomSheet({ open, onClose, children }: EnvBottomSheetProps) {
  const [shouldRender, setShouldRender] = useState(open)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (open) {
      setShouldRender(true)
      const frameId = window.requestAnimationFrame(() => {
        setIsVisible(true)
      })

      return () => {
        window.cancelAnimationFrame(frameId)
      }
    }

    setIsVisible(false)
    const timeoutId = window.setTimeout(() => {
      setShouldRender(false)
    }, 320)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      setIsVisible(false)
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

  if (!shouldRender) {
    return null
  }

  return (
    <div
      aria-hidden={!open}
      className={`absolute inset-0 z-[90] transition-[visibility] duration-200 ${
        open ? 'visible' : 'invisible'
      }`}
    >
      <PageMotionStyles />
      <button
        type="button"
        aria-label="친환경 활동 바텀시트 닫기"
        className={`absolute inset-0 transition-opacity duration-300 ${
          open && isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ backgroundColor: 'rgba(2, 6, 23, 0.62)' }}
        onClick={onClose}
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center">
        <section
          className={`pointer-events-auto w-full min-h-[440px] rounded-t-[24px] bg-white px-5 pt-8 pb-[calc(24px+env(safe-area-inset-bottom))] shadow-[0_-20px_48px_rgba(15,23,42,0.16)] transition-transform duration-[320ms] will-change-transform ${
            open && isVisible ? 'translate-y-0' : 'translate-y-full'
          }`}
          style={{
            transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {children}
        </section>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { getS3AssetUrl } from '../../../../constants/assetUrls'

interface EnvironmentLoadingOverlayProps {
  open: boolean
}

const DOT_COUNT = 3
const LOADING_MESSAGE = '사진 확인 중입니다'

export function EnvironmentLoadingOverlay({ open }: EnvironmentLoadingOverlayProps) {
  const [activeDotIndex, setActiveDotIndex] = useState(0)
  const loadingImage = getS3AssetUrl('loading.webp')

  useEffect(() => {
    if (!open) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const interval = window.setInterval(() => {
      setActiveDotIndex((prev) => (prev + 1) % DOT_COUNT)
    }, 360)

    return () => {
      document.body.style.overflow = previousOverflow
      window.clearInterval(interval)
    }
  }, [open])

  if (!open) {
    return null
  }

  return (
    <div className="pointer-events-auto fixed inset-y-0 left-1/2 z-[105] flex w-full max-w-[600px] -translate-x-1/2 items-center justify-center px-6 py-8">
      <div className="absolute inset-0 bg-[rgba(15,23,42,0.18)] backdrop-blur-[6px]" aria-hidden="true" />

      <section
        role="status"
        aria-live="polite"
        className="relative flex w-full max-w-[280px] flex-col items-center rounded-[16px] border border-white/70 bg-white/90 px-6 py-7 text-center shadow-[0_20px_48px_rgba(15,23,42,0.16)]"
      >
        <img
          src={loadingImage}
          alt=""
          aria-hidden="true"
          className="h-[120px] w-[120px] object-contain"
        />

        <p className="mt-5 text-[18px] leading-none font-semibold text-gray-700">
          {LOADING_MESSAGE}
          <span className="inline-flex w-[30px] justify-start text-primary-500">
            {Array.from({ length: DOT_COUNT }, (_, index) => (
              <span
                key={index}
                className={`transition-opacity duration-200 ${
                  index <= activeDotIndex ? 'opacity-100' : 'opacity-20'
                }`}
              >
                .
              </span>
            ))}
          </span>
        </p>

        <p className="mt-3 text-sm leading-6 font-medium text-gray-500">
          잠시만 기다려 주세요.
        </p>
      </section>
    </div>
  )
}

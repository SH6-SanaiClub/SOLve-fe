import { useEffect, useState } from 'react'

interface DonationSummaryBannerProps {
  totalDonationAmount: number
  totalParticipantCount: number
  imageSrc?: string
  imageAlt?: string
}

export const DonationSummaryBanner = ({
  totalDonationAmount,
  totalParticipantCount,
  imageSrc,
  imageAlt = "",
}: DonationSummaryBannerProps) => {
  const [displayedAmount, setDisplayedAmount] = useState(0)
  const [displayedParticipants, setDisplayedParticipants] = useState(0)

  useEffect(() => {
    let amountFrame = 0
    let participantFrame = 0

    const animateValue = (
      target: number,
      setter: (value: number) => void,
      duration: number,
    ) => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

      if (mediaQuery.matches) {
        setter(target)
        return 0
      }

      let startTime: number | null = null

      const tick = (currentTime: number) => {
        if (startTime === null) {
          startTime = currentTime
        }

        const progress = Math.min((currentTime - startTime) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)

        setter(Math.round(target * eased))

        if (progress < 1) {
          return window.requestAnimationFrame(tick)
        }

        return 0
      }

      return window.requestAnimationFrame(tick)
    }

    amountFrame = animateValue(totalDonationAmount, setDisplayedAmount, 1100)
    participantFrame = animateValue(totalParticipantCount, setDisplayedParticipants, 900)

    return () => {
      window.cancelAnimationFrame(amountFrame)
      window.cancelAnimationFrame(participantFrame)
    }
  }, [totalDonationAmount, totalParticipantCount])

  return (
    <section className="relative h-[112px] overflow-hidden rounded-control bg-primary-400">
      <div className="absolute inset-y-0 left-6 flex w-[153px] flex-col justify-center gap-2 max-[380px]:left-5 max-[380px]:w-[calc(100%-150px)]">
        <div className="flex w-[126px] flex-col gap-1 max-[380px]:w-full">
          <p className="text-sm leading-[120%] font-semibold text-primary-50">
            현재까지 모인 기부금
          </p>
          <strong className="text-xl leading-5 font-bold tracking-[-0.02em] text-white">
            {new Intl.NumberFormat('ko-KR').format(displayedAmount)}원
          </strong>
        </div>

        <p className="text-xs leading-[120%] font-medium text-primary-200">
          총 {new Intl.NumberFormat('ko-KR').format(displayedParticipants)}명이 가치에 더했어요.
        </p>
      </div>

      {imageSrc ? (
        <img
          src={imageSrc}
          alt={imageAlt}
          aria-hidden={imageAlt ? undefined : true}
          className="absolute right-3 top-1/2 h-[88px] w-[176px] -translate-y-1/2 object-contain object-right max-[380px]:right-2 max-[380px]:h-[80px] max-[380px]:w-[120px]"
        />
      ) : (
        <>
          <div
            aria-hidden="true"
            className="absolute right-[-18px] top-[-10px] h-[110px] w-[110px] rounded-full border border-white/15"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-[-32px] right-[42px] h-[96px] w-[96px] rounded-full bg-primary-400/25 blur-md"
          />
        </>
      )}
    </section>
  );
}

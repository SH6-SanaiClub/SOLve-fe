interface PullRefreshSpinnerProps {
  progress: number
  isRefreshing: boolean
  visible: boolean
}

const SEGMENT_COUNT = 12

export function PullRefreshSpinner({
  progress,
  isRefreshing,
  visible,
}: PullRefreshSpinnerProps) {
  const scale = isRefreshing ? 1 : 0.84 + progress * 0.16
  const opacity = visible || isRefreshing ? 0.45 + progress * 0.55 : 0

  return (
    <div
      className="pull-refresh-spinner flex h-12 w-12 items-center justify-center drop-shadow-[0_6px_14px_rgba(148,163,184,0.22)]"
      style={{
        opacity,
        transform: `scale(${scale})`,
        animationDuration: isRefreshing ? '1.7s' : '2.6s',
        animationPlayState: visible || isRefreshing ? 'running' : 'paused',
        transition: 'opacity 160ms ease, transform 140ms ease',
      }}
    >
      <svg width="42" height="42" viewBox="0 0 42 42" aria-hidden="true">
        {Array.from({ length: SEGMENT_COUNT }).map((_, index) => {
          const segmentOpacity = 0.14 + index * 0.065

          return (
            <rect
              key={index}
              x="19"
              y="3.5"
              width="4"
              height="10"
              rx="2"
              fill="#94A3B8"
              opacity={segmentOpacity}
              transform={`rotate(${index * (360 / SEGMENT_COUNT)} 21 21)`}
            />
          )
        })}
      </svg>
    </div>
  )
}

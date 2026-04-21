import type { CSSProperties } from 'react'

export function PageMotionStyles() {
  return (
    <style>{`
      @keyframes solvePageFadeUp {
        0% {
          opacity: 0;
          transform: translate3d(0, 18px, 0) scale(0.985);
        }
        100% {
          opacity: 1;
          transform: translate3d(0, 0, 0) scale(1);
        }
      }

      @keyframes solvePageFloat {
        0%, 100% {
          transform: translate3d(0, 0, 0);
        }
        50% {
          transform: translate3d(0, -6px, 0);
        }
      }

      @keyframes solvePagePulseGlow {
        0%, 100% {
          opacity: 0.42;
          transform: scale(0.96);
        }
        50% {
          opacity: 0.72;
          transform: scale(1.04);
        }
      }

      @keyframes solvePageConfetti {
        0% {
          opacity: 0;
          transform: translate3d(0, 0, 0) rotate(0deg) scale(0.8);
        }
        10% {
          opacity: 1;
        }
        100% {
          opacity: 0;
          transform: translate3d(var(--confetti-x), var(--confetti-y), 0)
            rotate(var(--confetti-rotate)) scale(1);
        }
      }

      @keyframes solvePageDrawLine {
        0% {
          stroke-dashoffset: var(--line-length);
        }
        100% {
          stroke-dashoffset: 0;
        }
      }

      @keyframes solvePagePopIn {
        0% {
          opacity: 0;
          transform: scale(0.75);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        * {
          scroll-behavior: auto !important;
        }
      }
    `}</style>
  )
}

export const buildPageEnterStyle = (
  delayMs = 0,
  durationMs = 460,
): CSSProperties => ({
  opacity: 0,
  animation: `solvePageFadeUp ${durationMs}ms cubic-bezier(0.22, 1, 0.36, 1) forwards`,
  animationDelay: `${delayMs}ms`,
})

export const buildFloatingStyle = (
  durationMs = 3200,
  delayMs = 0,
): CSSProperties => ({
  animation: `solvePageFloat ${durationMs}ms ease-in-out ${delayMs}ms infinite`,
})

export const buildPulseGlowStyle = (
  durationMs = 2400,
  delayMs = 0,
): CSSProperties => ({
  animation: `solvePagePulseGlow ${durationMs}ms ease-in-out ${delayMs}ms infinite`,
})

const CONFETTI_PIECES = [
  { x: '-72px', y: '-88px', rotate: '-180deg', color: '#0046FF' },
  { x: '-38px', y: '-104px', rotate: '-140deg', color: '#7C3AED' },
  { x: '0px', y: '-112px', rotate: '-90deg', color: '#22C55E' },
  { x: '42px', y: '-100px', rotate: '-36deg', color: '#F97316' },
  { x: '76px', y: '-82px', rotate: '24deg', color: '#0EA5E9' },
  { x: '-68px', y: '-28px', rotate: '-120deg', color: '#14B8A6' },
  { x: '68px', y: '-24px', rotate: '110deg', color: '#EF4444' },
  { x: '-18px', y: '-126px', rotate: '-70deg', color: '#EAB308' },
  { x: '18px', y: '-120px', rotate: '70deg', color: '#A855F7' },
  { x: '0px', y: '-84px', rotate: '180deg', color: '#2563EB' },
] as const

export function CelebrationBurst({
  className = '',
}: {
  className?: string
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-visible ${className}`}
    >
      {CONFETTI_PIECES.map((piece, index) => (
        <span
          key={`${piece.color}-${index}`}
          className="absolute left-1/2 top-1/2 block h-[10px] w-[6px] rounded-full"
          style={{
            backgroundColor: piece.color,
            ['--confetti-x' as string]: piece.x,
            ['--confetti-y' as string]: piece.y,
            ['--confetti-rotate' as string]: piece.rotate,
            animation: `solvePageConfetti 1100ms cubic-bezier(0.22, 1, 0.36, 1) ${index * 35}ms both`,
          }}
        />
      ))}
    </div>
  )
}

import { Check, X } from 'lucide-react'
import type { EnvActivityConfig } from '../envActivityConfig'

interface EnvironmentGuideCardProps {
  guide: EnvActivityConfig['guides'][number]
}

export function EnvironmentGuideCard({ guide }: EnvironmentGuideCardProps) {
  const isGood = guide.tone === 'good'
  const GuideIcon = isGood ? Check : X
  const accentColor = isGood ? 'var(--color-primary-500)' : '#BA1A1A'
  const iconBackground = isGood ? 'var(--color-primary-50)' : '#FDEDED'

  return (
    <section className="rounded-card bg-white px-5 py-5 shadow-card">
      <div className="flex items-center gap-3">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-[12px] shadow-[0_10px_24px_rgba(51,65,85,0.08)]"
          style={{ backgroundColor: iconBackground, color: accentColor }}
        >
          <GuideIcon size={18} strokeWidth={2.5} />
        </div>
        <p
          className="text-sm font-bold"
          style={{ color: accentColor }}
        >
          {guide.title}
        </p>
      </div>

      <ul
        className="mt-[10px] list-disc space-y-2 pl-5 text-xs leading-5 font-medium text-gray-700 marker:text-gray-400"
      >
        {guide.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}

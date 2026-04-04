import { Check, X } from 'lucide-react'
import type { EnvActivityConfig } from '../envActivityConfig'

interface EnvironmentGuideCardProps {
  guide: EnvActivityConfig['guides'][number]
}

export function EnvironmentGuideCard({ guide }: EnvironmentGuideCardProps) {
  const isGood = guide.tone === 'good'
  const GuideIcon = isGood ? Check : X
  const accentColor = isGood ? '#29CC6A' : '#BA1A1A'
  const iconBackground = isGood ? '#EAF8F0' : '#FDEDED'

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
        className="space-y-1 pl-4 text-xs leading-5 font-medium text-gray-700"
        style={{ marginTop: '10px' }}
      >
        {guide.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div
        className="mt-4 flex h-[134px] items-end overflow-hidden rounded-[14px] bg-gray-100 px-4 py-3"
        style={{
          background: isGood
            ? 'linear-gradient(180deg, #6B7280 0%, #D1D5DB 55%, #6B7280 100%)'
            : 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 45%, #CBD5E1 100%)',
        }}
      >
        <p className="text-[11px] leading-4 font-medium text-white/90">
          {guide.previewLabel}
        </p>
      </div>
    </section>
  )
}

import type { WeeklyActivityStatus } from '../../../types/home'

interface WeeklyActivityTrackerProps {
  items: WeeklyActivityStatus[]
}

export function WeeklyActivityTracker({ items }: WeeklyActivityTrackerProps) {
  return (
    <ul className="grid grid-cols-7 gap-2">
      {items.map((item) => (
        <li key={item.day} className="flex flex-col items-center gap-2">
          <span className="text-xs font-medium text-gray-400">{item.day}</span>
          <span
            className={[
              'flex h-9 w-9 items-center justify-center rounded-full border',
              item.completed
                ? 'border-primary-300 bg-primary-300 text-white'
                : 'border-gray-300 bg-white text-transparent',
            ].join(' ')}
            aria-label={`${item.day} ${item.completed ? '활동 완료' : '활동 없음'}`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M12.4 5.3L6.8 10.9L3.9 8"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </li>
      ))}
    </ul>
  )
}

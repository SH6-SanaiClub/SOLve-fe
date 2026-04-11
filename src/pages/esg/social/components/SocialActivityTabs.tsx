import { useNavigate } from 'react-router-dom'
import { ROUTE_PATHS } from '../../../../constants/routePaths'

interface SocialActivityTabsProps {
  activeTab: 'donation' | 'store' | 'volunteer'
}

const tabItems = [
  {
    value: 'donation',
    label: '기부',
    path: ROUTE_PATHS.activitySocialDonation,
  },
  { value: 'store', label: '가치가게', path: ROUTE_PATHS.activitySocialStore },
  {
    value: 'volunteer',
    label: '봉사',
    path: ROUTE_PATHS.activitySocialVolunteer,
  },
] as const

export const SocialActivityTabs = ({ activeTab }: SocialActivityTabsProps) => {
  const navigate = useNavigate()

  return (
    <div className="sticky top-(--header-h) z-40 mx-[-16px] flex border-b border-gray-200 bg-white">
      {tabItems.map((item) => {
        const isActive = item.value === activeTab

        return (
          <button
            type="button"
            key={item.value}
            role="tab"
            aria-selected={isActive}
            onClick={() => {
              if (item.path && !isActive) {
                navigate(item.path)
              }
            }}
            className={`relative flex h-12 w-1/3 items-center justify-center transition-colors ${
              isActive ? 'text-font-main' : 'text-gray-400'
            }`}
          >
            <span className="text-base font-semibold tracking-[-0.02em]">
              {item.label}
            </span>
            <span
              className={`absolute inset-x-0 bottom-0 h-px transition-colors ${
                isActive ? 'bg-primary-500' : 'bg-transparent'
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}

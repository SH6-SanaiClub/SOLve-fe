interface SocialActivityTabsProps {
  activeTab: 'donation' | 'store' | 'volunteer'
}

const tabItems = [
  { value: 'donation', label: '기부' },
  { value: 'store', label: '가치가게' },
  { value: 'volunteer', label: '봉사' },
] as const

export const SocialActivityTabs = ({ activeTab }: SocialActivityTabsProps) => {
  return (
    <div className="mx-[-16px] flex bg-white">
      {tabItems.map((item) => {
        const isActive = item.value === activeTab

        return (
          <div
            key={item.value}
            className={`relative flex h-12 w-1/3 items-center justify-center border-b ${
              isActive ? 'border-primary-500' : 'border-gray-200'
            }`}
          >
            <span
              className={`text-base font-semibold tracking-[-0.02em] ${
                isActive ? 'text-font-main' : 'text-gray-400'
              }`}
            >
              {item.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

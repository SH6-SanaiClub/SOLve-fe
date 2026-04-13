export type FinanceTabValue = 'all' | 'savings' | 'loan'

interface FinanceTabsProps {
  activeTab: FinanceTabValue
  onChange: (tab: FinanceTabValue) => void
}

const tabItems = [
  { value: 'all', label: '전체' },
  { value: 'savings', label: '적금 상품' },
  { value: 'loan', label: '대출 상품' },
] as const

export const FinanceTabs = ({ activeTab, onChange }: FinanceTabsProps) => {
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
              if (!isActive) {
                onChange(item.value)
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

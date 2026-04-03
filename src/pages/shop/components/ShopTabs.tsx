import type { ShopTabItem, ShopCategoryValue } from '../shopData'

interface ShopTabsProps {
  items: ShopTabItem[]
  value: ShopCategoryValue
  onChange: (value: ShopCategoryValue) => void
}

export const ShopTabs = ({ items, value, onChange }: ShopTabsProps) => (
  <div role="tablist" className="flex w-full border-b border-gray-200 bg-white">
    {items.map((item) => {
      const isActive = item.value === value

      return (
        <button
          key={item.value}
          type="button"
          role="tab"
          aria-selected={isActive}
          onClick={() => onChange(item.value)}
          className={`relative flex h-12 flex-1 items-center justify-center text-sm transition-colors ${
            isActive ? 'font-semibold text-gray-700' : 'font-medium text-gray-400'
          }`}
        >
          {item.label}
          <span
            className={`absolute inset-x-0 bottom-0 h-px transition-colors ${
              isActive ? 'bg-primary-500' : 'bg-gray-200'
            }`}
          />
        </button>
      )
    })}
  </div>
)

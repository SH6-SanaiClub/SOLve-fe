import React from 'react';

export interface TabItem {
  label: string;
  value: string;
  disabled?: boolean;
}

/**
 * 상단 카테고리 전환용 탭.
 * 사용 예시:
 * <Tabs items={tabItems} value={currentTab} onChange={setCurrentTab} />
 */
interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({ items, value, onChange, className = '' }) => {
  return (
    <div role="tablist" className={`flex w-full border-b border-gray-200 ${className}`}>
      {items.map((item) => {
        const isActive = item.value === value;

        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={item.disabled}
            onClick={() => onChange(item.value)}
            className={`
              relative flex-1 pb-3 pt-2 text-sm transition-colors
              disabled:cursor-not-allowed disabled:text-gray-300
              ${isActive ? 'font-semibold text-primary-500' : 'font-medium text-font-sub'}
            `}
          >
            {item.label}
            <span
              className={`
                absolute inset-x-0 bottom-0 h-[2px] rounded-full transition-colors
                ${isActive ? 'bg-primary-500' : 'bg-transparent'}
              `}
            />
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;

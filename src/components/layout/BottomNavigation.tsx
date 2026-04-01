import React, { useState } from 'react';
import { Icons } from '../common/Icons';

export interface BottomNavigationItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

interface BottomNavigationProps {
  items?: BottomNavigationItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (key: string) => void;
  className?: string;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  items,
  value,
  defaultValue,
  onChange,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState(defaultValue ?? items?.[0]?.key ?? 'home');

  const navItems = [
    { label: '홈', icon: <Icons.Home /> },
    { label: '포인트샵', icon: <Icons.Shop /> },
    { label: '금융상품', icon: <Icons.Bank /> },
    { label: '마이페이지', icon: <Icons.MyPage /> },
  ];

  const fallbackKeys = ['home', 'benefits', 'finance', 'mypage'];
  const navigationItems: BottomNavigationItem[] = (items ?? navItems).map((item, index) => ({
    key: 'key' in item ? item.key : fallbackKeys[index] ?? `item-${index}`,
    label: item.label,
    icon: item.icon,
    disabled: 'disabled' in item ? item.disabled : undefined,
  }));
  const activeValue = value ?? activeTab;

  const handleSelect = (key: string) => {
    if (value === undefined) {
      setActiveTab(key);
    }

    onChange?.(key);
  };

  return (
    <nav
      className={`
        fixed bottom-0 left-1/2 -translate-x-1/2 z-50
        w-full max-w-[600px] h-(--nav-h) bg-white border-t border-gray-200
        flex items-center justify-around px-(--side-padding) py-[8px]
        ${className}
      `}
    >
      {navigationItems.map((item) => {
        const isActive = activeValue === item.key;
        return (
          <button
            key={item.key}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            disabled={item.disabled}
            onClick={() => handleSelect(item.key)}
            className="flex min-w-[64px] flex-col items-center justify-center rounded-control px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className={`h-[24px] flex items-center justify-center ${isActive ? 'text-font-main' : 'text-font-sub'}`}>
              {item.icon}
            </div>

            <span
              className={`text-xs tracking-tight-sm leading-none mt-[6px] ${
                isActive ? 'text-font-main font-semibold' : 'text-font-sub font-medium'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNavigation;

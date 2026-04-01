import React, { useState } from 'react';
import { Icons } from '../common/Icons';

const BottomNavigation: React.FC = () => {
  const [activeTab, setActiveTab] = useState('홈');

  const navItems = [
    { label: '홈', icon: <Icons.Home /> },
    { label: '포인트샵', icon: <Icons.Shop /> },
    { label: '금융상품', icon: <Icons.Bank /> },
    { label: '마이페이지', icon: <Icons.MyPage /> },
  ];

  return (
    <nav className="
      fixed bottom-0 left-1/2 -translate-x-1/2 z-50 
      w-full max-w-[600px] h-(--nav-h) bg-white border-t border-gray-200 
      flex items-center justify-around px-(--side-padding) py-[8px] 
      font-['Pretendard_Variable']
    ">
      {navItems.map((item) => {
        const isActive = activeTab === item.label;
        return (
          <div
            key={item.label}
            onClick={() => setActiveTab(item.label)}
            className="flex flex-col items-center justify-center cursor-pointer min-w-[64px]"
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
          </div>
        );
      })}
    </nav>
  );
};

export default BottomNavigation;
import React, { useState } from 'react';
import { House, ShoppingBasket, Landmark, User } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const [activeTab, setActiveTab] = useState('홈');

  const navItems = [
    { label: '홈', icon: <House size={24} /> },
    { label: '포인트샵', icon: <ShoppingBasket size={24} /> },
    { label: '금융상품', icon: <Landmark size={24} /> },
    { label: '마이페이지', icon: <User size={24} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[66px] bg-[#FFFFFF] border-t border-[#E2E8F0] flex items-center justify-around px-[20px] py-[8px] z-50 font-['Pretendard_Variable']">
      {navItems.map((item) => {
        const isActive = activeTab === item.label;
        return (
          <div
            key={item.label}
            onClick={() => setActiveTab(item.label)}
            className="flex flex-col items-center justify-center cursor-pointer min-w-[64px] gap-1"
          >
            <div className={isActive ? 'text-[#334155]' : 'text-[#94A3B8]'}>
              {item.icon}
            </div>
            
            <span 
              className={`text-[11px] leading-none ${
                isActive ? 'text-[#334155] font-semibold' : 'text-[#94A3B8] font-medium'
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
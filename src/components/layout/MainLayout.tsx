import React from 'react';

interface Props {
  children: React.ReactNode;
}

const MainLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen w-full max-w-[600px] mx-auto bg-[#F1F5F9] shadow-2xl relative flex flex-col font-['Pretendard_Variable']">
      
      {/* 콘텐츠 영역 */}
      <main className="flex-1 w-full px-5 pt-6 pb-[80px]">
        {children}
      </main>

    </div>
  );
};

export default MainLayout;
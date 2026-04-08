import React from 'react';


// 공통 메인 레이아웃 (MainLayout) 컴포넌트
// 모든 페이지의 뼈대(액자) 역할을 하는 최상위 컨테이너
// 모바일 웹 뷰 형태(최대 너비 600px, 가운데 정렬)를 유지
// 상단 Header와 하단 BottomNavigation이 차지하는 공간을 자동으로 계산하여 여백(padding)을 잡아줌

// @param {React.ReactNode} children - 페이지의 메인 콘텐츠 (Header와 Nav 사이에 들어갈 내용)
// @param {React.ReactNode} header - 페이지 상단에 고정될 Header 컴포넌트 (선택)
// @param {React.ReactNode} nav - 페이지 하단에 고정될 BottomNavigation 컴포넌트 (선택)

interface Props {
  className?: string;
  children: React.ReactNode;
  header?: React.ReactNode; // Header 컴포넌트
  nav?: React.ReactNode;    // BottomNavigation 컴포넌트
}

const MainLayout: React.FC<Props> = ({ children, header, nav, className = '' }) => {
  const contentPaddingTop = header ? 'pt-(--header-h)' : 'pt-0';
  const contentPaddingBottom = nav ? 'pb-[calc(var(--nav-h)+20px)]' : 'pb-6';

  return (
    <div className={`min-h-screen w-full max-w-[600px] mx-auto bg-bg-light relative flex flex-col font-pretendard ${className}`}>
      
      {header}

      {/* 2. 콘텐츠 영역 */}
      <main className="
        flex-1 w-full 
        px-(--side-padding)
      ">
        {/* 페이지 내부 요소들은 여기서부터 gap만 신경 쓰면 됩니다 */}
        <div className={`flex flex-col gap-4 py-6 ${contentPaddingTop} ${contentPaddingBottom}`}>
          {children}
        </div>
      </main>

      {/* 3. 하단바 영역 */}
      {nav}
    </div>
  );
};

export default MainLayout;

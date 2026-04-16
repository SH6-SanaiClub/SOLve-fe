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
  contentRef?: React.Ref<HTMLElement>;
  subHeader?: React.ReactNode;
  subHeaderHeight?: number;
  contentSpacing?: 'default' | 'comfortable' | 'spacious';
}

const MainLayout: React.FC<Props> = ({
  children,
  header,
  nav,
  className = '',
  contentRef,
  subHeader,
  subHeaderHeight = 48,
  contentSpacing = 'default',
}) => {
  const contentTopGapMap = {
    default: 0,
    comfortable: 12,
    spacious: 20,
  } as const;
  const contentTopGap = contentTopGapMap[contentSpacing];
  const headerInset = header
    ? 'calc(var(--header-h) + env(safe-area-inset-top))'
    : '0px';
  const contentPaddingTop = subHeader
    ? `calc(${headerInset} + ${subHeaderHeight}px + ${contentTopGap}px)`
    : header
      ? `calc(${headerInset} + ${contentTopGap}px)`
      : '1.5rem';
  const contentPaddingBottom = nav
    ? 'calc(var(--nav-h) + env(safe-area-inset-bottom) + 20px)'
    : '1.5rem';

  return (
    <div
      className={`w-full max-w-[600px] mx-auto bg-bg-light relative flex flex-col overflow-hidden font-pretendard ${className}`}
      style={{ minHeight: '100dvh', height: '100dvh' }}
    >
      
      {header}

      {subHeader ? (
        <div
          className="fixed left-1/2 z-40 w-full max-w-[600px] -translate-x-1/2"
          style={{
            top: 'calc(var(--header-h) + env(safe-area-inset-top))',
            height: `${subHeaderHeight}px`,
          }}
        >
          {subHeader}
        </div>
      ) : null}

      {/* 2. 콘텐츠 영역 */}
      <main className="
        flex-1 min-h-0 w-full overflow-y-auto overscroll-y-auto [-webkit-overflow-scrolling:touch]
        px-(--side-padding)
      "
      ref={contentRef}
      style={{
        scrollPaddingTop: contentPaddingTop,
        scrollPaddingBottom: contentPaddingBottom,
      }}>
        {/* 페이지 내부 요소들은 여기서부터 gap만 신경 쓰면 됩니다 */}
        <div
          className="flex flex-col gap-4"
          style={{ paddingTop: contentPaddingTop, paddingBottom: contentPaddingBottom }}
        >
          {children}
        </div>
      </main>

      {/* 3. 하단바 영역 */}
      {nav}
    </div>
  );
};

export default MainLayout;

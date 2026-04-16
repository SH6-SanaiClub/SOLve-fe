import React from 'react';

// 공통 상단 헤더 (Header) 컴포넌트
// 최대 너비 600px로 중앙 정렬되며 상단에 고정

// @param {React.ReactNode} left - 헤더 좌측 요소 (주로 뒤로가기 버튼, 로고 등)
// @param {string} title - 헤더 타이틀 (left 요소 바로 우측에 나란히 배치됨)
// @param {React.ReactNode} right - 헤더 우측 요소 (검색, 햄버거 메뉴, 알림 아이콘 등)
// @param {string} bgColor - 배경색 커스텀 (기본값: 'bg-white', 필요시 투명 배경 등 적용 가능)


interface HeaderProps {
    left?: React.ReactNode;
    title?: string;
    right?: React.ReactNode;
    bgColor?: string;
    className?: string;
}

const Header: React.FC<HeaderProps> = ({ left, title, right, bgColor = 'bg-white', className = '' }) => {
    return (
        <header
            className={`fixed top-0 left-1/2 -translate-x-1/2 z-50 
      w-full max-w-[600px] px-(--side-padding)
      flex items-center justify-between ${bgColor} ${className}
    `}
            style={{
                boxSizing: 'border-box',
                height: 'calc(var(--header-h) + env(safe-area-inset-top))',
                paddingTop: 'calc(env(safe-area-inset-top) + var(--header-v-pad))',
                paddingBottom: 'var(--header-v-pad)',
            }}
        >
            <div className="flex items-center gap-[8px] min-h-[32px]">
                {left && (
                    <div className="flex items-center justify-center min-w-[24px]">
                        {left}
                    </div>
                )}
                {title && (
                    /* 텍스트 색상을 토큰화된 font-main으로 변경 */
                    <h1 className="text-title font-semibold text-font-main tracking-tight-sm leading-none">
                        {title}
                    </h1>
                )}
            </div>

            <div className="flex items-center gap-[16px] text-font-main min-h-[32px]">
                {right}
            </div>
        </header>
    );
};

export default Header;

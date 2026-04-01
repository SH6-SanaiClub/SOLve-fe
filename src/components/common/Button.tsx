import React from 'react';


//  공통 버튼 (Button) 컴포넌트

//  @param {React.ReactNode} children - 버튼 내부 텍스트 또는 요소 (필수)
//  @param {'primary' | 'outline' | 'sub' | 'gray'} variant - 버튼 종류 (기본값: primary)
//  @param {'sm' | 'md' | 'lg'} size - 버튼 크기 (기본값: md)
//  @param {boolean} fullWidth - 가로 길이를 100%로 채울지 여부 (기본값: false)
//  @param {string} className - 추가 커스텀 스타일이 필요할 때 사용



interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'outline' | 'sub' | 'gray';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className = '',
    disabled,
    ...props
}) => {
    // 1. 상태별 컬러 정의 (지정하신 규격 그대로 반영)
    const variantStyles = {
        // 메인 버튼: primary-500 배경 + 화이트 폰트
        primary: 'bg-primary-500 text-white disabled:bg-gray-200 disabled:text-gray-400',
        
        // 내 적금 확인하기 등: primary-100 배경 + primary-400 폰트
        sub: 'bg-primary-100 text-primary-400 disabled:bg-gray-200 disabled:text-gray-400',
        
        // 회원가입 등: 화이트 배경 + primary-500 외곽선 & 폰트
        outline: 'bg-white border border-primary-500 text-primary-500 disabled:border-gray-200 disabled:text-gray-400',
        
        // 기타/회색 버튼
        gray: 'bg-gray-100 text-font-main disabled:bg-gray-200 disabled:text-gray-400',
    };

    // 2. 크기 및 폰트 규격 정의 (16px + Semibold 고정)
    const sizeStyles = {
        sm: 'h-[36px] px-3 text-xs font-medium',
        // 기본 사이즈 (md): 폰트 16px (text-base) + 세미볼드 (font-semibold)
        md: 'h-[48px] px-4 text-base font-semibold',
        lg: 'h-[52px] px-6 text-lg font-semibold',
    };

    return (
        <button
            className={`
        flex items-center justify-center rounded-[8px] transition-all duration-200
        active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : 'w-fit'}
        ${className}
      `}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
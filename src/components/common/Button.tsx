import React from 'react'

//  공통 버튼 (Button) 컴포넌트

//  @param {React.ReactNode} children - 버튼 내부 텍스트 또는 요소 (필수)
//  @param {'primary' | 'outline' | 'sub' | 'gray'} variant - 버튼 종류 (기본값: primary)
//  @param {'sm' | 'md' | 'lg'} size - 버튼 크기 (기본값: md)
//  @param {boolean} fullWidth - 가로 길이를 100%로 채울지 여부 (기본값: false)
//  @param {string} className - 추가 커스텀 스타일이 필요할 때 사용

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'outline' | 'sub' | 'gray'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  type = 'button',
  ...props
}) => {
  // 1. 상태별 컬러 정의 (Fallback으로 절대 색상을 함께 적용하여 항상 명확히 보이도록)
  const variantStyles = {
    // 메인 버튼: primary
    primary:
      '!bg-primary-400 !bg-[#0046FF] !text-white !border-0 disabled:!bg-gray-200 disabled:!text-gray-400',

    // 서브 버튼: subtle primary
    sub: '!bg-primary-100 !bg-[#CCDAFF] !text-primary-400 disabled:!bg-gray-200 disabled:!text-gray-400',

    // 아웃라인 버튼
    outline:
      '!bg-white !border !border-primary-400 !text-primary-400 disabled:!border-gray-200 disabled:!text-gray-400',

    // 회색 버튼
    gray: '!bg-gray-100 !text-font-main disabled:!bg-gray-200 disabled:!text-gray-400',
  }

  // 2. 크기 및 폰트 규격 정의 (16px + Semibold 고정)
  const sizeStyles = {
    sm: 'h-[36px] px-3 text-xs font-medium',
    // 기본 사이즈 (md): 폰트 16px (text-base) + 세미볼드 (font-semibold)
    md: 'h-[48px] px-4 text-base font-semibold',
    lg: 'h-[52px] px-6 text-lg font-semibold',
  }

  const buttonClassName = [
    'flex items-center justify-center rounded-control transition-all duration-200',
    'active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed',
    variantStyles[variant],
    sizeStyles[size],
    fullWidth ? 'w-full' : 'w-fit',
    className,
  ].join(' ')

  return (
    <button type={type} className={buttonClassName} {...props}>
      {children}
    </button>
  )
}

export default Button

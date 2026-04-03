import React from 'react';

/**
 * 상태, 카테고리, 포인트 표시용 배지.
 * 사용 예시:
 * <Badge tone="primary">친환경</Badge>
 * <Badge tone="success" variant="soft">+50P</Badge>
 */
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  tone?: 'primary' | 'neutral' | 'success' | 'danger';
  variant?: 'soft' | 'outline' | 'solid';
}

const Badge: React.FC<BadgeProps> = ({
  children,
  tone = 'primary',
  variant = 'soft',
  className = '',
  ...props
}) => {
  const toneStyles = {
    primary: {
      soft: 'bg-primary-50 text-primary-500',
      outline: 'border border-primary-200 bg-white text-primary-500',
      solid: 'bg-primary-500 text-white',
    },
    neutral: {
      soft: 'bg-gray-100 text-font-sub',
      outline: 'border border-gray-200 bg-white text-font-sub',
      solid: 'bg-gray-600 text-white',
    },
    success: {
      soft: 'bg-[#ECFDF5] text-[#059669]',
      outline: 'border border-[#A7F3D0] bg-white text-[#059669]',
      solid: 'bg-[#059669] text-white',
    },
    danger: {
      soft: 'bg-[#FEF2F2] text-error',
      outline: 'border border-[#FECACA] bg-white text-error',
      solid: 'bg-error text-white',
    },
  };

  return (
      <span
      className={`
        inline-flex items-center justify-center rounded-badge px-2 py-1
        text-xs font-medium leading-none
        ${toneStyles[tone][variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;

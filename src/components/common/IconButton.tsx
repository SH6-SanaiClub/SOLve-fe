import React from 'react';

/**
 * 아이콘만 보여주는 공통 버튼.
 * 사용 예시:
 * <IconButton label="메뉴 열기" icon={<Icons.Menu />} onClick={handleOpenMenu} />
 */
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  size = 'md',
  type = 'button',
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const iconButtonClassName = [
    'inline-flex items-center justify-center rounded-full bg-transparent text-font-main transition-colors',
    'hover:bg-gray-100',
    'disabled:cursor-not-allowed disabled:opacity-50',
    sizeStyles[size],
    className,
  ].join(' ');

  return (
    <button type={type} aria-label={label} title={label} className={iconButtonClassName} {...props}>
      {icon}
    </button>
  );
};

export default IconButton;

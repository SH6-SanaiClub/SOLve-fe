import React from 'react';

/**
 * 카드 전체를 눌러 선택하는 공통 옵션 박스.
 * 사용 예시:
 * <SelectableCard
 *   title="신용/체크카드"
 *   description="대표 결제 수단"
 *   selected={selected}
 *   onClick={handleSelect}
 * />
 */
interface SelectableCardProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'title'> {
  title: React.ReactNode;
  description?: React.ReactNode;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  selected?: boolean;
  selectionType?: 'radio' | 'checkbox';
}

const SelectableCard: React.FC<SelectableCardProps> = ({
  title,
  description,
  leading,
  trailing,
  selected = false,
  selectionType = 'radio',
  className = '',
  type = 'button',
  ...props
}) => {
  const indicator = selectionType === 'checkbox'
    ? (
      <span
        className={`
          flex h-5 w-5 items-center justify-center rounded-[6px] border transition-colors
          ${selected ? 'border-primary-500 bg-primary-500 text-white' : 'border-gray-300 bg-white text-transparent'}
        `}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path
            d="M9.5 3.5L4.8 8.2L2.5 5.9"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    )
    : (
      <span
        className={`
          flex h-5 w-5 items-center justify-center rounded-full border transition-colors
          ${selected ? 'border-primary-500' : 'border-gray-300'}
        `}
      >
        <span className={`h-[10px] w-[10px] rounded-full ${selected ? 'bg-primary-500' : 'bg-transparent'}`} />
      </span>
    );

  const cardClassName = [
    'flex w-full items-center gap-3 rounded-control border bg-white px-4 py-4 text-left transition-colors',
    selected ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300',
    className,
  ].join(' ');

  return (
    <button
      type={type}
      role={selectionType}
      aria-checked={selected}
      className={cardClassName}
      {...props}
    >
      {leading && <div className="shrink-0">{leading}</div>}

      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-font-main">{title}</div>
        {description && <div className="mt-1 text-xs text-font-sub">{description}</div>}
      </div>

      {trailing ? <div className="shrink-0">{trailing}</div> : indicator}
    </button>
  );
};

export default SelectableCard;

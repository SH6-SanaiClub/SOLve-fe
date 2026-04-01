import React, { useId } from 'react';

/**
 * 약관 동의, 다중 선택용 체크박스.
 * 사용 예시:
 * <Checkbox label="전체 동의" checked={checked} onChange={handleChange} />
 */
interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
  description?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  description,
  id,
  className = '',
  disabled,
  ...props
}) => {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;

  return (
    <label
      htmlFor={checkboxId}
      className={`
        flex w-full cursor-pointer items-start gap-3 rounded-control p-1
        ${disabled ? 'cursor-not-allowed opacity-50' : ''}
        ${className}
      `}
    >
      <input id={checkboxId} type="checkbox" className="peer sr-only" disabled={disabled} {...props} />
      <span
        className="
          mt-[2px] flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px]
          border border-gray-300 bg-white text-white transition-colors
          peer-checked:border-primary-500 peer-checked:bg-primary-500
        "
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

      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-sm font-medium text-font-main">{label}</span>
        {description && <span className="text-xs text-font-sub">{description}</span>}
      </span>
    </label>
  );
};

export default Checkbox;

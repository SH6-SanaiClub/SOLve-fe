import React, { useId } from 'react';

/**
 * 결제수단, 인증수단 등 단일 선택용 라디오.
 * 사용 예시:
 * <Radio name="payment" value="card" label="신용/체크카드" />
 */
interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
  description?: string;
}

const Radio: React.FC<RadioProps> = ({
  label,
  description,
  id,
  className = '',
  disabled,
  ...props
}) => {
  const generatedId = useId();
  const radioId = id ?? generatedId;

  return (
    <label
      htmlFor={radioId}
      className={`
        flex w-full cursor-pointer items-start gap-3 rounded-control p-1
        ${disabled ? 'cursor-not-allowed opacity-50' : ''}
        ${className}
      `}
    >
      <input id={radioId} type="radio" className="peer sr-only" disabled={disabled} {...props} />
      <span
        className="
          mt-[2px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full
          border border-gray-300 bg-white transition-colors
          peer-checked:border-primary-500
          peer-checked:[&>span]:bg-primary-500
        "
      >
        <span className="h-[10px] w-[10px] rounded-full bg-transparent transition-colors" />
      </span>

      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-sm font-medium text-font-main">{label}</span>
        {description && <span className="text-xs text-font-sub">{description}</span>}
      </span>
    </label>
  );
};

export default Radio;

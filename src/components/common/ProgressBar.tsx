import React from 'react';

/**
 * 진행률 표시용 막대.
 * 사용 예시:
 * <ProgressBar value={85} max={100} />
 */
interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  className = '',
  barClassName = '',
}) => {
  const safeMax = max <= 0 ? 100 : max;
  const clampedValue = Math.min(Math.max(value, 0), safeMax);
  const percentage = (clampedValue / safeMax) * 100;

  return (
    <div
      className={`h-[6px] w-full overflow-hidden rounded-full bg-gray-200 ${className}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={clampedValue}
    >
      <div
        className={`h-full rounded-full bg-primary-500 transition-[width] duration-200 ${barClassName}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default ProgressBar;

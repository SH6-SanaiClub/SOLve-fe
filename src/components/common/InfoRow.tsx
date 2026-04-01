import React from 'react';

/**
 * 라벨-값 한 줄 요약 행.
 * 사용 예시:
 * <InfoRow label="결제 금액" value="50,000원" />
 */
interface InfoRowProps {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
  valueClassName?: string;
}

const InfoRow: React.FC<InfoRowProps> = ({
  label,
  value,
  className = '',
  valueClassName = '',
}) => {
  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      <span className="text-sm text-font-sub">{label}</span>
      <span className={`text-right text-sm font-medium text-font-main ${valueClassName}`}>{value}</span>
    </div>
  );
};

export default InfoRow;

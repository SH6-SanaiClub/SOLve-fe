import React from 'react';

/**
 * 목록/섹션 제목과 우측 메타 정보용 헤더.
 * 사용 예시:
 * <SectionHeader title="진행중인 캠페인" meta="234건" />
 */
interface SectionHeaderProps {
  title: React.ReactNode;
  meta?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  meta,
  right,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      <h2 className="text-base font-semibold text-font-main">{title}</h2>
      {right ?? (meta ? <span className="text-xs font-medium text-font-sub">{meta}</span> : null)}
    </div>
  );
};

export default SectionHeader;

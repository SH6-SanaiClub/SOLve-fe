import React from 'react';
import { Button } from '../common';

/**
 * 완료/실패/신청 결과 화면용 공통 레이아웃.
 * 사용 예시:
 * <ResultState
 *   title="구매가 완료되었습니다!"
 *   description="따뜻한 마음을 나누어 주셔서 감사합니다."
 *   illustration={<img src={mascot} alt="" />}
 *   primaryActionLabel="메인으로 가기"
 *   onPrimaryAction={goHome}
 * />
 */
interface ResultStateProps {
  title: string;
  description?: string;
  illustration?: React.ReactNode;
  highlight?: React.ReactNode;
  primaryActionLabel: string;
  onPrimaryAction: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  children?: React.ReactNode;
  className?: string;
}

const ResultState: React.FC<ResultStateProps> = ({
  title,
  description,
  illustration,
  highlight,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  children,
  className = '',
}) => {
  return (
    <section className={`flex min-h-full flex-col items-center px-4 pb-6 pt-10 text-center ${className}`}>
      {illustration && <div className="mb-6">{illustration}</div>}
      <h2 className="text-xl font-bold text-font-main">{title}</h2>
      {description && <p className="mt-3 text-sm leading-6 text-font-sub">{description}</p>}
      {highlight && <div className="mt-3 text-base font-semibold text-primary-500">{highlight}</div>}

      {children && <div className="mt-8 w-full">{children}</div>}

      <div className="mt-auto flex w-full gap-3 pt-8">
        {secondaryActionLabel && onSecondaryAction && (
          <Button variant="sub" fullWidth onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </Button>
        )}
        <Button variant="primary" fullWidth onClick={onPrimaryAction}>
          {primaryActionLabel}
        </Button>
      </div>
    </section>
  );
};

export default ResultState;

import React from 'react';
import Button from './Button';

interface BottomActionBarProps {
    leftText: React.ReactNode;
    buttonLabel: string;
    onButtonClick?: () => void;
    className?: string;
}

const BottomActionBar: React.FC<BottomActionBarProps> = ({
    leftText,
    buttonLabel,
    onButtonClick,
    className = '',
}) => {
    return (
        <div
            className={`
                fixed bottom-0 left-1/2 z-40 w-full max-w-[600px] -translate-x-1/2
                bg-white px-5 pt-5 pb-[calc(20px+env(safe-area-inset-bottom))]
                ${className}
            `}
        >
            <div className="flex items-center gap-5">
                <p className="shrink-0 whitespace-nowrap text-base leading-4 text-font-sub">
                    {leftText}
                </p>

                <div className="min-w-0 flex-1">
                    <Button fullWidth onClick={onButtonClick}>
                        {buttonLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BottomActionBar;

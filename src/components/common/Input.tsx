import React, { useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;          // 인풋 위 라벨 텍스트
    requiredMark?: boolean;  // 라벨 옆 빨간 * 표시 여부
    helperText?: string;     // 인풋 아래 회색 힌트 텍스트
    errorText?: string;      // 인풋 아래 빨간 에러 텍스트 (존재 시 border가 error색으로 변함)
    isVerified?: boolean;    // 입력 완료/확인 완료 상태 (우측 초록색 체크마크 표시 여부)
}

// 공통 Input 컴포넌트
// @param {string} label - 인풋 상단에 표시될 라벨 텍스트
// @param {boolean} requiredMark - 라벨 우측에 필수 입력 표기 (빨간색 *)
// @param {string} helperText - 인풋 하단에 표시될 기본 안내 문구 (회색)
// @param {string} errorText - 에러 발생 시 하단에 표시될 문구 (입력 시 테두리가 빨간색으로 변경됨, helperText보다 우선함)
// @param {boolean} isVerified - 아이디 중복확인, 비밀번호 일치 등 완료 상태 시 우측에 체크마크 표시
// @param {string} className - 너비 조정 등 추가 커스텀이 필요할 때 사용하는 Tailwind 클래스

const Input: React.FC<InputProps> = ({
    label,
    requiredMark = false,
    helperText,
    errorText,
    isVerified = false,
    id,
    className = '',
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    ...props
}) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const feedbackId = helperText || errorText ? `${inputId}-description` : undefined;
    const describedBy = [ariaDescribedBy, feedbackId].filter(Boolean).join(' ') || undefined;
    const showVerified = isVerified && !errorText;
    const inputBorderColor = errorText
        ? 'border-error focus:border-error'
        : 'border-gray-400 focus:border-primary-500';

    return (
        <div className={`w-full flex flex-col gap-[6px]`}>
            {/* 1. 라벨 영역 */}
            {label && (
                <label htmlFor={inputId} className="text-sm font-medium text-font-main flex items-center gap-1">
                    {label}
                    {requiredMark && <span className="text-error">*</span>}
                </label>
            )}

            {/* 2. 인풋 박스 영역 */}
            <div className="relative w-full">
                <input
                    id={inputId}
                    aria-describedby={describedBy}
                    aria-invalid={ariaInvalid ?? Boolean(errorText)}
                    className={`
                      w-full h-[48px] py-[14px] pl-4 ${showVerified ? 'pr-10' : 'pr-4'}
                      bg-white border rounded-control
                      text-base font-medium text-font-main tracking-tight-sm
                      placeholder:text-font-sub
                      outline-none transition-colors
                      ${inputBorderColor}
                      ${className}
                    `}
                    {...props}
                />
                
                {/* 3. 입력/확인 완료 체크마크 (isVerified가 true일 때만 렌더링) */}
                {showVerified && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.6666 5L7.49992 14.1667L3.33325 10" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                )}
            </div>

            {/* 4. 하단 메시지 영역 (에러 텍스트 우선 표시) */}
            {errorText ? (
                <p id={feedbackId} className="text-xs text-error font-normal tracking-tight-sm">{errorText}</p>
            ) : helperText ? (
                <p id={feedbackId} className="text-xs text-font-sub font-normal tracking-tight-sm">{helperText}</p>
            ) : null}
        </div>
    );
};

export default Input;

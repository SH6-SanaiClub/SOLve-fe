import React from 'react';


// 공통 카드(Card) 컨테이너 컴포넌트
// 정보나 콘텐츠를 묶어서 보여주는 기본 흰색 박스 UI
// 그림자(shadow-sm)와 테두리, 둥근 모서리(8px) 적용

// 텍스트, 아이콘, 이미지 등을 묶어 하나의 정보 단위로 보여줄 때 (예: 텀블러 인증 리스트, 기부 캠페인 항목, 대시보드 위젯)
// 내부에 자유롭게 flex/grid 레이아웃을 짜서 내용을 채워 넣을 수 있음
//'30,000원 선택' 같은 라디오 버튼이나 단순 액션 버튼 용도로는 사용X
// 이런 폼(Form) 요소는 별도의 <SelectButton>이나 <Tag> 컴포넌트를 만들어야 상태 관리가 꼬이지 않음


// @param {React.ReactNode} children - 카드 내부에 들어갈 실제 콘텐츠 (필수)
// @param {string} title - 카드 상단에 표시될 제목 (선택 사항, 전달 시 굵은 폰트로 상단에 배치됨)
// @param {string} className - 내부 여백(p) 변경 등 추가 커스텀이 필요할 때 사용하는 Tailwind 클래스
// @param {() => void} onClick - 클릭 이벤트 핸들러 (전달 시 마우스 커서가 포인터로 변경되며, 클릭 시 살짝 눌리는 애니메이션이 자동 적용됨)



interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, title, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        w-full bg-white rounded-[8px] p-[20px] shadow-sm border border-gray-100
        flex flex-col gap-[10px]
        transition-all duration-200
        ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}
        ${className} 
      `}
    >
      {title && (
        <h3 className="text-[18px] font-bold text-font-main">{title}</h3>
      )}
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};

export default Card;
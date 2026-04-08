import { useNavigate } from 'react-router-dom';
import { PageScaffold } from '../PageScaffold'; 
import Button from '../../components/common/Button'; 
import { ROUTE_PATHS } from '../../constants/routePaths';

export function SignupCompletePage() {
  const navigate = useNavigate();

  return (
    // 배경은 이미지처럼 깔끔한 흰색으로 유지
    <div className="min-h-screen bg-white">
      <PageScaffold title="" description="">
        
        {/* 전체 컨테이너: flex-col로 배치하고 화면 높이를 꽉 채움 */}
        <div className="flex flex-col items-center px-6 pt-16 pb-10 min-h-[calc(100vh-60px)] text-center">
          
          {/* 1. 상단/중앙 영역: 캐릭터와 텍스트를 카드 형태로 감싸거나 혹은 자유 배치 */}
          <div className="flex-1 flex flex-col items-center justify-center w-full">
            
            {/* 이미지에서 본 것처럼 캐릭터 일러스트 배치 */}
            <div className="mb-10">
              <img
                src="/assets/signup-complete-illu.png" 
                alt="회원가입 완료"
                className="w-44 h-44 object-contain"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/180?text=SOLve';
                }}
              />
            </div>

            {/* 타이틀과 설명을 Card 컴포넌트로 감싸서 정돈된 느낌을 줄 수도 있습니다. 
                이미지가 완전 평면이라면 Card의 shadow를 없애거나 일반 div를 써도 좋습니다. */}
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-[26px] font-bold text-font-main tracking-tight">
                회원가입 완료!
              </h2>
              <p className="text-[16px] text-font-sub leading-relaxed">
                SOLve의 새로운 여정에 합류하신 것을 환영합니다.<br />
                당신의 가치를 증명할 준비가 되었습니다.
              </p>
            </div>
          </div>

          {/* 2. 하단 버튼 영역: mt-auto로 아래에 고정 */}
          <div className="w-full mt-auto">
            <Button
              type="button"
              variant="primary"   // 공통 컴포넌트의 !bg-[#0046FF] 적용
              fullWidth={true}    // w-full 적용
              size="lg"           // h-[52px] 적용
              onClick={() => navigate(ROUTE_PATHS.login)} // 로그인 페이지로 이동
            >
              로그인 하러가기
            </Button>
          </div>
          
        </div>
      </PageScaffold>
    </div>
  );
}
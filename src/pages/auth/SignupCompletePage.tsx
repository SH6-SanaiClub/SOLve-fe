import { useNavigate } from 'react-router-dom'
import signupImage from '../../assets/signup.png'
import { PageScaffold } from '../PageScaffold'
import Button from '../../components/common/Button'
import { ROUTE_PATHS } from '../../constants/routePaths'

export function SignupCompletePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      <PageScaffold title="" description="">
        <div className="flex min-h-[calc(100vh-60px)] flex-col items-center px-6 pb-10 pt-16 text-center">
          <div className="flex w-full flex-1 flex-col items-center justify-center">
            <div className="mb-10">
              <img
                src={signupImage}
                alt="회원가입 완료"
                className="h-44 w-44 object-contain"
              />
            </div>

            <div className="flex flex-col items-center gap-4">
              <h2 className="text-[26px] font-bold tracking-tight text-font-main">
                회원가입 완료!
              </h2>
              <p className="text-[16px] leading-relaxed text-font-sub">
                SOLve와 함께할 준비가 끝났어요.
                <br />
                로그인하고 서비스를 시작해보세요.
              </p>
            </div>
          </div>

          <div className="mt-auto w-full">
            <Button
              type="button"
              variant="primary"
              fullWidth
              size="lg"
              onClick={() => navigate(ROUTE_PATHS.login)}
            >
              로그인하러가기
            </Button>
          </div>
        </div>
      </PageScaffold>
    </div>
  )
}

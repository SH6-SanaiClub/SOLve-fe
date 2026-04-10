import { useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'
import MainLayout from '../../components/layout/MainLayout'
import { getS3AssetUrl } from '../../constants/assetUrls'
import { ROUTE_PATHS } from '../../constants/routePaths'

export function SignupCompletePage() {
  const navigate = useNavigate()
  const completeImage = getS3AssetUrl('lulu.webp')

  return (
    <MainLayout className="bg-white">
      <div className="flex min-h-[calc(100vh-48px)] flex-col px-6 pb-32 pt-6 text-center">
        <div className="flex flex-1 flex-col items-center justify-center">
          <img
            src={completeImage}
            alt="회원가입 완료"
            className="mb-3 h-44 w-44 object-contain"
          />

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

        <div className="fixed bottom-0 left-1/2 z-10 w-full max-w-[600px] -translate-x-1/2 bg-white px-6 pb-4 pt-4">
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
    </MainLayout>
  )
}

import { Navigate, useLocation, useNavigate, useSearchParams, type Location } from 'react-router-dom'
import { Button, IconButton, Icons } from '../../../components/common'
import Header from '../../../components/layout/Header'
import MainLayout from '../../../components/layout/MainLayout'
import { ROUTE_PATHS } from '../../../constants/routePaths'
import { ENV_ACTIVITY_ITEMS, getEnvActivity, type EnvActivityType } from './envActivityData'
import { EnvironmentVerifyScreen } from './components/EnvironmentVerifyScreen'

interface EnvLocationState {
  backgroundLocation?: Location
  fromEnv?: boolean
}

function isEnvActivityType(value: string | null): value is EnvActivityType {
  return ENV_ACTIVITY_ITEMS.some((activity) => activity.type === value)
}

export function EnvironmentVerifyPage() {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const routeState = location.state as EnvLocationState | undefined
  const activityTypeParam = searchParams.get('type')

  if (!isEnvActivityType(activityTypeParam)) {
    return <Navigate replace to={ROUTE_PATHS.esgEnv} />
  }

  const activity = getEnvActivity(activityTypeParam)

  const handleBack = () => {
    if (routeState?.fromEnv) {
      navigate(-1)
      return
    }

    navigate(ROUTE_PATHS.esgEnv, { replace: true })
  }

  return (
    <MainLayout
      className="bg-bg-light"
      header={
        <Header
          bgColor="bg-white"
          left={
            <IconButton
              label="뒤로가기"
              icon={<Icons.Back size={20} />}
              size="sm"
              onClick={handleBack}
            />
          }
          title={activity?.title}
          right={<div className="w-8" aria-hidden="true" />}
          className="border-b border-gray-100"
        />
      }
    >
      <EnvironmentVerifyScreen activityType={activityTypeParam} />

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50">
        <section className="pointer-events-auto mx-auto w-full max-w-[600px] border-t border-gray-100 bg-white px-(--side-padding) pt-4 pb-[calc(16px+env(safe-area-inset-bottom))] shadow-[var(--shadow-card)]">
          <Button
            type="button"
            variant="primary"
            size="md"
            fullWidth
            className="!h-[52px]"
          >
            인증 사진 제출하기
          </Button>
        </section>
      </div>
    </MainLayout>
  )
}

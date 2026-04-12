import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Button, IconButton } from '../../../components/common'
import { Icons } from '../../../components/common'
import Header from '../../../components/layout/Header'
import MainLayout from '../../../components/layout/MainLayout'
import {
  getVolunteerDetailPath,
  ROUTE_PATHS,
} from '../../../constants/routePaths'
import type { VolunteerApplicationResponse } from '../../../types/volunteer'

interface VolunteerCompleteLocationState {
  application?: VolunteerApplicationResponse
}

const formatVolunteerDate = (activityDate: string) => {
  const date = new Date(activityDate)

  if (Number.isNaN(date.getTime())) {
    return activityDate
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}.${month}.${day}`
}

export function VolunteerCompletePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { volunteerId } = useParams()
  const state = location.state as VolunteerCompleteLocationState | undefined
  const application = state?.application

  return (
    <MainLayout
      header={
        <Header
          left={
            <IconButton
              label="뒤로가기"
              icon={<Icons.Back className="text-font-main" />}
              onClick={() => navigate(ROUTE_PATHS.activitySocialVolunteer)}
            />
          }
          title="봉사"
        />
      }
      className="bg-gray-50"
    >
      <section className="mx-[-16px] min-h-[calc(100vh-var(--header-h)-48px)] bg-gray-50 px-4 pt-6 pb-8">
        {application ? (
          <div className="space-y-4">
            <section className="rounded-control bg-white px-6 py-7 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
              <div className="flex flex-col gap-2">
                <p className="text-sm leading-[120%] font-medium tracking-[-0.02em] text-gray-400">
                  봉사 신청이 완료되었습니다.
                </p>
                <h2 className="text-[20px] leading-[140%] font-bold tracking-[-0.02em] text-font-main">
                  {application.name}
                </h2>
              </div>
            </section>

            <section className="rounded-control bg-white px-6 py-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-5">
                  <p className="shrink-0 text-sm leading-[120%] font-medium tracking-[-0.02em] text-gray-400">
                    봉사명
                  </p>
                  <p className="text-right text-sm leading-6 font-normal tracking-[-0.02em] text-gray-600">
                    {application.name}
                  </p>
                </div>

                <div className="flex items-start justify-between gap-5">
                  <p className="shrink-0 text-sm leading-[120%] font-medium tracking-[-0.02em] text-gray-400">
                    봉사 장소
                  </p>
                  <p className="text-right text-sm leading-6 font-normal tracking-[-0.02em] text-gray-600">
                    {application.location}
                  </p>
                </div>

                <div className="flex items-start justify-between gap-5">
                  <p className="shrink-0 text-sm leading-[120%] font-medium tracking-[-0.02em] text-gray-400">
                    봉사 날짜
                  </p>
                  <p className="text-right text-sm leading-6 font-normal tracking-[-0.02em] text-gray-600">
                    {formatVolunteerDate(application.activityDate)}
                  </p>
                </div>
              </div>
            </section>

            <Button
              fullWidth
              onClick={() => navigate(ROUTE_PATHS.activitySocialVolunteer)}
            >
              목록으로 돌아가기
            </Button>
          </div>
        ) : (
          <section className="rounded-card border border-gray-100 bg-white px-5 py-6 text-center shadow-card">
            <h2 className="text-lg font-semibold text-font-main">
              신청 정보를 확인할 수 없어요
            </h2>
            <p className="mt-2 text-sm leading-6 text-font-sub">
              다시 상세 페이지에서 신청을 진행해주세요.
            </p>
            <Button
              className="mt-5"
              fullWidth
              onClick={() =>
                volunteerId
                  ? navigate(getVolunteerDetailPath(volunteerId))
                  : navigate(ROUTE_PATHS.activitySocialVolunteer)
              }
            >
              상세 페이지로 돌아가기
            </Button>
          </section>
        )}
      </section>
    </MainLayout>
  )
}

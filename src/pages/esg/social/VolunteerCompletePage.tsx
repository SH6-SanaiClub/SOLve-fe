import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../../components/common'
import MainLayout from '../../../components/layout/MainLayout'
import completeCharacterImage from '../../../assets/good.png'
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
    <MainLayout className="bg-gray-50">
      <section className="mx-[-16px] my-[-24px] bg-gray-50 px-[31px] pt-[88px] pb-6">
        {application ? (
          <div className="mx-auto flex max-w-[340px] flex-col items-center text-center">
            <div className="flex flex-col items-center text-center">
              <img
                src={completeCharacterImage}
                alt=""
                className="h-[104px] w-[95px] object-cover"
              />
              <div className="mt-[11px] flex w-full flex-col items-center gap-2">
                <h1 className="text-[20px] leading-[30px] font-bold tracking-[-0.02em] text-font-main">
                  신청이 완료되었습니다!
                </h1>
                <p className="text-center text-[12px] leading-6 font-medium tracking-[-0.02em] text-font-sub">
                  봉사활동에 함께해 주셔서 감사합니다.
                </p>
              </div>
            </div>

            <div className="mt-[23px] flex w-full flex-col">
              <div className="rounded-card bg-white px-[15px] pt-[19px] pb-[18px] text-left shadow-card">
                <div className="text-left text-[12px] leading-6 font-bold tracking-[-0.02em] text-font-sub">
                  신청내역 상세
                </div>

                <div className="mt-4 flex flex-col gap-[14px]">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[12px] leading-6 font-medium tracking-[-0.02em] text-font-sub">
                      봉사명
                    </span>
                    <span className="text-right text-[16px] leading-6 font-semibold tracking-[-0.02em] text-font-sub">
                      {application.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[12px] leading-6 font-medium tracking-[-0.02em] text-font-sub">
                      봉사 장소
                    </span>
                    <span className="text-right text-[16px] leading-6 font-semibold tracking-[-0.02em] text-font-sub">
                      {application.location}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[12px] leading-6 font-medium tracking-[-0.02em] text-font-sub">
                      봉사 날짜
                    </span>
                    <span className="text-right text-[16px] leading-6 font-semibold tracking-[-0.02em] text-font-sub">
                      {formatVolunteerDate(application.activityDate)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid w-full grid-cols-2 gap-3">
                <Button
                  fullWidth
                  size="md"
                  variant="sub"
                  onClick={() =>
                    navigate(ROUTE_PATHS.activitySocialVolunteerApplications)
                  }
                >
                  신청 목록으로 가기
                </Button>
                <Button
                  fullWidth
                  size="md"
                  onClick={() => navigate(ROUTE_PATHS.home, { replace: true })}
                >
                  메인으로 가기
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-full rounded-card bg-white p-6 shadow-card">
              <h2 className="text-[20px] leading-[30px] font-bold tracking-[-0.02em] text-font-main">
                신청 완료 정보를 찾을 수 없어요
              </h2>
              <p className="mt-2 text-[12px] leading-6 font-medium tracking-[-0.02em] text-font-sub">
                직접 진입한 경우일 수 있어요. 봉사 상세 페이지로 돌아가 다시 확인해주세요.
              </p>
              <div className="mt-6">
                <Button
                  fullWidth
                  onClick={() =>
                    volunteerId
                      ? navigate(getVolunteerDetailPath(volunteerId))
                      : navigate(ROUTE_PATHS.activitySocialVolunteer)
                  }
                >
                  상세 페이지로 돌아가기
                </Button>
              </div>
            </div>
            <div className="mt-6 grid w-full grid-cols-2 gap-3">
              <Button
                fullWidth
                variant="sub"
                onClick={() =>
                  navigate(ROUTE_PATHS.activitySocialVolunteerApplications)
                }
              >
                신청 목록으로 가기
              </Button>
              <Button
                fullWidth
                variant="primary"
                onClick={() => navigate(ROUTE_PATHS.home, { replace: true })}
              >
                메인으로 가기
              </Button>
            </div>
          </div>
        )}
      </section>
    </MainLayout>
  )
}

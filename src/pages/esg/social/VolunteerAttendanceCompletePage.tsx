import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../../../components/common'
import MainLayout from '../../../components/layout/MainLayout'
import completeCharacterImage from '../../../assets/good.png'
import { ROUTE_PATHS } from '../../../constants/routePaths'
import type { VolunteerCheckOutResponse } from '../../../types/volunteer'

interface VolunteerAttendanceCompleteLocationState {
  result?: VolunteerCheckOutResponse
}

const formatDateTime = (dateText: string) => {
  const date = new Date(dateText)

  if (Number.isNaN(date.getTime())) {
    return dateText
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')

  return `${year}.${month}.${day} ${hour}:${minute}`
}

const formatPoint = (amount: number) =>
  `${new Intl.NumberFormat('ko-KR').format(amount)}P`

export function VolunteerAttendanceCompletePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state =
    location.state as VolunteerAttendanceCompleteLocationState | undefined
  const result = state?.result
  const isIncomplete = result?.status === 'INCOMPLETE'

  return (
    <MainLayout className="bg-gray-50">
      <section className="mx-[-16px] my-[-24px] bg-gray-50 px-[31px] pt-[88px] pb-6">
        {result ? (
          <div className="mx-auto flex max-w-[340px] flex-col items-center text-center">
            <div className="flex flex-col items-center text-center">
              <img
                src={completeCharacterImage}
                alt=""
                className="h-[104px] w-[95px] object-cover"
              />
              <div className="mt-[11px] flex w-full flex-col items-center gap-2">
                <h1 className="text-[20px] leading-[30px] font-bold tracking-[-0.02em] text-font-main">
                  {isIncomplete
                    ? '봉사가 종료되었습니다!'
                    : '봉사가 완료되었습니다!'}
                </h1>
                <p className="text-center text-[12px] leading-6 font-medium tracking-[-0.02em] text-font-sub">
                  {isIncomplete
                    ? '활동 시간이 충족되지 않아 포인트가 지급되지 않았어요.'
                    : '봉사활동에 함께해 주셔서 감사합니다.'}
                </p>
              </div>
            </div>

            <div className="mt-[23px] flex w-full flex-col">
              <div className="rounded-card bg-white px-[15px] pt-[19px] pb-[18px] text-left shadow-card">
                <div className="text-left text-[12px] leading-6 font-bold tracking-[-0.02em] text-font-sub">
                  봉사내역 상세
                </div>

                <div className="mt-4 flex flex-col gap-[14px]">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[12px] leading-6 font-medium tracking-[-0.02em] text-font-sub">
                      봉사명
                    </span>
                    <span className="text-right text-[16px] leading-6 font-semibold tracking-[-0.02em] text-font-sub">
                      {result.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[12px] leading-6 font-medium tracking-[-0.02em] text-font-sub">
                      출석 시각
                    </span>
                    <span className="text-right text-[16px] leading-6 font-semibold tracking-[-0.02em] text-font-sub">
                      {formatDateTime(result.checkInAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[12px] leading-6 font-medium tracking-[-0.02em] text-font-sub">
                      퇴실 시각
                    </span>
                    <span className="text-right text-[16px] leading-6 font-semibold tracking-[-0.02em] text-font-sub">
                      {formatDateTime(result.checkOutAt)}
                    </span>
                  </div>

                  <div className="border-t border-gray-200" />

                  <div className="flex flex-col gap-[11px]">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[12px] leading-6 font-medium tracking-[-0.02em] text-font-sub">
                        획득 ESG 포인트
                      </span>
                      <span
                        className={`text-right text-[16px] leading-6 font-semibold tracking-[-0.02em] ${
                          result.awardedPoint > 0
                            ? 'text-primary-500'
                            : 'text-gray-400'
                        }`}
                      >
                        {result.awardedPoint > 0
                          ? `+ ${formatPoint(result.awardedPoint)}`
                          : '포인트 미지급'}
                      </span>
                    </div>

                    <p className="text-right text-[12px] leading-6 font-normal tracking-[-0.02em] text-gray-400">
                      현재 보유 포인트 {formatPoint(result.currentPoint)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 w-full">
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
                봉사 완료 정보를 찾을 수 없어요
              </h2>
              <p className="mt-2 text-[12px] leading-6 font-medium tracking-[-0.02em] text-font-sub">
                직접 진입한 경우일 수 있어요. QR 페이지에서 다시 확인해주세요.
              </p>
              <div className="mt-6">
                <Button
                  fullWidth
                  onClick={() => navigate(ROUTE_PATHS.activitySocialVolunteer)}
                >
                  봉사 목록으로 이동
                </Button>
              </div>
            </div>
            <div className="mt-6 w-full">
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

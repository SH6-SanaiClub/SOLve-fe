import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BottomActionBar, Button, IconButton } from '../../../components/common'
import { Icons } from '../../../components/common'
import Header from '../../../components/layout/Header'
import MainLayout from '../../../components/layout/MainLayout'
import {
  getVolunteerCompletePath,
  ROUTE_PATHS,
} from '../../../constants/routePaths'
import {
  applyVolunteer,
  getVolunteerDetail,
} from '../../../services/volunteerService'
import type {
  VolunteerApplicationResponse,
  VolunteerDetail,
} from '../../../types/volunteer'

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

const formatVolunteerTimeRange = (
  activityDate: string,
  volunteerHour: number,
) => {
  const startDate = new Date(activityDate)

  if (Number.isNaN(startDate.getTime())) {
    return `${volunteerHour}시간`
  }

  const endDate = new Date(startDate)
  endDate.setHours(endDate.getHours() + volunteerHour)

  const formatTime = (date: Date) =>
    `${String(date.getHours()).padStart(2, '0')}:${String(
      date.getMinutes(),
    ).padStart(2, '0')}`

  return `${formatTime(startDate)} ~ ${formatTime(endDate)}`
}

export function VolunteerDetailPage() {
  const navigate = useNavigate()
  const { volunteerId } = useParams()
  const parsedVolunteerId = Number(volunteerId)
  const [volunteerDetail, setVolunteerDetail] =
    useState<VolunteerDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [applicationError, setApplicationError] = useState('')

  const isAlreadyApplied = volunteerDetail?.status === 'APPLIED'
  const isCapacityFull = volunteerDetail
    ? volunteerDetail.currentEnrolled >= volunteerDetail.capacity
    : false
  const isApplyDisabled = isApplying || isCapacityFull || isAlreadyApplied
  const applyButtonLabel = isAlreadyApplied
    ? '신청 완료'
    : isCapacityFull
      ? '정원 마감'
      : '신청하기'

  const requestVolunteerDetail = useCallback(async () => {
    if (!Number.isInteger(parsedVolunteerId) || parsedVolunteerId <= 0) {
      setVolunteerDetail(null)
      setError('올바른 봉사활동 정보가 아니에요.')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await getVolunteerDetail(parsedVolunteerId)
      setVolunteerDetail(response)
    } catch (fetchError) {
      console.error(fetchError)
      setError(
        '봉사활동 상세 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [parsedVolunteerId])

  useEffect(() => {
    void requestVolunteerDetail()
  }, [requestVolunteerDetail])

  const handleApplyVolunteer = async () => {
    if (!Number.isInteger(parsedVolunteerId) || parsedVolunteerId <= 0) {
      return
    }

    setIsApplying(true)
    setApplicationError('')

    try {
      const response: VolunteerApplicationResponse = await applyVolunteer({
        volunteerId: parsedVolunteerId,
      })
      setIsApplyModalOpen(false)

      navigate(getVolunteerCompletePath(response.volunteerId), {
        replace: true,
        state: {
          application: response,
        },
      })
    } catch (applyError) {
      console.error(applyError)
      setApplicationError(
        '봉사 신청에 실패했어요. 잠시 후 다시 시도해주세요.',
      )
    } finally {
      setIsApplying(false)
    }
  }

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
      className="bg-gray-100"
    >
      {error ? (
        <section className="mx-[-16px] flex min-h-[calc(100vh-var(--header-h)-48px)] items-center bg-gray-100 px-4 pb-6">
          <div className="w-full rounded-card border border-red-100 bg-white px-5 py-6 text-center shadow-card">
            <h2 className="text-lg font-semibold text-font-main">
              봉사활동을 불러오지 못했어요
            </h2>
            <p className="mt-2 text-sm leading-6 text-font-sub">{error}</p>
          </div>
        </section>
      ) : (
        <section className="mx-[-16px] min-h-[calc(100vh-var(--header-h)-48px)] bg-gray-100 pt-2 pb-[120px]">
          {isLoading ? (
            <div className="space-y-2">
              <section className="bg-white px-[24px] py-6">
                <div className="space-y-3">
                  <div className="h-4 w-24 animate-pulse rounded-full bg-gray-200" />
                  <div className="h-7 w-4/5 animate-pulse rounded-full bg-gray-300" />
                </div>
              </section>

              <section className="bg-white px-[24px] py-6">
                <div className="space-y-5">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="h-4 w-16 animate-pulse rounded-full bg-gray-200" />
                      <div className="h-4 w-32 animate-pulse rounded-full bg-gray-200" />
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-white px-[24px] py-6">
                <div className="space-y-3">
                  <div className="h-5 w-full animate-pulse rounded-full bg-gray-200" />
                  <div className="h-5 w-5/6 animate-pulse rounded-full bg-gray-200" />
                  <div className="h-5 w-4/6 animate-pulse rounded-full bg-gray-200" />
                </div>
              </section>
            </div>
          ) : volunteerDetail ? (
            <div className="space-y-2">
              <section className="bg-white px-[24px] py-6">
                <div className="flex flex-col gap-2">
                  <p className="text-sm leading-[120%] font-medium tracking-[-0.02em] text-gray-400">
                    {volunteerDetail.organization}
                  </p>
                  <h2 className="text-[18px] leading-[140%] font-bold tracking-[-0.02em] text-font-main">
                    {volunteerDetail.name}
                  </h2>
                </div>
              </section>

              <section className="bg-white px-[24px] py-6">
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-5">
                    <p className="shrink-0 text-sm leading-[120%] font-medium tracking-[-0.02em] text-gray-400">
                      모집기관
                    </p>
                    <p className="text-right text-sm leading-6 font-normal tracking-[-0.02em] text-gray-600">
                      {volunteerDetail.organization}
                    </p>
                  </div>

                  <div className="flex items-start justify-between gap-5">
                    <p className="shrink-0 text-sm leading-[120%] font-medium tracking-[-0.02em] text-gray-400">
                      봉사장소
                    </p>
                    <p className="text-right text-sm leading-6 font-normal tracking-[-0.02em] text-gray-600">
                      {volunteerDetail.location}
                    </p>
                  </div>

                  <div className="flex items-start justify-between gap-5">
                    <p className="shrink-0 text-sm leading-[120%] font-medium tracking-[-0.02em] text-gray-400">
                      봉사날짜
                    </p>
                    <p className="text-right text-sm leading-6 font-normal tracking-[-0.02em] text-gray-600">
                      {formatVolunteerDate(volunteerDetail.activityDate)}
                    </p>
                  </div>

                  <div className="flex items-start justify-between gap-5">
                    <p className="shrink-0 text-sm leading-[120%] font-medium tracking-[-0.02em] text-gray-400">
                      봉사시간
                    </p>
                    <p className="text-right text-sm leading-6 font-normal tracking-[-0.02em] text-gray-600">
                      {formatVolunteerTimeRange(
                        volunteerDetail.activityDate,
                        volunteerDetail.volunteerHour,
                      )}
                    </p>
                  </div>

                  <div className="flex items-start justify-between gap-5">
                    <p className="shrink-0 text-sm leading-[120%] font-medium tracking-[-0.02em] text-gray-400">
                      모집인원
                    </p>
                    <p className="text-right text-sm leading-6 font-normal tracking-[-0.02em] text-gray-600">
                      {volunteerDetail.capacity}명
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-white px-[24px] py-6">
                <p className="whitespace-pre-line text-base leading-8 font-normal tracking-[-0.02em] text-gray-500">
                  {volunteerDetail.description}
                </p>
              </section>
            </div>
          ) : null}
        </section>
      )}

      {!error && !isLoading && volunteerDetail ? (
        <BottomActionBar
          leftText={
            <>
              <span className="text-gray-400">신청인원 </span>
              <span className="text-primary-400">
                {volunteerDetail.currentEnrolled}
              </span>
              <span className="text-gray-600">
                {' '}
                / {volunteerDetail.capacity}명
              </span>
            </>
          }
          buttonLabel={applyButtonLabel}
          buttonVariant={isApplyDisabled ? 'gray' : 'primary'}
          buttonDisabled={isApplyDisabled}
          onButtonClick={
            isApplyDisabled ? undefined : () => setIsApplyModalOpen(true)
          }
        />
      ) : null}

      {isApplyModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4"
          onClick={() => setIsApplyModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="volunteer-apply-modal-title"
            className="w-full max-w-[340px] rounded-[8px] bg-white px-5 pt-6 pb-5 shadow-[0_8px_24px_rgba(15,23,42,0.16)]"
            onClick={(event) => event.stopPropagation()}
          >
            <p
              id="volunteer-apply-modal-title"
              className="text-center text-lg font-semibold text-font-main"
            >
              신청하시겠습니까?
            </p>
            <p className="mt-2 text-center text-sm leading-6 text-gray-400">
              봉사 시작 24시간 전까지는 취소할 수 있으며,
              <br />
              노쇼 시 이용 제한 및 패널티가 발생할 수 있습니다.
            </p>

            <div className="mt-5 flex gap-3">
              <Button
                variant="gray"
                fullWidth
                className="!rounded-[8px]"
                disabled={isApplying}
                onClick={() => setIsApplyModalOpen(false)}
              >
                아니요
              </Button>
              <Button
                fullWidth
                className="!rounded-[8px]"
                disabled={isApplying}
                onClick={() => void handleApplyVolunteer()}
              >
                {isApplying ? '신청 중...' : '네'}
              </Button>
            </div>

            {applicationError ? (
              <p className="mt-3 text-center text-sm leading-6 text-red-500">
                {applicationError}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </MainLayout>
  )
}

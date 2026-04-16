import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, IconButton, Icons } from '../../../components/common'
import BottomNavigation from '../../../components/layout/BottomNavigation'
import Header from '../../../components/layout/Header'
import MainLayout from '../../../components/layout/MainLayout'
import {
  getVolunteerDetailPath,
  ROUTE_PATHS,
} from '../../../constants/routePaths'
import {
  cancelVolunteerApplication,
  getVolunteerApplications,
} from '../../../services/volunteerService'
import type {
  VolunteerApplicationItem,
  VolunteerApplicationListResponse,
} from '../../../types/volunteer'
import { VolunteerActivityCard } from './components/VolunteerActivityCard'

export function VolunteerApplicationsPage() {
  const navigate = useNavigate()
  const [volunteerData, setVolunteerData] =
    useState<VolunteerApplicationListResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionMessage, setActionMessage] = useState('')
  const [cancelError, setCancelError] = useState('')
  const [selectedApplication, setSelectedApplication] =
    useState<VolunteerApplicationItem | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)

  useEffect(() => {
    let isMounted = true

    const fetchVolunteerApplications = async () => {
      setIsLoading(true)
      setError('')

      try {
        const response = await getVolunteerApplications()
        if (!isMounted) {
          return
        }
        setVolunteerData(response)
      } catch (fetchError) {
        console.error(fetchError)
        if (!isMounted) {
          return
        }
        setError(
          '신청한 봉사활동을 불러오지 못했어요. 잠시 후 다시 시도해주세요.',
        )
      }

      if (isMounted) {
        setIsLoading(false)
      }
    }

    void fetchVolunteerApplications()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!actionMessage) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setActionMessage('')
    }, 2200)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [actionMessage])

  const handleBottomNavigation = (key: string) => {
    if (key === 'home') {
      navigate(ROUTE_PATHS.home)
      return
    }

    if (key === 'benefits') {
      navigate(ROUTE_PATHS.shop)
      return
    }

    if (key === 'finance') {
      navigate(ROUTE_PATHS.finance)
      return
    }

    if (key === 'mypage') {
      navigate(ROUTE_PATHS.my)
    }
  }

  const getCancelErrorMessage = (cancelActionError: unknown) => {
    if (axios.isAxiosError(cancelActionError)) {
      const responseMessage =
        typeof cancelActionError.response?.data?.message === 'string'
          ? cancelActionError.response.data.message.trim()
          : ''

      if (responseMessage) {
        return responseMessage
      }
    }

    return '봉사 신청 취소에 실패했어요. 잠시 후 다시 시도해주세요.'
  }

  const handleOpenCancelModal = (volunteer: VolunteerApplicationItem) => {
    setActionMessage('')
    setCancelError('')
    setSelectedApplication(volunteer)
  }

  const handleCloseCancelModal = () => {
    if (isCancelling) {
      return
    }

    setSelectedApplication(null)
  }

  const handleCancelVolunteerApplication = async () => {
    if (!selectedApplication) {
      return
    }

    setIsCancelling(true)
    setCancelError('')

    try {
      await cancelVolunteerApplication(selectedApplication.volunteerApplicationId)

      setVolunteerData((prev) => {
        if (!prev) {
          return prev
        }

        return {
          volunteers: prev.volunteers.filter(
            (volunteer) =>
              volunteer.volunteerApplicationId !==
              selectedApplication.volunteerApplicationId,
          ),
        }
      })
      setActionMessage('봉사 신청이 취소되었어요.')
      setSelectedApplication(null)
    } catch (cancelActionError) {
      console.error(cancelActionError)
      setCancelError(getCancelErrorMessage(cancelActionError))
    } finally {
      setIsCancelling(false)
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
      nav={<BottomNavigation value="home" onChange={handleBottomNavigation} />}
    >
      {isLoading ? (
        <section className="space-y-3 pt-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card
              key={index}
              className="rounded-control !p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
            >
              <div className="space-y-3">
                <div className="h-3 w-24 animate-pulse rounded-full bg-gray-200" />
                <div className="h-5 w-2/3 animate-pulse rounded-full bg-gray-300" />
                <div className="h-4 w-full animate-pulse rounded-full bg-gray-200" />
                <div className="h-4 w-4/5 animate-pulse rounded-full bg-gray-200" />
              </div>
            </Card>
          ))}
        </section>
      ) : null}

      {!isLoading && error ? (
        <section className="pt-2">
          <Card className="rounded-card border border-red-100 bg-red-50 px-5 py-6 text-center shadow-card">
            <h2 className="text-lg font-semibold text-font-main">
              봉사 신청 목록을 불러오지 못했어요
            </h2>
            <p className="mt-2 text-sm leading-6 text-font-sub">{error}</p>
          </Card>
        </section>
      ) : null}

      {!isLoading && !error && volunteerData ? (
        <section className="mx-[-16px] min-h-[calc(100vh-var(--header-h)-var(--nav-h)-48px)] bg-gray-100 px-4 pt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] leading-[120%] font-semibold tracking-[-0.02em] text-font-main">
                신청한 봉사활동
              </h2>
              <span className="text-sm leading-[120%] font-medium tracking-[-0.02em] text-primary-400">
                {volunteerData.volunteers.length}건
              </span>
            </div>

            {volunteerData.volunteers.length > 0 ? (
              <div className="space-y-4">
                {volunteerData.volunteers.map((volunteer) => (
                  <VolunteerActivityCard
                    key={volunteer.volunteerId}
                    volunteer={volunteer}
                    actionLabel="신청 취소"
                    onActionClick={() => handleOpenCancelModal(volunteer)}
                    onClick={() =>
                      navigate(getVolunteerDetailPath(volunteer.volunteerId))
                    }
                  />
                ))}
              </div>
            ) : (
              <Card className="rounded-control !p-6 text-center shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                <p className="text-sm leading-6 font-medium text-font-sub">
                  아직 신청한 봉사활동이 없습니다.
                </p>
              </Card>
            )}

            <p className="px-1 pb-6 text-sm leading-6 font-medium text-gray-400">
              봉사 시작 24시간 전까지만 취소할 수 있으며, 신청한 봉사에
              미참석하거나 활동 시간을 채우지 못할 경우 계정 이용 제한 및
              패널티가 발생할 수 있습니다.
            </p>
          </div>
        </section>
      ) : null}

      {selectedApplication ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4"
          onClick={handleCloseCancelModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="volunteer-cancel-modal-title"
            className="w-full max-w-[340px] rounded-[8px] bg-white px-5 pt-6 pb-5 shadow-[0_8px_24px_rgba(15,23,42,0.16)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="text-center">
              <h2
                id="volunteer-cancel-modal-title"
                className="text-center text-lg font-semibold text-font-main"
              >
                신청을 취소하시겠습니까?
              </h2>
              <p className="mt-2 text-center text-sm leading-6 text-gray-400">
                봉사 시작 24시간 전까지만 취소할 수 있으며,
                <br />
                이후에는 신청 취소가 제한될 수 있습니다.
              </p>
              {cancelError ? (
                <p className="mt-3 text-center text-sm leading-6 text-red-500">
                  {cancelError}
                </p>
              ) : null}
            </div>

            <div className="mt-5 flex gap-3">
              <Button
                variant="gray"
                fullWidth
                className="!rounded-[8px]"
                onClick={handleCloseCancelModal}
                disabled={isCancelling}
              >
                아니요
              </Button>
              <Button
                fullWidth
                className="!rounded-[8px]"
                onClick={() => void handleCancelVolunteerApplication()}
                disabled={isCancelling}
              >
                {isCancelling ? '취소 중...' : '네'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {actionMessage ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-[calc(var(--nav-h)+20px)] z-50 flex justify-center px-4">
          <div className="rounded-full bg-primary-400 px-4 py-2 text-sm font-medium text-white shadow-lg">
            {actionMessage}
          </div>
        </div>
      ) : null}
    </MainLayout>
  )
}

import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Badge,
  Button,
  Card,
  IconButton,
  Icons,
} from '../../../components/common'
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
  getVolunteerHistories,
} from '../../../services/volunteerService'
import type {
  VolunteerApplicationItem,
  VolunteerApplicationListResponse,
  VolunteerHistoryItem,
  VolunteerHistoryListResponse,
} from '../../../types/volunteer'
import { VolunteerActivityCard } from './components/VolunteerActivityCard'

type VolunteerManageTab = 'applications' | 'completed'
type VolunteerHistoryFilter = 'all' | 'completed' | 'partial' | 'noshow'

const formatDateGroupLabel = (activityDate: string) => {
  const date = new Date(activityDate)

  if (Number.isNaN(date.getTime())) {
    return activityDate.slice(0, 10).replace(/-/g, '.')
  }

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('.')
}

const formatDateTime = (dateText: string) => {
  const date = new Date(dateText)

  if (Number.isNaN(date.getTime())) {
    return dateText.replace('T', ' ').slice(0, 16)
  }

  const dateLabel = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('.')
  const timeLabel = [
    String(date.getHours()).padStart(2, '0'),
    String(date.getMinutes()).padStart(2, '0'),
  ].join(':')

  return `${dateLabel} ${timeLabel}`
}

const formatActivityDateTimeWithHour = (
  activityDate: string,
  scheduledVolunteerHour: number,
) => {
  const date = new Date(activityDate)

  if (Number.isNaN(date.getTime())) {
    return `${activityDate} (${scheduledVolunteerHour}시간)`
  }

  const dateLabel = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('.')
  const timeLabel = [
    String(date.getHours()).padStart(2, '0'),
    String(date.getMinutes()).padStart(2, '0'),
  ].join(':')

  return `${dateLabel} ${timeLabel} (${scheduledVolunteerHour}시간)`
}

const getVolunteerStatusBadge = (status: VolunteerHistoryItem['status']) => {
  switch (status) {
    case 'NOSHOW':
      return {
        label: '미참석',
        tone: 'danger' as const,
        description: '봉사활동에 출석하지 않은 내역입니다.',
      }
    case 'COMPLETED':
      return {
        label: '정상 출석 완료',
        tone: 'primary' as const,
        description: '출석과 퇴실이 모두 정상적으로 인정된 봉사활동입니다.',
      }
    case 'INCOMPLETE':
    case 'ATTENDED':
      return {
        label: '일부 출석 완료',
        tone: 'success' as const,
        description:
          '지각 또는 조퇴로 인해 활동 시간의 일부만 인정된 봉사활동입니다.',
      }
    default:
      return null
  }
}

export function VolunteerApplicationsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const initialTab =
    (location.state as { initialTab?: VolunteerManageTab } | null)?.initialTab ??
    'applications'
  const [activeTab, setActiveTab] = useState<VolunteerManageTab>(initialTab)
  const [historyFilter, setHistoryFilter] =
    useState<VolunteerHistoryFilter>('all')
  const [volunteerData, setVolunteerData] =
    useState<VolunteerApplicationListResponse | null>(null)
  const [volunteerHistoryData, setVolunteerHistoryData] =
    useState<VolunteerHistoryListResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionMessage, setActionMessage] = useState('')
  const [cancelError, setCancelError] = useState('')
  const [openStatusInfoId, setOpenStatusInfoId] = useState<number | null>(null)
  const [selectedApplication, setSelectedApplication] =
    useState<VolunteerApplicationItem | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)

  useEffect(() => {
    if (initialTab === 'applications' || initialTab === 'completed') {
      setActiveTab(initialTab)
    }
  }, [initialTab])

  useEffect(() => {
    let isMounted = true

    const fetchVolunteerManageData = async () => {
      setIsLoading(true)
      setError('')

      try {
        const applicationResponse = await getVolunteerApplications()
        if (!isMounted) {
          return
        }
        setVolunteerData(applicationResponse)

        try {
          const historyResponse = await getVolunteerHistories()
          if (!isMounted) {
            return
          }
          setVolunteerHistoryData(historyResponse)
        } catch (historyFetchError) {
          console.error(historyFetchError)
          if (!isMounted) {
            return
          }
          setVolunteerHistoryData({ volunteers: [] })
        }
      } catch (fetchError) {
        console.error(fetchError)
        if (!isMounted) {
          return
        }
        setError(
          '봉사 관리 내역을 불러오지 못했어요. 잠시 후 다시 시도해주세요.',
        )
      }

      if (isMounted) {
        setIsLoading(false)
      }
    }

    void fetchVolunteerManageData()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredVolunteerHistories = useMemo(() => {
    const histories = volunteerHistoryData?.volunteers ?? []

    switch (historyFilter) {
      case 'completed':
        return histories.filter((history) => history.status === 'COMPLETED')
      case 'partial':
        return histories.filter(
          (history) =>
            history.status === 'INCOMPLETE' || history.status === 'ATTENDED',
        )
      case 'noshow':
        return histories.filter((history) => history.status === 'NOSHOW')
      default:
        return histories
    }
  }, [historyFilter, volunteerHistoryData])

  const groupedVolunteerHistories = useMemo(() => {
    const sortedHistories = [...filteredVolunteerHistories].sort(
      (left, right) =>
        new Date(right.activityDate).getTime() -
        new Date(left.activityDate).getTime(),
    )
    const groups = new Map<string, VolunteerHistoryItem[]>()

    sortedHistories.forEach((history) => {
      const key = formatDateGroupLabel(history.activityDate)
      const current = groups.get(key) ?? []
      current.push(history)
      groups.set(key, current)
    })

    return Array.from(groups.entries()).map(([dateLabel, items]) => ({
      dateLabel,
      items,
    }))
  }, [filteredVolunteerHistories])

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

  useEffect(() => {
    if (openStatusInfoId === null) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setOpenStatusInfoId(null)
    }, 2200)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [openStatusInfoId])

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
      await cancelVolunteerApplication(
        selectedApplication.volunteerApplicationId,
      )

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
          title="봉사 활동 관리"
        />
      }
      nav={<BottomNavigation value="home" onChange={handleBottomNavigation} />}
      subHeader={
        <div className="flex w-full overflow-hidden border-b border-gray-200 bg-white">
          {[
            { key: 'applications', label: '신청 내역' },
            { key: 'completed', label: '완료 내역' },
          ].map((tab) => {
            const isActive = activeTab === tab.key

            return (
              <button
                type="button"
                key={tab.key}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.key as VolunteerManageTab)}
                className={`relative flex h-12 min-w-0 flex-1 items-center justify-center transition-colors ${
                  isActive ? 'text-font-main' : 'text-gray-400'
                }`}
              >
                <span className="truncate px-2 text-base font-semibold tracking-[-0.02em]">
                  {tab.label}
                </span>
                <span
                  className={`absolute inset-x-0 bottom-0 h-px transition-colors ${
                    isActive ? 'bg-primary-500' : 'bg-transparent'
                  }`}
                />
              </button>
            )
          })}
        </div>
      }
      contentSpacing="comfortable"
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
              봉사 관리 내역을 불러오지 못했어요
            </h2>
            <p className="mt-2 text-sm leading-6 text-font-sub">{error}</p>
          </Card>
        </section>
      ) : null}

      {!isLoading && !error && volunteerData && activeTab === 'applications' ? (
        <section className="mx-[-16px] min-h-[calc(100vh-var(--header-h)-var(--nav-h)-96px)] bg-gray-100 px-4 pt-3">
          <div className="space-y-3">
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

      {!isLoading && !error && activeTab === 'completed' ? (
        <section className="mx-[-16px] min-h-[calc(100vh-var(--header-h)-var(--nav-h)-96px)] bg-gray-100 px-4 pt-3">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] leading-[120%] font-semibold tracking-[-0.02em] text-font-main">
                완료한 봉사활동
              </h2>
            </div>

            <div className="flex items-center justify-between gap-3 border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {[
                  { key: 'all', label: '전체' },
                  { key: 'completed', label: '정상출석' },
                  { key: 'partial', label: '일부출석' },
                  { key: 'noshow', label: '미참석' },
                ].map((filterOption) => {
                  const isSelected = historyFilter === filterOption.key

                  return (
                    <Button
                      key={filterOption.key}
                      variant={isSelected ? 'primary' : 'sub'}
                      size="sm"
                      className={
                        isSelected
                          ? '!h-[34px] !shrink-0 !rounded-[8px] !px-4 !text-xs !font-semibold'
                          : '!h-[34px] !shrink-0 !rounded-[8px] !border !border-gray-200 !bg-white !px-4 !text-xs !font-medium !text-font-sub'
                      }
                      onClick={() =>
                        setHistoryFilter(
                          filterOption.key as VolunteerHistoryFilter,
                        )
                      }
                    >
                      {filterOption.label}
                    </Button>
                  )
                })}
              </div>

              <span className="text-sm leading-[120%] font-medium tracking-[-0.02em] text-primary-400">
                {filteredVolunteerHistories.length}건
              </span>
            </div>

            {groupedVolunteerHistories.length > 0 ? (
              <div className="space-y-4">
                {groupedVolunteerHistories.map((group) => (
                  <section
                    key={group.dateLabel}
                    className="space-y-3 border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="px-1">
                      <h3 className="text-[15px] font-semibold text-font-main">
                        {group.dateLabel}
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {group.items.map((history) => {
                        const statusBadge = getVolunteerStatusBadge(
                          history.status,
                        )

                        return (
                          <Card
                            key={history.volunteerApplicationId}
                            className="!gap-0 !overflow-hidden !rounded-control !p-0"
                          >
                            <div className="space-y-4 px-4 py-4">
                              <div className="flex items-center justify-between gap-4">
                                <div className="min-w-0 space-y-1">
                                  <p className="text-sm font-medium text-font-sub">
                                    {history.organization}
                                  </p>
                                  <h3 className="break-keep text-[16px] leading-[140%] font-semibold text-font-main">
                                    {history.name}
                                  </h3>
                                </div>

                                {statusBadge ? (
                                  <div className="relative shrink-0">
                                    <button
                                      type="button"
                                      className="block"
                                      onClick={(event) => {
                                        event.stopPropagation()
                                        setOpenStatusInfoId((prev) =>
                                          prev ===
                                          history.volunteerApplicationId
                                            ? null
                                            : history.volunteerApplicationId,
                                        )
                                      }}
                                    >
                                      <Badge
                                        tone={statusBadge.tone}
                                        variant="soft"
                                        className="px-[10px] py-[6px] text-[14px] font-medium tracking-[-0.02em]"
                                      >
                                        {statusBadge.label}
                                      </Badge>
                                    </button>

                                    {openStatusInfoId ===
                                    history.volunteerApplicationId ? (
                                      <div className="absolute top-[calc(100%+8px)] right-0 z-10 w-[220px] rounded-[10px] bg-white px-3 py-2 text-left text-xs leading-5 font-medium text-font-sub shadow-[0_8px_24px_rgba(15,23,42,0.14)]">
                                        <span className="absolute top-[-6px] right-4 h-3 w-3 rotate-45 rounded-[2px] bg-white" />
                                        <span className="relative block">
                                          {statusBadge.description}
                                        </span>
                                      </div>
                                    ) : null}
                                  </div>
                                ) : null}
                              </div>

                              <div className="space-y-3 rounded-control bg-gray-50 p-4">
                                <div className="space-y-2">
                                  <p className="text-sm font-medium text-font-sub">
                                    봉사 날짜 (시간)
                                  </p>
                                  <p className="text-[15px] leading-[160%] font-normal text-font-main">
                                    {formatActivityDateTimeWithHour(
                                      history.activityDate,
                                      history.scheduledVolunteerHour,
                                    )}
                                  </p>
                                </div>
                                <div className="space-y-2">
                                  <p className="text-sm font-medium text-font-sub">
                                    출석 시간
                                  </p>
                                  <p className="text-[15px] leading-[160%] font-normal text-font-main">
                                    {history.checkInAt
                                      ? formatDateTime(history.checkInAt)
                                      : '-'}
                                  </p>
                                </div>
                                <div className="space-y-2">
                                  <p className="text-sm font-medium text-font-sub">
                                    퇴실 시간
                                  </p>
                                  <p className="text-[15px] leading-[160%] font-normal text-font-main">
                                    {history.checkOutAt
                                      ? formatDateTime(history.checkOutAt)
                                      : '-'}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-gray-100 px-4 py-4">
                              <p className="text-[16px] leading-[120%] font-semibold tracking-[-0.02em] text-font-main">
                                인정 봉사시간
                              </p>
                              <span className="text-[18px] leading-[120%] font-bold tracking-[-0.02em] text-font-main">
                                {history.recognizedVolunteerHour} 시간
                              </span>
                            </div>
                          </Card>
                        )
                      })}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <Card className="rounded-control !p-6 text-center shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                <p className="text-sm leading-6 font-medium text-font-sub">
                  완료한 봉사활동이 아직 없습니다.
                </p>
              </Card>
            )}
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

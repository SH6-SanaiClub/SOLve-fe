import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, IconButton } from '../../../components/common'
import { Icons } from '../../../components/common'
import Header from '../../../components/layout/Header'
import MainLayout from '../../../components/layout/MainLayout'
import { ROUTE_PATHS } from '../../../constants/routePaths'
import {
  checkInVolunteerAttendance,
  getVolunteerAttendanceInfo,
} from '../../../services/volunteerService'
import type { VolunteerAttendanceInfo } from '../../../types/volunteer'

const formatVolunteerDateTime = (dateText: string) => {
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

const formatVolunteerHours = (hours: number) => `${hours}시간`

const formatAttendanceTime = (dateText: string | null, suffix: string) => {
  if (!dateText) {
    return suffix
  }

  const date = new Date(dateText)

  if (Number.isNaN(date.getTime())) {
    return suffix
  }

  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')

  return `${hour}:${minute} ${suffix}`
}

const isGeolocationError = (
  error: unknown,
): error is GeolocationPositionError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'number'
  )
}

const getStatusText = (status: VolunteerAttendanceInfo['status']) => {
  switch (status) {
    case 'ATTENDED':
      return '이미 출석한 봉사활동이에요.'
    case 'COMPLETED':
      return '봉사활동이 완료된 상태예요.'
    case 'APPLIED':
    default:
      return '출석 전 상태예요.'
  }
}

export function VolunteerAttendancePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  )
  const token = searchParams.get('token')?.trim() ?? ''

  const [attendanceInfo, setAttendanceInfo] =
    useState<VolunteerAttendanceInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isCheckingIn, setIsCheckingIn] = useState(false)
  const [actionError, setActionError] = useState('')

  const requestAttendanceInfo = useCallback(async () => {
    if (!token) {
      setError('유효한 QR 정보가 없어요.')
      setAttendanceInfo(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError('')
    setActionError('')

    try {
      const response = await getVolunteerAttendanceInfo(token)
      setAttendanceInfo(response)
    } catch (fetchError) {
      console.error(fetchError)
      setAttendanceInfo(null)
      setError('봉사 출석 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    void requestAttendanceInfo()
  }, [requestAttendanceInfo])

  const attendanceButtonLabel = useMemo(() => {
    if (!attendanceInfo) {
      return '출석하기'
    }

    if (attendanceInfo.status === 'ATTENDED') {
      return formatAttendanceTime(attendanceInfo.checkInAt, '출석')
    }

    if (attendanceInfo.status === 'COMPLETED') {
      return formatAttendanceTime(
        attendanceInfo.checkOutAt ?? attendanceInfo.checkInAt,
        '퇴실',
      )
    }

    return '출석하기'
  }, [attendanceInfo])

  const isAttendanceButtonDisabled =
    isCheckingIn ||
    attendanceInfo?.status === 'ATTENDED' ||
    attendanceInfo?.status === 'COMPLETED'

  const getCurrentPosition = () =>
    new Promise<GeolocationPosition>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('이 기기에서는 위치 정보를 사용할 수 없어요.'))
        return
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      })
    })

  const handleCheckIn = async () => {
    if (!attendanceInfo || attendanceInfo.status !== 'APPLIED' || !token) {
      return
    }

    setIsCheckingIn(true)
    setActionError('')

    try {
      const position = await getCurrentPosition()
      const response = await checkInVolunteerAttendance({
        qrToken: token,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      })

      setAttendanceInfo((prev) =>
        prev
          ? {
              ...prev,
              status: response.status,
              checkInAt: response.checkInAt,
            }
          : prev,
      )
    } catch (checkInError) {
      console.error(checkInError)

      if (isGeolocationError(checkInError)) {
        if (checkInError.code === checkInError.PERMISSION_DENIED) {
          setActionError('위치 권한이 필요해요. 브라우저에서 위치 접근을 허용해주세요.')
          return
        }

        if (checkInError.code === checkInError.TIMEOUT) {
          setActionError('현재 위치를 가져오지 못했어요. 잠시 후 다시 시도해주세요.')
          return
        }
      }

      if (checkInError instanceof Error) {
        setActionError(checkInError.message || '출석 처리에 실패했어요. 잠시 후 다시 시도해주세요.')
      } else {
        setActionError('출석 처리에 실패했어요. 잠시 후 다시 시도해주세요.')
      }
    } finally {
      setIsCheckingIn(false)
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
          title="봉사 출석"
        />
      }
      className="bg-gray-100"
    >
      <section className="mx-[-16px] min-h-[calc(100vh-var(--header-h)-48px)] bg-gray-100 pt-2 pb-8">
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
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="h-4 w-20 animate-pulse rounded-full bg-gray-200" />
                    <div className="h-4 w-32 animate-pulse rounded-full bg-gray-200" />
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : error ? (
          <section className="px-4">
            <div className="rounded-card border border-red-100 bg-white px-5 py-6 text-center shadow-card">
              <h2 className="text-lg font-semibold text-font-main">
                QR 정보를 확인할 수 없어요
              </h2>
              <p className="mt-2 text-sm leading-6 text-font-sub">{error}</p>
            </div>
          </section>
        ) : attendanceInfo ? (
          <div className="space-y-2">
            <section className="bg-white px-[24px] py-6">
              <div className="flex flex-col gap-2">
                <p className="text-sm leading-[120%] font-medium tracking-[-0.02em] text-gray-400">
                  {attendanceInfo.organization}
                </p>
                <h2 className="text-[18px] leading-[140%] font-bold tracking-[-0.02em] text-font-main">
                  {attendanceInfo.name}
                </h2>
                <p className="text-sm leading-6 font-medium tracking-[-0.02em] text-primary-400">
                  {getStatusText(attendanceInfo.status)}
                </p>
              </div>
            </section>

            <section className="bg-white px-[24px] py-6">
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-5">
                  <p className="shrink-0 text-sm leading-[120%] font-medium tracking-[-0.02em] text-gray-400">
                    봉사명
                  </p>
                  <p className="text-right text-sm leading-6 font-normal tracking-[-0.02em] text-gray-600">
                    {attendanceInfo.name}
                  </p>
                </div>

                <div className="flex items-start justify-between gap-5">
                  <p className="shrink-0 text-sm leading-[120%] font-medium tracking-[-0.02em] text-gray-400">
                    장소
                  </p>
                  <p className="text-right text-sm leading-6 font-normal tracking-[-0.02em] text-gray-600">
                    {attendanceInfo.location}
                  </p>
                </div>

                <div className="flex items-start justify-between gap-5">
                  <p className="shrink-0 text-sm leading-[120%] font-medium tracking-[-0.02em] text-gray-400">
                    활동 일시
                  </p>
                  <p className="text-right text-sm leading-6 font-normal tracking-[-0.02em] text-gray-600">
                    {formatVolunteerDateTime(attendanceInfo.activityDate)}
                  </p>
                </div>

                <div className="flex items-start justify-between gap-5">
                  <p className="shrink-0 text-sm leading-[120%] font-medium tracking-[-0.02em] text-gray-400">
                    봉사 시간
                  </p>
                  <p className="text-right text-sm leading-6 font-normal tracking-[-0.02em] text-gray-600">
                    {formatVolunteerHours(attendanceInfo.volunteerHour)}
                  </p>
                </div>

                <div className="flex items-start justify-between gap-5">
                  <p className="shrink-0 text-sm leading-[120%] font-medium tracking-[-0.02em] text-gray-400">
                    단체명
                  </p>
                  <p className="text-right text-sm leading-6 font-normal tracking-[-0.02em] text-gray-600">
                    {attendanceInfo.organization}
                  </p>
                </div>
              </div>
            </section>

            <div className="px-4 pt-2">
              <Button
                fullWidth
                variant={isAttendanceButtonDisabled ? 'gray' : 'primary'}
                disabled={isAttendanceButtonDisabled}
                onClick={isAttendanceButtonDisabled ? undefined : () => void handleCheckIn()}
              >
                {isCheckingIn ? '출석 처리 중...' : attendanceButtonLabel}
              </Button>
              {actionError ? (
                <p className="mt-2 text-center text-sm leading-6 text-red-500">
                  {actionError}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </section>
    </MainLayout>
  )
}

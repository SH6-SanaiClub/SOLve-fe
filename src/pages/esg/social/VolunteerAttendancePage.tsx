import { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../../../components/common'
import MainLayout from '../../../components/layout/MainLayout'
import logoImage from '../../../assets/home/logo.png'
import { ROUTE_PATHS } from '../../../constants/routePaths'
import {
  checkInVolunteerAttendance,
  checkOutVolunteerAttendance,
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

const extractApiErrorMessage = (error: unknown) => {
  if (!axios.isAxiosError(error)) {
    return ''
  }

  const data = error.response?.data

  if (typeof data === 'string') {
    return data
  }

  if (
    typeof data === 'object' &&
    data !== null &&
    'message' in data &&
    typeof data.message === 'string'
  ) {
    return data.message
  }

  if (
    typeof data === 'object' &&
    data !== null &&
    'error' in data &&
    typeof data.error === 'string'
  ) {
    return data.error
  }

  return ''
}

const getAttendanceActionErrorMessage = (
  error: unknown,
  action: '출석' | '퇴실',
) => {
  const backendMessage = extractApiErrorMessage(error).toLowerCase()

  if (
    backendMessage.includes('location') ||
    backendMessage.includes('distance') ||
    backendMessage.includes('radius') ||
    backendMessage.includes('좌표') ||
    backendMessage.includes('위치') ||
    backendMessage.includes('거리') ||
    backendMessage.includes('반경')
  ) {
    return `현재 위치에서는 ${action}할 수 없어요.\n봉사 장소 근처에서 다시 시도해주세요.`
  }

  if (
    backendMessage.includes('time') ||
    backendMessage.includes('date') ||
    backendMessage.includes('hour') ||
    backendMessage.includes('시간') ||
    backendMessage.includes('일시') ||
    backendMessage.includes('시작') ||
    backendMessage.includes('종료')
  ) {
    return `현재는 ${action} 가능한 시간이 아니에요. 봉사 시간을 다시 확인해주세요.`
  }

  if (
    backendMessage.includes('token') ||
    backendMessage.includes('qr') ||
    backendMessage.includes('토큰')
  ) {
    return '유효하지 않은 QR 정보예요. QR 코드를 다시 확인해주세요.'
  }

  if (
    backendMessage.includes('status') ||
    backendMessage.includes('already') ||
    backendMessage.includes('attendance') ||
    backendMessage.includes('check-in') ||
    backendMessage.includes('check-out') ||
    backendMessage.includes('출석') ||
    backendMessage.includes('퇴실')
  ) {
    return `현재 상태에서는 ${action}할 수 없어요. 상태를 다시 확인해주세요.`
  }

  if (axios.isAxiosError(error)) {
    const status = error.response?.status

    if (status === 400) {
      return `${action} 요청을 처리할 수 없어요. 입력 정보와 현재 상태를 다시 확인해주세요.`
    }

    if (status === 403) {
      return `${action} 권한이 없어요. 관리자에게 문의해주세요.`
    }

    if (status === 404) {
      return '봉사 정보를 찾을 수 없어요. QR 코드를 다시 확인해주세요.'
    }
  }

  return `${action} 처리에 실패했어요. 잠시 후 다시 시도해주세요.`
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
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false)
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

  const hasCheckedIn = Boolean(attendanceInfo?.checkInAt)
  const hasCheckedOut = Boolean(attendanceInfo?.checkOutAt)

  const attendanceButtonLabel = useMemo(() => {
    if (!attendanceInfo) {
      return '출석하기'
    }

    if (hasCheckedOut) {
      return formatAttendanceTime(
        attendanceInfo.checkOutAt ?? attendanceInfo.checkInAt,
        '퇴실',
      )
    }

    if (hasCheckedIn) {
      return formatAttendanceTime(attendanceInfo.checkInAt, '출석')
    }

    return '출석하기'
  }, [attendanceInfo, hasCheckedIn, hasCheckedOut])

  const isAttendanceButtonDisabled =
    isCheckingIn || hasCheckedIn || hasCheckedOut
  const isCheckOutButtonVisible = hasCheckedIn && !hasCheckedOut

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
              status: 'ATTENDED',
              checkInAt: response.checkInAt,
            }
          : prev,
      )

      const refreshedAttendanceInfo = await getVolunteerAttendanceInfo(token)
      setAttendanceInfo((prev) => ({
        ...refreshedAttendanceInfo,
        status:
          refreshedAttendanceInfo.checkOutAt
            ? 'COMPLETED'
            : refreshedAttendanceInfo.checkInAt
              ? 'ATTENDED'
              : refreshedAttendanceInfo.status,
        checkInAt:
          refreshedAttendanceInfo.checkInAt ??
          prev?.checkInAt ??
          response.checkInAt,
      }))
    } catch (checkInError) {
      console.error(checkInError)

      if (isGeolocationError(checkInError)) {
        if (checkInError.code === checkInError.PERMISSION_DENIED) {
          setActionError(
            '위치 권한이 필요해요. 브라우저에서 위치 접근을 허용해주세요.',
          )
          return
        }

        if (checkInError.code === checkInError.TIMEOUT) {
          setActionError(
            '현재 위치를 가져오지 못했어요. 잠시 후 다시 시도해주세요.',
          )
          return
        }
      }

      if (checkInError instanceof Error) {
        setActionError(getAttendanceActionErrorMessage(checkInError, '출석'))
      } else {
        setActionError(getAttendanceActionErrorMessage(checkInError, '출석'))
      }
    } finally {
      setIsCheckingIn(false)
    }
  }

  const handleCheckOut = async () => {
    if (!attendanceInfo || attendanceInfo.status !== 'ATTENDED' || !token) {
      return
    }

    setIsCheckingOut(true)
    setActionError('')

    try {
      const position = await getCurrentPosition()
      const response = await checkOutVolunteerAttendance({
        qrToken: token,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      })

      navigate(ROUTE_PATHS.activitySocialVolunteerAttendanceComplete, {
        replace: true,
        state: {
          result: response,
        },
      })
      setIsCheckOutModalOpen(false)
    } catch (checkOutError) {
      console.error(checkOutError)

      if (isGeolocationError(checkOutError)) {
        if (checkOutError.code === checkOutError.PERMISSION_DENIED) {
          setActionError(
            '위치 권한이 필요해요. 브라우저에서 위치 접근을 허용해주세요.',
          )
          return
        }

        if (checkOutError.code === checkOutError.TIMEOUT) {
          setActionError(
            '현재 위치를 가져오지 못했어요. 잠시 후 다시 시도해주세요.',
          )
          return
        }
      }

      if (checkOutError instanceof Error) {
        setActionError(getAttendanceActionErrorMessage(checkOutError, '퇴실'))
      } else {
        setActionError(getAttendanceActionErrorMessage(checkOutError, '퇴실'))
      }
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <MainLayout className="bg-white">
      <section className="mx-[-16px] min-h-[calc(100vh-48px)] bg-white px-6 pt-8 pb-8">
        {isLoading ? (
          <div className="mx-auto max-w-[360px] space-y-8">
            <div className="flex justify-center">
              <div className="h-12 w-32 animate-pulse rounded-full bg-gray-200" />
            </div>
            <div className="space-y-5">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="h-4 w-20 animate-pulse rounded-full bg-gray-200" />
                  <div className="h-4 w-40 animate-pulse rounded-full bg-gray-200" />
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <section className="mx-auto max-w-[360px]">
            <div className="rounded-card border border-red-100 bg-white px-5 py-6 text-center shadow-card">
              <h2 className="text-lg font-semibold text-font-main">
                QR 정보를 확인할 수 없어요
              </h2>
              <p className="mt-2 text-sm leading-6 text-font-sub">{error}</p>
            </div>
          </section>
        ) : attendanceInfo ? (
          <div className="mx-auto max-w-[360px]">
            <div className="flex justify-center pt-2">
              <img
                src={logoImage}
                alt="SOLve 로고"
                className="h-12 w-auto object-contain"
              />
            </div>

            <div className="mt-8">
              <h2 className="text-lg leading-[120%] font-semibold text-gray-700">
                봉사 출석관리
              </h2>
              <div className="mt-4 border-t border-gray-200" />
            </div>

            <div className="mt-8 space-y-5">
              <div className="flex items-start justify-between gap-5">
                <p className="shrink-0 text-base leading-7 font-medium tracking-[-0.02em] text-gray-400">
                  봉사자명
                </p>
                <p className="text-right text-base leading-7 font-medium tracking-[-0.02em] text-gray-700">
                  {attendanceInfo.userName}
                </p>
              </div>

              <div className="flex items-start justify-between gap-5">
                <p className="shrink-0 text-base leading-7 font-medium tracking-[-0.02em] text-gray-400">
                  봉사명
                </p>
                <p className="text-right text-base leading-7 font-medium tracking-[-0.02em] text-gray-700">
                  {attendanceInfo.name}
                </p>
              </div>

              <div className="flex items-start justify-between gap-5">
                <p className="shrink-0 text-base leading-7 font-medium tracking-[-0.02em] text-gray-400">
                  장소
                </p>
                <p className="text-right text-base leading-7 font-medium tracking-[-0.02em] text-gray-700">
                  {attendanceInfo.location}
                </p>
              </div>

              <div className="flex items-start justify-between gap-5">
                <p className="shrink-0 text-base leading-7 font-medium tracking-[-0.02em] text-gray-400">
                  활동 일시
                </p>
                <p className="text-right text-base leading-7 font-medium tracking-[-0.02em] text-gray-700">
                  {formatVolunteerDateTime(attendanceInfo.activityDate)}
                </p>
              </div>

              <div className="flex items-start justify-between gap-5">
                <p className="shrink-0 text-base leading-7 font-medium tracking-[-0.02em] text-gray-400">
                  봉사 시간
                </p>
                <p className="text-right text-base leading-7 font-medium tracking-[-0.02em] text-gray-700">
                  {formatVolunteerHours(attendanceInfo.volunteerHour)}
                </p>
              </div>

              <div className="flex items-start justify-between gap-5">
                <p className="shrink-0 text-base leading-7 font-medium tracking-[-0.02em] text-gray-400">
                  단체명
                </p>
                <p className="text-right text-base leading-7 font-medium tracking-[-0.02em] text-gray-700">
                  {attendanceInfo.organization}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <Button
                fullWidth
                variant={isAttendanceButtonDisabled ? 'gray' : 'primary'}
                disabled={isAttendanceButtonDisabled}
                onClick={
                  isAttendanceButtonDisabled
                    ? undefined
                    : () => void handleCheckIn()
                }
              >
                {isCheckingIn ? '출석 처리 중...' : attendanceButtonLabel}
              </Button>
              {isCheckOutButtonVisible ? (
                <Button
                  fullWidth
                  className="mt-3"
                  disabled={isCheckingOut}
                  onClick={() => setIsCheckOutModalOpen(true)}
                >
                  {isCheckingOut ? '퇴실 처리 중...' : '퇴실하기'}
                </Button>
              ) : null}
              {actionError ? (
                <p className="mt-2 whitespace-pre-line text-center text-sm leading-6 text-red-500">
                  {actionError}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </section>

      {isCheckOutModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4"
          onClick={() => setIsCheckOutModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="volunteer-checkout-modal-title"
            className="w-full max-w-[340px] rounded-[8px] bg-white px-5 pt-6 pb-5 shadow-[0_8px_24px_rgba(15,23,42,0.16)]"
            onClick={(event) => event.stopPropagation()}
          >
            <p
              id="volunteer-checkout-modal-title"
              className="text-center text-lg font-semibold text-font-main"
            >
              정말 퇴실하시겠습니까?
            </p>
            <p className="mt-2 text-center text-sm leading-6 text-gray-400">
              봉사 종료 시간 이전에 종료할 시 정상 참여로 인정되지 않을 수
              있으니, 시간을 꼭 확인해주세요.
            </p>

            <div className="mt-5 flex gap-3">
              <Button
                variant="gray"
                fullWidth
                className="!rounded-[8px]"
                disabled={isCheckingOut}
                onClick={() => setIsCheckOutModalOpen(false)}
              >
                아니요
              </Button>
              <Button
                fullWidth
                className="!rounded-[8px]"
                disabled={isCheckingOut}
                onClick={() => void handleCheckOut()}
              >
                {isCheckingOut ? '퇴실 처리 중...' : '네'}
              </Button>
            </div>

            {actionError ? (
              <p className="mt-3 whitespace-pre-line text-center text-sm leading-6 text-red-500">
                {actionError}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </MainLayout>
  )
}

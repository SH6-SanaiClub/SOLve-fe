import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNavigation from '../../../components/layout/BottomNavigation'
import { Card, IconButton } from '../../../components/common'
import { Icons } from '../../../components/common'
import Header from '../../../components/layout/Header'
import MainLayout from '../../../components/layout/MainLayout'
import {
  getVolunteerDetailPath,
  ROUTE_PATHS,
} from '../../../constants/routePaths'
import { getVolunteerActivities } from '../../../services/volunteerService'
import type { VolunteerActivity, VolunteerListResponse } from '../../../types/volunteer'
import { SocialActivityTabs } from './components/SocialActivityTabs'

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

  return `${formatTime(startDate)} - ${formatTime(endDate)}`
}

const formatVolunteerLocation = (location: string) =>
  location
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .join(' ')

const getVolunteerMetaLabel = (volunteer: VolunteerActivity) =>
  `${volunteer.organization} | ${formatVolunteerLocation(volunteer.location)}`

export function VolunteerPage() {
  const navigate = useNavigate()
  const [volunteerData, setVolunteerData] =
    useState<VolunteerListResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const fetchVolunteerActivities = async () => {
      setIsLoading(true)
      setError('')

      try {
        const response = await getVolunteerActivities()
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
          '봉사활동 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.',
        )
      }

      if (isMounted) {
        setIsLoading(false)
      }
    }

    void fetchVolunteerActivities()

    return () => {
      isMounted = false
    }
  }, [])

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

  return (
    <MainLayout
      header={
        <Header
          left={
            <IconButton
              label="뒤로가기"
              icon={<Icons.Back className="text-font-main" />}
              onClick={() => navigate(ROUTE_PATHS.home)}
            />
          }
          title="S 활동"
        />
      }
      nav={<BottomNavigation value="home" onChange={handleBottomNavigation} />}
    >
      <SocialActivityTabs activeTab="volunteer" />

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
              봉사활동을 불러오지 못했어요
            </h2>
            <p className="mt-2 text-sm leading-6 text-font-sub">{error}</p>
          </Card>
        </section>
      ) : null}

      {!isLoading && !error && volunteerData ? (
        <section className="mx-[-16px] min-h-[calc(100vh-var(--header-h)-var(--nav-h)-96px)] bg-gray-100 px-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] leading-[120%] font-semibold tracking-[-0.02em] text-font-main">
                모집중인 봉사활동
              </h2>
              <span className="text-sm leading-[120%] font-medium tracking-[-0.02em] text-primary-400">
                {volunteerData.volunteers.length}건
              </span>
            </div>

            <div className="space-y-4">
              {volunteerData.volunteers.map((volunteer) => (
                <Card
                  key={volunteer.volunteerId}
                  data-volunteer-id={volunteer.volunteerId}
                  className="rounded-control !p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
                  onClick={() =>
                    navigate(getVolunteerDetailPath(volunteer.volunteerId))
                  }
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm leading-[120%] font-medium tracking-[-0.02em] text-font-sub">
                        {getVolunteerMetaLabel(volunteer)}
                      </p>
                      <h3 className="text-[18px] leading-[120%] font-bold tracking-[-0.02em] text-font-main">
                        {volunteer.name}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <div className="flex items-center gap-1">
                        <span className="text-xs leading-[120%] font-medium tracking-[-0.02em] text-primary-400">
                          봉사날짜
                        </span>
                        <span className="text-xs leading-[120%] font-normal tracking-[-0.02em] text-font-sub">
                          {formatVolunteerDate(volunteer.activityDate)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-xs leading-[120%] font-medium tracking-[-0.02em] text-primary-400">
                          봉사시간
                        </span>
                        <span className="text-xs leading-[120%] font-normal tracking-[-0.02em] text-font-sub">
                          {formatVolunteerTimeRange(
                            volunteer.activityDate,
                            volunteer.volunteerHour,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </MainLayout>
  )
}

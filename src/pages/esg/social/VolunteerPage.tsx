import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNavigation from '../../../components/layout/BottomNavigation'
import { Card, IconButton } from '../../../components/common'
import { Icons } from '../../../components/common'
import { PageMotionStyles, buildPageEnterStyle } from '../../../components/common/PageMotion'
import Header from '../../../components/layout/Header'
import MainLayout from '../../../components/layout/MainLayout'
import {
  getVolunteerDetailPath,
  ROUTE_PATHS,
} from '../../../constants/routePaths'
import useReturnNavigation from '../../../hooks/useReturnNavigation'
import { getVolunteerActivities } from '../../../services/volunteerService'
import type { VolunteerListResponse } from '../../../types/volunteer'
import { VolunteerActivityCard } from './components/VolunteerActivityCard'
import { SocialActivityTabs } from './components/SocialActivityTabs'

export function VolunteerPage() {
  const navigate = useNavigate()
  const { goBack } = useReturnNavigation(ROUTE_PATHS.home)
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
              onClick={goBack}
            />
          }
          title="S 활동"
        />
      }
      nav={<BottomNavigation value="home" onChange={handleBottomNavigation} />}
      subHeader={<SocialActivityTabs activeTab="volunteer" />}
      contentSpacing="comfortable"
    >
      <PageMotionStyles />
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
        <section
          className="mx-[-16px] min-h-[calc(100vh-var(--header-h)-var(--nav-h)-96px)] bg-gray-100 px-4 pt-3"
          style={buildPageEnterStyle(50, 460)}
        >
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
              {volunteerData.volunteers.map((volunteer, index) => (
                <div
                  key={volunteer.volunteerId}
                  style={buildPageEnterStyle(100 + index * 50, 420)}
                >
                  <VolunteerActivityCard
                    volunteer={volunteer}
                    showImage
                    onClick={() =>
                      navigate(getVolunteerDetailPath(volunteer.volunteerId))
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </MainLayout>
  )
}

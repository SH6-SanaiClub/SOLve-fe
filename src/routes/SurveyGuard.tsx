import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROUTE_PATHS } from '../constants/routePaths'
import { useAuth } from '../hooks/useAuth'
import { getSurveyStatus } from '../services/surveyService'

export function SurveyGuard() {
  const { user, isAuthenticated, updateUser } = useAuth()
  const location = useLocation()
  const [fetchedSurveyCompleted, setFetchedSurveyCompleted] = useState<boolean | null>(null)
  const surveyCompletedFromUser =
    typeof user?.isSurveyCompleted === 'boolean' ? user.isSurveyCompleted : null
  const surveyCompleted = surveyCompletedFromUser ?? fetchedSurveyCompleted

  useEffect(() => {
    if (!isAuthenticated || surveyCompletedFromUser !== null) {
      return
    }

    let isMounted = true

    const fetchSurveyStatus = async () => {
      try {
        const status = await getSurveyStatus()

        if (!isMounted) {
          return
        }

        setFetchedSurveyCompleted(status.surveyCompleted)

        if (user) {
          updateUser({
            ...user,
            isSurveyCompleted: status.surveyCompleted,
            userType: status.userType,
          })
        }
      } catch (error) {
        console.error(error)

        if (!isMounted) {
          return
        }

        setFetchedSurveyCompleted(true)
      }
    }

    void fetchSurveyStatus()

    return () => {
      isMounted = false
    }
  }, [isAuthenticated, surveyCompletedFromUser, updateUser, user])

  if (
    isAuthenticated &&
    location.pathname !== ROUTE_PATHS.survey &&
    surveyCompleted === false
  ) {
    return <Navigate replace to={ROUTE_PATHS.survey} />
  }

  return <Outlet />
}

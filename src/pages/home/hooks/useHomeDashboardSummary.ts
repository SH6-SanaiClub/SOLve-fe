import { useEffect, useState } from 'react'
import { getHomeDashboardSummary } from '../../../services/homeService'
import type { HomeDashboardSummary } from '../../../types/home'

export const useHomeDashboardSummary = () => {
  const [summary, setSummary] = useState<HomeDashboardSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchSummary = async () => {
      setIsLoading(true)

      try {
        const response = await getHomeDashboardSummary()
        if (!isMounted) {
          return
        }
        setSummary(response)
      } catch (error) {
        console.error(error)
        if (!isMounted) {
          return
        }
        setSummary(null)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void fetchSummary()

    return () => {
      isMounted = false
    }
  }, [])

  return {
    summary,
    isLoading,
  }
}

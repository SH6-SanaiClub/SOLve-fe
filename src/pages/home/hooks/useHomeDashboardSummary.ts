import { useCallback, useEffect, useRef, useState } from 'react'
import { getHomeDashboardSummary } from '../../../services/homeService'
import type { HomeDashboardSummary } from '../../../types/home'

export const useHomeDashboardSummary = () => {
  const [summary, setSummary] = useState<HomeDashboardSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
    }
  }, [])

  const refreshSummary = useCallback(async () => {
    setIsLoading(true)

    try {
      const response = await getHomeDashboardSummary()

      if (!isMountedRef.current) {
        return
      }

      setSummary(response)
    } catch (error) {
      console.error(error)

      if (!isMountedRef.current) {
        return
      }

      setSummary(null)
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    void refreshSummary()
  }, [refreshSummary])

  return {
    summary,
    isLoading,
    refreshSummary,
  }
}

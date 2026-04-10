import { useEffect, useState } from 'react'
import { getPointShopSummary } from '../../../services/pointShopService'

export const usePointShopSummary = () => {
  const [totalPoints, setTotalPoints] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchSummary = async () => {
      setIsLoading(true)

      try {
        const response = await getPointShopSummary()
        if (!isMounted) {
          return
        }
        setTotalPoints(response.totalPoints)
      } catch (error) {
        console.error(error)
        if (!isMounted) {
          return
        }
        setTotalPoints(0)
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
    totalPoints,
    isLoading,
  }
}

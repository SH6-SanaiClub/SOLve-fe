import { useEffect, useState, type RefObject } from 'react'

interface UsePullToRefreshOptions {
  containerRef: RefObject<HTMLElement | null>
  disabled?: boolean
  maxPullDistance?: number
  refreshThreshold?: number
  onRefresh: () => Promise<void> | void
}

export const usePullToRefresh = ({
  containerRef,
  disabled = false,
  maxPullDistance = 96,
  refreshThreshold = 72,
  onRefresh,
}: UsePullToRefreshOptions) => {
  const [isPulling, setIsPulling] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)

  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

    let startY = 0
    let tracking = false
    let currentDistance = 0
    let hasTriggeredThresholdFeedback = false

    const resetPull = () => {
      currentDistance = 0
      hasTriggeredThresholdFeedback = false
      setIsPulling(false)
      setPullDistance(0)
    }

    const handleTouchStart = (event: TouchEvent) => {
      if (disabled || isRefreshing || event.touches.length !== 1) {
        return
      }

      if (container.scrollTop > 0) {
        return
      }

      startY = event.touches[0].clientY
      tracking = true
      currentDistance = 0
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (!tracking) {
        return
      }

      if (container.scrollTop > 0) {
        tracking = false
        resetPull()
        return
      }

      const deltaY = event.touches[0].clientY - startY

      if (deltaY <= 0) {
        if (currentDistance > 0) {
          currentDistance = 0
          setIsPulling(false)
          setPullDistance(0)
        }
        return
      }

      event.preventDefault()

      currentDistance = Math.min(maxPullDistance, deltaY * 0.5)

      if (!hasTriggeredThresholdFeedback && currentDistance >= refreshThreshold) {
        hasTriggeredThresholdFeedback = true
        navigator.vibrate?.(12)
      }

      setIsPulling(true)
      setPullDistance(currentDistance)
    }

    const handleTouchEnd = () => {
      if (!tracking) {
        return
      }

      tracking = false
      setIsPulling(false)

      if (currentDistance < refreshThreshold) {
        setPullDistance(0)
        return
      }

      const releaseDistance = currentDistance
      currentDistance = 0
      setIsRefreshing(true)
      setPullDistance(releaseDistance)

      Promise.resolve(onRefresh())
        .catch((error: unknown) => {
          console.error('Pull to refresh failed', error)
        })
        .finally(() => {
          setIsRefreshing(false)
          setPullDistance(0)
        })
    }

    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd)
    container.addEventListener('touchcancel', handleTouchEnd)

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
      container.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [containerRef, disabled, isRefreshing, maxPullDistance, onRefresh, refreshThreshold])

  return {
    isPulling,
    isRefreshing,
    pullDistance,
    pullProgress: Math.min(pullDistance / refreshThreshold, 1),
  }
}

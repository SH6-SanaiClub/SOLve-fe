import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Badge, Button, Card, InfoRow, ProgressBar, SectionHeader } from '../../components/common'
import BottomNavigation from '../../components/layout/BottomNavigation'
import MainLayout from '../../components/layout/MainLayout'
import {
  BOTTOM_NAVIGATION_ITEMS,
  BOTTOM_NAVIGATION_ROUTE_BY_KEY,
} from '../../constants/bottomNavigation'
import { ROUTE_PATHS } from '../../constants/routePaths'
import {
  getActivityStatusLogs,
  getActivityStatusOverview,
} from '../../services/activityStatusService'
import type {
  ActivityStatusFilter,
  ActivityStatusLogItem,
  ActivityStatusOverviewResponse,
  ActivityStatusReason,
} from '../../types/activityStatus'
import type { UserGrade } from '../../types/user'
import { ShopHeader } from '../shop/components/ShopHeader'

const SCORE_CHART_MAX = 1000
const INITIAL_LOG_SIZE = 5
const LOAD_MORE_SIZE = 10
const SCORE_GRID_VALUES = [0, 250, 500, 750, 1000]
const DEFAULT_SCORE_CHART_WIDTH = 320
const SCORE_CHART_HEIGHT = 190
const numberFormatter = new Intl.NumberFormat('ko-KR')

const FILTER_OPTIONS: Array<{ label: string; value: ActivityStatusFilter }> = [
  { label: '전체', value: 'ALL' },
  { label: 'E', value: 'E' },
  { label: 'S', value: 'S' },
  { label: 'G', value: 'G' },
]

const GRADE_LABELS: Record<UserGrade, string> = {
  SEED: '씨앗',
  SPROUT: '새싹',
  TREE: '나무',
  FOREST: '숲',
  EARTH: '지구',
}

const HIDDEN_ACTIVITY_REASONS: ActivityStatusReason[] = [
  'ABUSE',
  'NO_ACTIVITY',
  'INITIAL_SCORE',
]

const formatGradeLabel = (grade: UserGrade) => GRADE_LABELS[grade] ?? grade

const formatReferenceMonth = (referenceDate: string) => {
  const [year, month] = referenceDate.split('-').map(Number)

  if (!year || !month) {
    return ''
  }

  return year + '년 ' + month + '월 기준'
}

const formatGraphMonth = (month: number) => month + '월'

const formatListDate = (occurredAt: string) => {
  const [datePart] = occurredAt.split('T')
  const [year, month, day] = datePart.split('-')

  if (!year || !month || !day) {
    return occurredAt
  }

  return year + '.' + month + '.' + day
}

const filterVisibleActivityLogs = (items: ActivityStatusLogItem[]) =>
  items.filter((item) => !HIDDEN_ACTIVITY_REASONS.includes(item.reason))

const appendUniqueLogs = (
  previous: ActivityStatusLogItem[],
  nextItems: ActivityStatusLogItem[],
): ActivityStatusLogItem[] => {
  const seen = new Set(previous.map((item) => item.scoreHistoryId))
  const appended = nextItems.filter((item) => !seen.has(item.scoreHistoryId))

  return [...previous, ...appended]
}

const SkeletonBlock = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-gray-200 ${className}`} />
)

export const MyGradePage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo
  const [activeFilter, setActiveFilter] = useState<ActivityStatusFilter>('ALL')
  const activeFilterRef = useRef<ActivityStatusFilter>('ALL')
  const chartContainerRef = useRef<HTMLDivElement | null>(null)
  const [overviewRequestKey, setOverviewRequestKey] = useState(0)
  const [overview, setOverview] = useState<ActivityStatusOverviewResponse | null>(null)
  const [logs, setLogs] = useState<ActivityStatusLogItem[]>([])
  const [totalLogCount, setTotalLogCount] = useState(0)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasNext, setHasNext] = useState(false)
  const [chartWidth, setChartWidth] = useState(DEFAULT_SCORE_CHART_WIDTH)
  const [isOverviewLoading, setIsOverviewLoading] = useState(true)
  const [isLogsLoading, setIsLogsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [overviewError, setOverviewError] = useState('')
  const [logsError, setLogsError] = useState('')

  useEffect(() => {
    activeFilterRef.current = activeFilter
  }, [activeFilter])

  useEffect(() => {
    const container = chartContainerRef.current

    if (!container || typeof ResizeObserver === 'undefined') {
      return
    }

    const updateChartWidth = (nextWidth: number) => {
      if (nextWidth <= 0) {
        return
      }

      setChartWidth((current) => (current === nextWidth ? current : nextWidth))
    }

    updateChartWidth(Math.floor(container.getBoundingClientRect().width))

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]

      if (!entry) {
        return
      }

      updateChartWidth(Math.floor(entry.contentRect.width))
    })

    observer.observe(container)

    return () => {
      observer.disconnect()
    }
  }, [overview, overviewError])

  useEffect(() => {
    let cancelled = false

    const fetchOverview = async () => {
      setIsOverviewLoading(true)
      setOverviewError('')

      try {
        const response = await getActivityStatusOverview()

        if (cancelled) {
          return
        }

        setOverview(response)
      } catch (error) {
        if (cancelled) {
          return
        }

        console.error(error)
        setOverview(null)
        setOverviewError('활동 현황 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.')
      } finally {
        if (!cancelled) {
          setIsOverviewLoading(false)
        }
      }
    }

    void fetchOverview()

    return () => {
      cancelled = true
    }
  }, [overviewRequestKey])

  useEffect(() => {
    let cancelled = false

    const fetchLogs = async () => {
      setIsLogsLoading(true)
      setLogsError('')

      try {
        const response = await getActivityStatusLogs({
          category: activeFilter,
          size: INITIAL_LOG_SIZE,
        })

        if (cancelled) {
          return
        }

        setLogs(filterVisibleActivityLogs(response.items))
        setTotalLogCount(response.totalCount)
        setHasNext(response.hasNext)
        setNextCursor(response.nextCursor)
      } catch (error) {
        if (cancelled) {
          return
        }

        console.error(error)
        setLogs([])
        setTotalLogCount(0)
        setHasNext(false)
        setNextCursor(null)
        setLogsError('ESG 활동 내역을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.')
      } finally {
        if (!cancelled) {
          setIsLogsLoading(false)
        }
      }
    }

    void fetchLogs()

    return () => {
      cancelled = true
    }
  }, [activeFilter])

  const handleLoadMore = async () => {
    if (!hasNext || !nextCursor || isLoadingMore) {
      return
    }

    const requestFilter = activeFilter
    setIsLoadingMore(true)
    setLogsError('')

    try {
      const response = await getActivityStatusLogs({
        category: activeFilter,
        size: LOAD_MORE_SIZE,
        cursor: nextCursor,
      })

      if (activeFilterRef.current !== requestFilter) {
        return
      }

      setLogs((current) => appendUniqueLogs(current, filterVisibleActivityLogs(response.items)))
      setTotalLogCount(response.totalCount)
      setHasNext(response.hasNext)
      setNextCursor(response.nextCursor)
    } catch (error) {
      console.error(error)
      setLogsError('ESG 활동 내역을 더 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.')
    } finally {
      setIsLoadingMore(false)
    }
  }

  const handleBottomNavigation = (key: string) => {
    const nextPath =
      BOTTOM_NAVIGATION_ROUTE_BY_KEY[key as keyof typeof BOTTOM_NAVIGATION_ROUTE_BY_KEY]

    if (nextPath) {
      navigate(nextPath)
    }
  }

  const summary = overview?.summary
  const gradeHistories = overview?.gradeHistories ?? []
  const monthlyScoreSeries = overview?.monthlyScoreGraph ?? []
  const hasOverviewError = Boolean(overviewError) && !overview
  const isOverviewInitialLoading = isOverviewLoading && !overview && !hasOverviewError

  const scoreChart = useMemo(() => {
    if (monthlyScoreSeries.length === 0) {
      return null
    }

    const width = chartWidth
    const height = SCORE_CHART_HEIGHT
    const padding = { top: 20, right: 18, bottom: 28, left: 32 }
    const innerWidth = width - padding.left - padding.right
    const innerHeight = height - padding.top - padding.bottom

    const points = monthlyScoreSeries.map((item, index) => {
      const x =
        monthlyScoreSeries.length === 1
          ? padding.left + innerWidth / 2
          : padding.left + (innerWidth / (monthlyScoreSeries.length - 1)) * index
      const y = padding.top + innerHeight - (item.score / SCORE_CHART_MAX) * innerHeight

      return { ...item, x, y }
    })

    const linePath = points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ')

    const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding.bottom} L ${
      points[0].x
    } ${height - padding.bottom} Z`

    return {
      width,
      height,
      padding,
      points,
      linePath,
      areaPath,
      gridValues: SCORE_GRID_VALUES,
    }
  }, [chartWidth, monthlyScoreSeries])

  return (
    <MainLayout
      header={
        <ShopHeader
          title="ESG 활동 현황"
          onBack={() => {
            if (returnTo) {
              navigate(returnTo, { replace: true })
              return
            }
            navigate(ROUTE_PATHS.my)
          }}
        />
      }
      nav={
        <BottomNavigation
          items={BOTTOM_NAVIGATION_ITEMS}
          value="my"
          onChange={handleBottomNavigation}
        />
      }
      className="bg-bg-light"
    >
      <section className="mt-2 flex flex-col gap-4 pb-2">
        <Card className="mt-3 !gap-3">
          {hasOverviewError ? (
            <div className="flex flex-col items-center justify-center gap-3 py-5 text-center">
              <div className="space-y-1">
                <p className="text-base font-semibold text-font-main">활동 현황 정보를 불러오지 못했습니다.</p>
                <p className="text-sm font-medium text-font-sub">잠시 후 다시 시도해 주세요.</p>
              </div>
              <Button
                variant="gray"
                size="sm"
                className="!h-[40px] !border !border-gray-200 !bg-white !px-4 !text-sm !font-medium !text-font-main"
                onClick={() => setOverviewRequestKey((current) => current + 1)}
              >
                다시 시도
              </Button>
            </div>
          ) : isOverviewInitialLoading ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-4">
                <SkeletonBlock className="h-5 w-28 rounded-full" />
                <div className="flex flex-col items-end gap-2">
                  <SkeletonBlock className="h-3 w-20 rounded-full" />
                  <SkeletonBlock className="h-6 w-20 rounded-full" />
                </div>
              </div>

              <SkeletonBlock className="h-9 w-24 rounded-full" />
              <SkeletonBlock className="mt-1 h-[6px] w-full rounded-full" />
              <div className="mt-3 h-px w-full bg-gray-200" />
              <div className="pt-2">
                <div className="flex items-center justify-between gap-4">
                  <SkeletonBlock className="h-4 w-20 rounded-full" />
                  <SkeletonBlock className="h-4 w-12 rounded-full" />
                </div>
              </div>
            </div>
          ) : (
            <>
              <SectionHeader
                title={
                  <span className="text-base font-semibold text-font-main">
                    나의 등급 <span className="text-primary-500">{summary ? formatGradeLabel(summary.currentGrade) : '-'}</span>
                  </span>
                }
                right={
                  <div className="flex flex-col items-end gap-1 text-right">
                    <p className="text-[11px] font-medium leading-none text-gray-400">
                      {summary ? formatReferenceMonth(summary.referenceDate) : ''}
                    </p>
                    {summary?.showConsecutiveAchievementBadge ? (
                      <Badge className="!px-2 !py-0.5 !text-xs">
                        연속 달성 {summary.consecutiveMaxAchievementMonths}개월
                      </Badge>
                    ) : null}
                  </div>
                }
              />

              <div className="pb-1 pt-1">
                <p className="text-2xl leading-none font-semibold tracking-tight text-font-main">
                  {numberFormatter.format(summary?.totalScore ?? 0)}
                  <span className="ml-1 text-lg font-semibold text-font-sub">점</span>
                </p>
              </div>

              <ProgressBar
                value={summary?.progressCurrent ?? 0}
                max={summary?.progressTarget ?? SCORE_CHART_MAX}
                className="mt-0.5"
              />

              <div className="mt-3 h-px w-full bg-gray-200" />

              <div className="space-y-2 pt-2">
                <InfoRow
                  label={<span className="text-sm font-medium text-gray-500">이번 달 활동</span>}
                  value={
                    <span className="text-sm font-semibold text-font-main">
                      {numberFormatter.format(summary?.currentMonthActivityCount ?? 0)}건
                    </span>
                  }
                  className="items-center"
                />
              </div>
            </>
          )}
        </Card>

        <Card className="!gap-3">
          <SectionHeader
            title="등급 변화 이력"
            right={<span className="mr-1 text-xs font-medium text-gray-400">최근 4개월</span>}
          />

          {isOverviewInitialLoading ? (
            <div className="mt-4 grid grid-cols-4 gap-3 text-center">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <SkeletonBlock className="mx-auto h-4 w-10 rounded-full" />
                  <SkeletonBlock className="mx-auto h-3 w-8 rounded-full" />
                </div>
              ))}
            </div>
          ) : hasOverviewError ? (
            <div className="flex items-center justify-center py-8 text-center text-sm font-medium text-font-sub">
              활동 현황 정보를 불러오지 못했습니다.
            </div>
          ) : gradeHistories.length > 0 ? (
            <div className="mt-4 grid grid-cols-4 gap-3 text-center">
              {gradeHistories.map((item) => (
                <div key={`${item.year}-${item.month}`} className="space-y-2">
                  <p
                    className={`text-sm font-semibold ${
                      item.currentMonth ? 'text-primary-500' : 'text-font-main'
                    }`}
                  >
                    {formatGradeLabel(item.grade)}
                  </p>
                  <p className="text-[11px] font-medium text-gray-400">{formatGraphMonth(item.month)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8 text-sm font-medium text-font-sub">
              등급 변화 이력이 없습니다.
            </div>
          )}
        </Card>

        <Card className="!gap-3">
          <SectionHeader
            title="월별 점수 변화 그래프"
            right={<span className="mr-1 text-xs font-medium text-gray-400">최근 4개월</span>}
          />

          {isOverviewInitialLoading ? (
            <div ref={chartContainerRef} className="pt-1">
              <SkeletonBlock className="h-[210px] w-full rounded-control" />
            </div>
          ) : hasOverviewError ? (
            <div
              ref={chartContainerRef}
              className="flex items-center justify-center py-8 text-center text-sm font-medium text-font-sub"
            >
              활동 현황 정보를 불러오지 못했습니다.
            </div>
          ) : scoreChart ? (
            <div ref={chartContainerRef} className="pt-1">
              <svg
                viewBox={`0 0 ${scoreChart.width} ${scoreChart.height}`}
                className="block w-full overflow-visible"
                style={{ height: 'auto' }}
                aria-label="월별 점수 변화 그래프"
              >
                {scoreChart.gridValues.map((value) => {
                  const y =
                    scoreChart.padding.top +
                    (scoreChart.height - scoreChart.padding.top - scoreChart.padding.bottom) -
                    (value / SCORE_CHART_MAX) *
                      (scoreChart.height - scoreChart.padding.top - scoreChart.padding.bottom)

                  return (
                    <g key={value}>
                      <line
                        x1={scoreChart.padding.left}
                        y1={y}
                        x2={scoreChart.width - scoreChart.padding.right}
                        y2={y}
                        stroke="var(--color-gray-200)"
                        strokeDasharray={value === 0 ? undefined : '4 4'}
                      />
                      <text
                        x={12}
                        y={y + 4}
                        textAnchor="end"
                        fontSize="10"
                        fontWeight="500"
                        fill="var(--color-gray-400)"
                      >
                        {value}
                      </text>
                    </g>
                  )
                })}

                <path d={scoreChart.areaPath} fill="rgba(0, 70, 255, 0.08)" />
                <path
                  d={scoreChart.linePath}
                  fill="none"
                  stroke="var(--color-primary-400)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {scoreChart.points.map((point) => (
                  <g key={`${point.year}-${point.month}`}>
                    <circle cx={point.x} cy={point.y} r="4" fill="var(--color-primary-400)" />
                    <text
                      x={point.x}
                      y={point.y - 12}
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="600"
                      fill={point.currentMonth ? 'var(--color-primary-400)' : 'var(--color-gray-600)'}
                    >
                      {point.score}
                    </text>
                    <text
                      x={point.x}
                      y={scoreChart.height - 6}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight={point.currentMonth ? '600' : '500'}
                      fill={point.currentMonth ? 'var(--color-primary-400)' : 'var(--color-gray-400)'}
                    >
                      {formatGraphMonth(point.month)}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          ) : (
            <div
              ref={chartContainerRef}
              className="flex items-center justify-center py-8 text-sm font-medium text-font-sub"
            >
              그래프 데이터가 없습니다.
            </div>
          )}
        </Card>

        <Card className="!gap-0 !overflow-hidden !p-0">
          <div className="px-5 pt-4">
            <SectionHeader
              title={
                <span className="flex items-center gap-1.5">
                  <span>ESG 활동 내역</span>
                  <span className="text-xs font-medium text-gray-400">(최근 1년)</span>
                </span>
              }
            />
          </div>

          <div className="px-5 py-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex min-w-0 flex-wrap gap-2">
                {FILTER_OPTIONS.map((option) => {
                  const isActive = option.value === activeFilter

                  return (
                    <Button
                      key={option.value}
                      type="button"
                      size="sm"
                      variant={isActive ? 'sub' : 'gray'}
                      className={
                        isActive
                          ? '!h-[32px] !px-3 !text-xs !font-semibold'
                          : '!h-[32px] !border !border-gray-200 !bg-white !px-3 !text-xs !font-medium !text-font-sub'
                      }
                      onClick={() => setActiveFilter(option.value)}
                    >
                      {option.label}
                    </Button>
                  )
                })}
              </div>

              <span className="shrink-0 text-xs font-medium text-gray-400">
                총 {numberFormatter.format(totalLogCount)}건
              </span>
            </div>

            {isLogsLoading ? (
              <div className="flex items-center justify-center rounded-control border border-gray-100 px-4 py-8 text-center">
                <span className="text-sm font-medium text-font-sub">
                  ESG 활동 내역을 불러오는 중입니다.
                </span>
              </div>
            ) : logsError && logs.length === 0 ? (
              <div className="flex items-center justify-center rounded-control border border-gray-100 px-4 py-8 text-center">
                <span className="text-sm font-medium text-font-sub">{logsError}</span>
              </div>
            ) : logs.length > 0 ? (
              <div className="flex flex-col">
                {logs.map((item, index) => (
                  <div
                    key={item.scoreHistoryId}
                    className={`flex items-center justify-between gap-4 py-3 ${
                      index < logs.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-font-main">{item.title}</p>
                      <p className="mt-1 text-xs font-medium text-gray-400">
                        {formatListDate(item.occurredAt)}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center">
                      <Badge tone="primary" variant="soft" className="!px-2 !py-1">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-control border border-gray-100 px-4 py-8 text-center">
                <span className="text-sm font-medium text-font-sub">ESG 활동 내역이 없습니다.</span>
              </div>
            )}

            {logsError && logs.length > 0 ? (
              <p className="pt-3 text-xs font-medium text-error">{logsError}</p>
            ) : null}

            {hasNext ? (
              <div className="pt-3">
                <Button
                  onClick={handleLoadMore}
                  variant="gray"
                  size="sm"
                  fullWidth
                  disabled={isLoadingMore}
                  className="!h-[42px] !border !border-gray-200 !bg-white !text-sm !font-medium !text-font-main hover:!bg-gray-50"
                >
                  {isLoadingMore ? '불러오는 중...' : '더보기'}
                </Button>
              </div>
            ) : null}
          </div>
        </Card>
      </section>
    </MainLayout>
  )
}

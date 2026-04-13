import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card } from '../../components/common'
import BottomNavigation from '../../components/layout/BottomNavigation'
import { getS3AssetUrl } from '../../constants/assetUrls'
import MainLayout from '../../components/layout/MainLayout'
import {
  BOTTOM_NAVIGATION_ITEMS,
  BOTTOM_NAVIGATION_ROUTE_BY_KEY,
} from '../../constants/bottomNavigation'
import { ROUTE_PATHS } from '../../constants/routePaths'
import { downloadReportPdf, getReportPreview, issueReport } from '../../services/reportService'
import type {
  ReportCertificateMeta,
  ReportCertificateSnapshot,
  ReportPeriodType,
} from '../../types/report'
import type { UserGrade } from '../../types/user'
import { ShopHeader } from '../shop/components/ShopHeader'

const PERIOD_OPTIONS: Array<{ label: string; value: ReportPeriodType }> = [
  { label: '3개월', value: '3M' },
  { label: '6개월', value: '6M' },
  { label: '1년', value: '1Y' },
]

const GRADE_LABELS: Record<UserGrade, string> = {
  SEED: '씨앗',
  SPROUT: '새싹',
  TREE: '나무',
  FOREST: '숲',
  EARTH: '지구',
}

const numberFormatter = new Intl.NumberFormat('ko-KR')
const todayIssueDate = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(
  new Date(),
)
const reportWatermarkImageUrl = getS3AssetUrl('verified.webp')

const formatDisplayDate = (value: string) => {
  if (!value) {
    return '-'
  }

  const normalized = value.includes('T') ? value.slice(0, 10) : value
  const [year, month, day] = normalized.split('-')

  if (!year || !month || !day) {
    return value
  }

  return `${year}.${month}.${day}`
}

const getTargetPeriodLabel = (snapshot: ReportCertificateSnapshot) =>
  `${formatDisplayDate(snapshot.targetStartDate)} ~ ${formatDisplayDate(snapshot.targetEndDate)}`

const getConsecutiveStatusLabel = (snapshot: ReportCertificateSnapshot) => {
  if (!snapshot.showConsecutiveAchievementBadge || snapshot.consecutiveMaxAchievementMonths <= 0) {
    return '-'
  }

  return `${snapshot.consecutiveMaxAchievementMonths}개월`
}

const getAbsoluteVerificationUrl = (verificationUrl: string) => {
  if (!verificationUrl) {
    return ''
  }

  if (/^https?:\/\//i.test(verificationUrl)) {
    return verificationUrl
  }

  return `${window.location.origin}${verificationUrl}`
}

const downloadBlobFile = (blob: Blob, fileName: string) => {
  const blobUrl = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = blobUrl
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(blobUrl)
}

export const MyReportPage = () => {
  const navigate = useNavigate()
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriodType>('3M')
  const [reloadCount, setReloadCount] = useState(0)
  const [report, setReport] = useState<ReportCertificateSnapshot | null>(null)
  const [issuedMeta, setIssuedMeta] = useState<ReportCertificateMeta | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isIssuing, setIsIssuing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [issueErrorMessage, setIssueErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchReport = async () => {
      setIsLoading(true)
      setErrorMessage(null)
      setIssueErrorMessage(null)
      setIssuedMeta(null)

      try {
        const response = await getReportPreview({ periodType: selectedPeriod })
        if (!cancelled) {
          setReport(response.snapshot)
        }
      } catch {
        if (!cancelled) {
          setErrorMessage('인증서 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchReport()

    return () => {
      cancelled = true
    }
  }, [reloadCount, selectedPeriod])

  const categoryRows = useMemo(() => {
    if (!report) {
      return []
    }

    return report.categories.map((category) => ({
      ...category,
      displayValue: `${numberFormatter.format(category.value)}${category.unit}`,
    }))
  }, [report])

  const displayIssueDate = issuedMeta ? issuedMeta.issuedAt : todayIssueDate
  const displayCertificateNumber = issuedMeta?.certificateNumber ?? '발급 후 생성'
  const displayVerificationCode = issuedMeta?.verificationCode ?? '발급 후 생성'
  const displayVerificationUrl = issuedMeta
    ? getAbsoluteVerificationUrl(issuedMeta.verificationUrl)
    : '인증서 발급 후 확인 가능'

  const handleBottomNavigation = (key: string) => {
    const nextPath =
      BOTTOM_NAVIGATION_ROUTE_BY_KEY[key as keyof typeof BOTTOM_NAVIGATION_ROUTE_BY_KEY]

    if (nextPath) {
      navigate(nextPath)
    }
  }

  const handleRetry = () => {
    setReloadCount((previous) => previous + 1)
  }

  const handleIssueCertificate = async () => {
    if (!report || isIssuing) {
      return
    }

    setIsIssuing(true)
    setIssueErrorMessage(null)

    try {
      const response = await issueReport(selectedPeriod)
      const normalizedMeta = {
        ...response.certificate,
        verificationUrl: getAbsoluteVerificationUrl(response.certificate.verificationUrl),
      }

      setReport(response.snapshot)
      setIssuedMeta(normalizedMeta)

      try {
        const pdfBlob = await downloadReportPdf(response.certificate.issueId)
        downloadBlobFile(pdfBlob, `ESG_certificate_${response.certificate.certificateNumber}.pdf`)
      } catch (pdfError) {
        console.error('Certificate PDF download failed:', pdfError)
        setIssueErrorMessage('인증서 발급은 완료되었지만 PDF 다운로드에 실패했습니다.')
      }
    } catch (issueError) {
      console.error('Certificate issue failed:', issueError)
      setIssueErrorMessage('인증서 발급에 실패했습니다. 잠시 후 다시 시도해 주세요.')
    } finally {
      setIsIssuing(false)
    }
  }

  return (
    <MainLayout
      header={<ShopHeader title="ESG 활동 인증서" onBack={() => navigate(ROUTE_PATHS.my)} />}
      nav={
        <BottomNavigation
          items={BOTTOM_NAVIGATION_ITEMS}
          value="my"
          onChange={handleBottomNavigation}
        />
      }
      className="bg-bg-light"
    >
      <section className="mt-5 flex flex-col gap-2 pb-3">
        <div className="flex items-center justify-between gap-3 px-1">
          <div className="flex flex-wrap gap-2">
            {PERIOD_OPTIONS.map((option) => {
              const isSelected = option.value === selectedPeriod

              return (
                <Button
                  key={option.value}
                  variant={isSelected ? 'sub' : 'gray'}
                  size="sm"
                  className={
                    isSelected
                      ? '!h-[34px] !px-3 !text-xs !font-semibold'
                      : '!h-[34px] !border !border-gray-200 !bg-white !px-3 !text-xs !font-medium !text-font-sub'
                  }
                  onClick={() => setSelectedPeriod(option.value)}
                >
                  {option.label}
                </Button>
              )
            })}
          </div>

          <Button
            variant="primary"
            size="sm"
            className="!h-[38px] !px-4 !text-xs !font-semibold disabled:!border disabled:!border-primary-200 disabled:!bg-primary-50 disabled:!text-primary-500"
            disabled={isLoading || !report || isIssuing}
            onClick={handleIssueCertificate}
          >
            {isIssuing ? '인증서 발급 중...' : '인증서 발급받기'}
          </Button>
        </div>

        {issueErrorMessage ? (
          <p className="px-1 text-xs font-medium text-red-500">{issueErrorMessage}</p>
        ) : null}

        <div className="mx-auto mt-1 w-full max-w-[560px]">
          {isLoading ? (
            <Card className="!gap-0 !overflow-hidden !border border-gray-200 !bg-white !p-0 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              <div className="border-b border-gray-100 px-6 pt-6 pb-4">
                <div className="mx-auto h-7 w-44 animate-pulse rounded bg-gray-100" />
              </div>

              <div className="space-y-6 px-6 py-6">
                <div className="space-y-2">
                  <div className="h-3 w-16 animate-pulse rounded bg-gray-100" />
                  <div className="h-6 w-28 animate-pulse rounded bg-gray-100" />
                </div>

                <div className="overflow-hidden rounded-control border border-gray-200">
                  <div className="grid grid-cols-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={index}
                        className={[
                          'space-y-2 px-4 py-4',
                          index % 2 === 0 ? 'border-r border-gray-100' : '',
                          index < 2 ? 'border-b border-gray-100' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        <div className="h-3 w-14 animate-pulse rounded bg-gray-100" />
                        <div className="h-5 w-16 animate-pulse rounded bg-gray-100" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 border-t border-gray-100 pt-6">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="h-4 w-16 animate-pulse rounded bg-gray-100" />
                      <div className="h-4 w-28 animate-pulse rounded bg-gray-100" />
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t border-gray-100 pt-4">
                  <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="flex items-center justify-between gap-3 py-1">
                        <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
                        <div className="h-4 w-12 animate-pulse rounded bg-gray-100" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-200 bg-primary-50/30 px-6 py-5">
                <div className="grid grid-cols-[1fr_96px] items-center gap-5">
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="flex items-center justify-between gap-3">
                        <div className="h-3 w-16 animate-pulse rounded bg-white/70" />
                        <div className="h-3 w-32 animate-pulse rounded bg-white/70" />
                      </div>
                    ))}
                  </div>
                  <div className="h-[96px] w-[96px] animate-pulse rounded-control border border-dashed border-gray-300 bg-white/80" />
                </div>
              </div>
            </Card>
          ) : errorMessage ? (
            <Card className="!gap-0 !border border-gray-200 !bg-white !p-0 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              <div className="space-y-4 px-6 py-10 text-center">
                <p className="text-base font-semibold text-font-main">인증서 정보를 불러오지 못했습니다</p>
                <p className="text-sm text-font-sub">{errorMessage}</p>
                <div className="flex justify-center">
                  <Button variant="sub" size="sm" onClick={handleRetry}>
                    다시 시도
                  </Button>
                </div>
              </div>
            </Card>
          ) : report ? (
            <Card className="!relative !gap-0 !overflow-hidden !border border-gray-200 !bg-white !p-0 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              <img
                src={reportWatermarkImageUrl}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 z-0 w-[280px] -translate-x-1/2 -translate-y-1/2 opacity-[0.07]"
              />

              <div className="relative z-10 border-b border-gray-100 px-6 py-6">
                <div className="px-1">
                  <p className="text-center text-[26px] font-semibold tracking-[-0.02em] text-font-main">
                    ESG 활동 인증서
                  </p>
                  <div className="flex justify-end -mr-1 mt-2 -mb-3">
                    <p className="text-xs font-medium text-gray-400">
                      발급일 {formatDisplayDate(displayIssueDate)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative z-10 px-6 py-6">
                <div className="px-1">
                  <p className="text-xs font-medium text-gray-400">발급 대상</p>
                  <p className="mt-2 text-xl font-semibold leading-none tracking-tight text-font-main">
                    {report.recipientName}
                  </p>
                </div>

                <div className="mt-6 overflow-hidden rounded-control border border-gray-200">
                  <div className="grid grid-cols-2 bg-white">
                    <div className="border-r border-b border-gray-100 px-4 py-4">
                      <p className="text-xs font-medium text-gray-400">현재 등급</p>
                      <p className="mt-2 text-base font-semibold text-font-main">
                        {GRADE_LABELS[report.currentGrade]}
                      </p>
                    </div>
                    <div className="border-b border-gray-100 px-4 py-4">
                      <p className="text-xs font-medium text-gray-400">해당 유저 점수</p>
                      <p className="mt-2 text-base font-semibold text-font-main">
                        {numberFormatter.format(report.totalScore)}점
                      </p>
                    </div>
                    <div className="border-r border-gray-100 px-4 py-4">
                      <p className="text-xs font-medium text-gray-400">인증 활동</p>
                      <p className="mt-2 text-base font-semibold text-font-main">
                        {numberFormatter.format(report.verifiedActivityCount)}건
                      </p>
                    </div>
                    <div className="px-4 py-4">
                      <p className="text-xs font-medium text-gray-400">연속 활동</p>
                      <p className="mt-2 text-base font-semibold text-font-main">
                        {getConsecutiveStatusLabel(report)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-3 border-t border-gray-100 pt-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-font-sub">대상 기간</span>
                    <span className="text-sm font-semibold text-font-main">
                      {getTargetPeriodLabel(report)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-font-sub">발급기관</span>
                    <span className="text-sm font-semibold text-font-main">SOLVE</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-font-sub">인증서 번호</span>
                    <span className="text-sm font-semibold text-font-main">
                      {displayCertificateNumber}
                    </span>
                  </div>
                </div>

                <div className="mt-4 border-t border-gray-100 pt-4">
                  <p className="text-sm font-medium text-gray-400 -mb-3">
                    카테고리 요약
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2">
                    {categoryRows.map((category) => (
                      <div
                        key={category.categoryKey}
                        className="flex items-center justify-between gap-3 py-1"
                      >
                        <span className="text-xs font-medium text-font-main">{category.label}</span>
                        <span className="text-xs font-semibold text-font-main">
                          {category.displayValue}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative z-10 border-t border-dashed border-gray-200 bg-primary-50/30 px-6 py-5">
                <div className="grid grid-cols-[1fr_96px] items-center gap-5">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-medium text-font-sub">인증 코드</span>
                      <span className="text-xs font-semibold text-font-main">
                        {displayVerificationCode}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-xs font-medium text-font-sub">인증 URL</span>
                      <span className="max-w-[255px] break-all text-right text-xs font-medium text-font-main">
                        {displayVerificationUrl}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-medium text-font-sub">유효 기간</span>
                      <span className="text-xs font-semibold text-font-main">
                        발급일로부터 1개월
                      </span>
                    </div>
                  </div>

                  <div className="flex h-[96px] w-[96px] items-center justify-center rounded-control border border-dashed border-gray-300 bg-white/80 text-center">
                    <div>
                      <p className="text-[10px] font-medium text-gray-400">인증용</p>
                      <p className="mt-1 text-[11px] font-semibold text-font-main">QR 코드</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ) : null}
        </div>
      </section>
    </MainLayout>
  )
}

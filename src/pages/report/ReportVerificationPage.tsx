import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card } from '../../components/common'
import { ROUTE_PATHS } from '../../constants/routePaths'
import { verifyReport } from '../../services/reportService'
import type {
  ReportCategorySummary,
  ReportCertificateMeta,
  ReportCertificateSnapshot,
  ReportVerificationStatus,
} from '../../types/report'
import type { UserGrade } from '../../types/user'

const GRADE_LABELS: Record<UserGrade, string> = {
  SEED: '씨앗',
  SPROUT: '새싹',
  TREE: '나무',
  FOREST: '숲',
  EARTH: '지구',
}

const CATEGORY_LABELS: Record<string, string> = {
  ENVIRONMENT: '환경 활동(E)',
  VOLUNTEER: '봉사활동(S)',
  DONATION: '사회공헌 활동(S)',
  TRUST: '신뢰 활동(G)',
}

const numberFormatter = new Intl.NumberFormat('ko-KR')

const formatDisplayDate = (value?: string) => {
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

const getStatusTone = (status: ReportVerificationStatus) => {
  switch (status) {
    case 'ACTIVE':
      return {
        badgeClassName: 'bg-primary-50 text-primary-500 border border-primary-100',
        title: '유효한 인증서입니다',
        description: 'SOLVE에서 발급된 ESG 활동 인증서가 정상적으로 확인되었습니다.',
      }
    case 'REVOKED':
      return {
        badgeClassName: 'bg-amber-50 text-amber-600 border border-amber-100',
        title: '폐기된 인증서입니다',
        description: '해당 인증서는 더 이상 유효하지 않습니다. 발급 상태를 다시 확인해 주세요.',
      }
    default:
      return {
        badgeClassName: 'bg-red-50 text-red-500 border border-red-100',
        title: '유효하지 않은 인증서입니다',
        description: '등록되지 않았거나 올바르지 않은 인증 정보입니다.',
      }
  }
}

const getConsecutiveStatusLabel = (snapshot: ReportCertificateSnapshot) => {
  if (!snapshot.showConsecutiveAchievementBadge || snapshot.consecutiveMaxAchievementMonths <= 0) {
    return '-'
  }

  return `${snapshot.consecutiveMaxAchievementMonths}개월`
}

const getCategoryDisplay = (category: ReportCategorySummary) => ({
  key: category.categoryKey,
  label: CATEGORY_LABELS[category.categoryKey] ?? category.label,
  value: `${numberFormatter.format(category.value)}${category.unit}`,
})

const VerificationSkeleton = () => (
  <Card className="!gap-0 !border border-gray-200 !bg-white !p-0 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
    <div className="space-y-5 px-6 py-7">
      <div className="space-y-3 border-b border-gray-100 pb-5 text-center">
        <div className="mx-auto h-6 w-32 animate-pulse rounded bg-gray-100" />
        <div className="mx-auto h-4 w-48 animate-pulse rounded bg-gray-100" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
            <div className="h-4 w-32 animate-pulse rounded bg-gray-100" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-5">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-control border border-gray-100 px-4 py-4">
            <div className="h-3 w-16 animate-pulse rounded bg-gray-100" />
            <div className="mt-3 h-5 w-20 animate-pulse rounded bg-gray-100" />
          </div>
        ))}
      </div>
    </div>
  </Card>
)

const VerificationSummary = ({
  certificate,
  snapshot,
}: {
  certificate: ReportCertificateMeta
  snapshot: ReportCertificateSnapshot
}) => {
  const categories = snapshot.categories.map(getCategoryDisplay)

  return (
    <Card className="!gap-0 !border border-gray-200 !bg-white !p-0 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
      <div className="border-b border-gray-100 px-6 py-7 text-center">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary-500">CERTIFICATE</p>
        <h1 className="mt-2 text-[26px] font-semibold tracking-[-0.02em] text-font-main">
          ESG 활동 인증서
        </h1>
        <p className="mt-3 text-sm text-font-sub">
          SOLVE에서 발급된 ESG 활동 인증 정보입니다.
        </p>
      </div>

      <div className="space-y-6 px-6 py-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-font-sub">발급 대상</span>
            <span className="text-sm font-semibold text-font-main">{snapshot.recipientName}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-font-sub">인증서 번호</span>
            <span className="text-sm font-semibold text-font-main">
              {certificate.certificateNumber}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-font-sub">발급일</span>
            <span className="text-sm font-semibold text-font-main">
              {formatDisplayDate(certificate.issuedAt)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-font-sub">대상 기간</span>
            <span className="text-sm font-semibold text-font-main">
              {formatDisplayDate(snapshot.targetStartDate)} ~{' '}
              {formatDisplayDate(snapshot.targetEndDate)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-5">
          <div className="rounded-control border border-gray-100 px-4 py-4">
            <p className="text-xs font-medium text-gray-400">현재 등급</p>
            <p className="mt-2 text-base font-semibold text-font-main">
              {GRADE_LABELS[snapshot.currentGrade]}
            </p>
          </div>
          <div className="rounded-control border border-gray-100 px-4 py-4">
            <p className="text-xs font-medium text-gray-400">해당 유저 점수</p>
            <p className="mt-2 text-base font-semibold text-font-main">
              {numberFormatter.format(snapshot.totalScore)}점
            </p>
          </div>
          <div className="rounded-control border border-gray-100 px-4 py-4">
            <p className="text-xs font-medium text-gray-400">인증 활동</p>
            <p className="mt-2 text-base font-semibold text-font-main">
              {numberFormatter.format(snapshot.verifiedActivityCount)}건
            </p>
          </div>
          <div className="rounded-control border border-gray-100 px-4 py-4">
            <p className="text-xs font-medium text-gray-400">연속 활동</p>
            <p className="mt-2 text-base font-semibold text-font-main">
              {getConsecutiveStatusLabel(snapshot)}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-5">
          <p className="text-sm font-medium text-gray-400">카테고리 요약</p>
          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
            {categories.map((category) => (
              <div key={category.key} className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-font-main">{category.label}</span>
                <span className="text-xs font-semibold text-font-main">{category.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-control border border-dashed border-primary-200 bg-primary-50/30 px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-font-sub">인증 코드</span>
            <span className="text-xs font-semibold text-font-main">
              {certificate.verificationCode}
            </span>
          </div>
          <div className="mt-3 flex items-start justify-between gap-3">
            <span className="text-xs font-medium text-font-sub">검증 URL</span>
            <span className="max-w-[220px] break-all text-right text-xs font-medium text-font-main">
              {certificate.verificationUrl}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}

export function ReportVerificationPage() {
  const navigate = useNavigate()
  const { token } = useParams<{ token: string }>()
  const [isLoading, setIsLoading] = useState(true)
  const [isFetchError, setIsFetchError] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<ReportVerificationStatus>('INVALID')
  const [certificate, setCertificate] = useState<ReportCertificateMeta | null>(null)
  const [snapshot, setSnapshot] = useState<ReportCertificateSnapshot | null>(null)
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    let cancelled = false

    const fetchVerification = async () => {
      if (!token) {
        setVerificationStatus('INVALID')
        setCertificate(null)
        setSnapshot(null)
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setIsFetchError(false)

      try {
        const response = await verifyReport(token)

        if (cancelled) {
          return
        }

        setVerificationStatus(response.verificationStatus)
        setCertificate(response.certificate)
        setSnapshot(response.snapshot)
      } catch {
        if (!cancelled) {
          setIsFetchError(true)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchVerification()

    return () => {
      cancelled = true
    }
  }, [reloadCount, token])

  const statusTone = useMemo(() => getStatusTone(verificationStatus), [verificationStatus])

  return (
    <div className="app-shell flex items-center justify-center !pb-10">
      <div className="w-full space-y-4">
        {isLoading ? <VerificationSkeleton /> : null}

        {!isLoading && isFetchError ? (
          <Card className="!gap-0 !border border-gray-200 !bg-white !p-0 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
            <div className="space-y-4 px-6 py-10 text-center">
              <h1 className="text-xl font-semibold text-font-main">인증서 정보를 불러오지 못했습니다</h1>
              <p className="text-sm leading-relaxed text-font-sub">
                잠시 후 다시 시도해 주세요.
              </p>
              <div className="flex justify-center gap-2 pt-2">
                <Button variant="sub" size="sm" onClick={() => setReloadCount((value) => value + 1)}>
                  다시 시도
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigate(ROUTE_PATHS.root)}>
                  SOLVE로 이동
                </Button>
              </div>
            </div>
          </Card>
        ) : null}

        {!isLoading && !isFetchError ? (
          <>
            <Card className="!gap-0 !border border-gray-200 !bg-white !p-0 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
              <div className="space-y-3 px-6 py-6 text-center">
                <div className="flex justify-center">
                  <span
                    className={[
                      'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                      statusTone.badgeClassName,
                    ].join(' ')}
                  >
                    {verificationStatus === 'ACTIVE'
                      ? '유효'
                      : verificationStatus === 'REVOKED'
                        ? '폐기'
                        : '무효'}
                  </span>
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-font-main">
                  {statusTone.title}
                </h1>
                <p className="text-sm leading-relaxed text-font-sub">{statusTone.description}</p>
              </div>
            </Card>

            {verificationStatus === 'ACTIVE' && certificate && snapshot ? (
              <VerificationSummary certificate={certificate} snapshot={snapshot} />
            ) : verificationStatus === 'REVOKED' && certificate ? (
              <Card className="!gap-0 !border border-gray-200 !bg-white !p-0 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
                <div className="space-y-4 px-6 py-7">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-font-sub">인증서 번호</span>
                    <span className="text-sm font-semibold text-font-main">
                      {certificate.certificateNumber}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-font-sub">발급일</span>
                    <span className="text-sm font-semibold text-font-main">
                      {formatDisplayDate(certificate.issuedAt)}
                    </span>
                  </div>
                  <div className="rounded-control border border-amber-100 bg-amber-50 px-4 py-4 text-sm leading-relaxed text-amber-700">
                    해당 인증서는 발급 후 상태가 변경되어 더 이상 사용할 수 없습니다.
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="!gap-0 !border border-gray-200 !bg-white !p-0 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
                <div className="space-y-4 px-6 py-7">
                  <div className="rounded-control border border-red-100 bg-red-50 px-4 py-4 text-sm leading-relaxed text-red-600">
                    인증서 번호 또는 검증 토큰이 올바르지 않습니다. 발급받은 URL을 다시 확인해 주세요.
                  </div>
                </div>
              </Card>
            )}
          </>
        ) : null}
      </div>
    </div>
  )
}

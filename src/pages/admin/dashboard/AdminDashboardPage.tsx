import { useEffect, useState } from 'react'
import { Activity, Coins, HandHeart, Users } from 'lucide-react'
import { Badge, Card } from '../../../components/common'
import { getAdminDashboard } from '../../../services/adminApi'
import type { AdminDashboardData } from '../../../types/admin'
import { formatNumber, getApiErrorMessage } from '../../../utils/admin'

const summaryCards = [
  {
    key: 'totalUsers',
    title: '전체 사용자',
    description: '누적 가입 사용자',
    icon: Users,
  },
  {
    key: 'todayNewUsers',
    title: '오늘 신규 가입',
    description: '금일 createdAt 기준',
    icon: Activity,
  },
  {
    key: 'weekNewUsers',
    title: '이번 주 신규 가입',
    description: '월요일부터 오늘까지',
    icon: HandHeart,
  },
  {
    key: 'activeUsers',
    title: '활성 사용자',
    description: 'isActive=true 사용자',
    icon: Coins,
  },
] as const

export const AdminDashboardPage = () => {
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoading(true)
      setError('')

      try {
        const response = await getAdminDashboard()
        setDashboard(response)
      } catch (fetchError) {
        setError(getApiErrorMessage(fetchError, '대시보드 데이터를 불러오지 못했습니다.'))
      } finally {
        setIsLoading(false)
      }
    }

    void fetchDashboard()
  }, [])

  if (isLoading) {
    return (
      <Card className="items-center !py-16 text-center">
        <p className="text-sm font-medium text-font-sub">대시보드 데이터를 불러오는 중입니다.</p>
      </Card>
    )
  }

  if (error || !dashboard) {
    return (
      <Card className="items-center !py-16 text-center">
        <p className="text-sm font-medium text-error">{error || '대시보드 데이터를 불러오지 못했습니다.'}</p>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-4 xl:grid-cols-4">
        {summaryCards.map(({ key, title, description, icon: Icon }) => (
          <Card key={key} className="gap-5 !rounded-[20px] border-border-muted !p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-font-sub">{title}</p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-font-main">
                  {formatNumber(dashboard[key])}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-primary-50 text-primary-500">
                <Icon size={22} />
              </div>
            </div>
            <p className="text-sm text-font-sub">{description}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="gap-6 !rounded-[20px] border-border-muted !p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-font-main">등급 분포</h2>
              <p className="mt-1 text-sm text-font-sub">현재 사용자 등급 현황입니다.</p>
            </div>
            <Badge tone="primary" className="!px-3 !py-2 text-sm">
              Total {formatNumber(dashboard.totalUsers)}
            </Badge>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {Object.entries(dashboard.gradeDistribution).map(([grade, count]) => (
              <div
                key={grade}
                className="rounded-[18px] border border-border-muted bg-bg-light p-4"
              >
                <p className="text-xs font-semibold tracking-[0.2em] text-font-sub uppercase">
                  {grade}
                </p>
                <p className="mt-3 text-2xl font-bold text-font-main">
                  {formatNumber(count)}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="gap-5 !rounded-[20px] border-border-muted !p-6">
          <div>
            <h2 className="text-xl font-semibold text-font-main">활동 현황</h2>
            <p className="mt-1 text-sm text-font-sub">이번 달 누적 활동 수치입니다.</p>
          </div>

          <div className="grid gap-3">
            <div className="rounded-[18px] bg-primary-50 p-4">
              <p className="text-sm text-font-sub">기부 참여 건수</p>
              <p className="mt-2 text-2xl font-bold text-font-main">
                {formatNumber(dashboard.thisMonthDonationCount)}건
              </p>
              <p className="mt-1 text-sm text-primary-500">
                누적 기부액 {formatNumber(dashboard.thisMonthDonationAmount)}원
              </p>
            </div>
            <div className="rounded-[18px] border border-border-muted bg-white p-4">
              <p className="text-sm text-font-sub">봉사 신청 건수</p>
              <p className="mt-2 text-2xl font-bold text-font-main">
                {formatNumber(dashboard.thisMonthVolunteerCount)}건
              </p>
            </div>
            <div className="rounded-[18px] border border-border-muted bg-white p-4">
              <p className="text-sm text-font-sub">가치가게 구매 건수</p>
              <p className="mt-2 text-2xl font-bold text-font-main">
                {formatNumber(dashboard.thisMonthPurchaseCount)}건
              </p>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="gap-3 !rounded-[20px] border-border-muted !p-6">
          <p className="text-sm font-medium text-font-sub">활성 대출</p>
          <p className="text-3xl font-bold text-font-main">
            {formatNumber(dashboard.activeLoanCount)}건
          </p>
          <p className="text-sm text-font-sub">
            활성 원금 합계 {formatNumber(dashboard.activeLoanAmount)}원
          </p>
        </Card>

        <Card className="gap-3 !rounded-[20px] border-border-muted !p-6">
          <p className="text-sm font-medium text-font-sub">활성 적금</p>
          <p className="text-3xl font-bold text-font-main">
            {formatNumber(dashboard.activeSavingCount)}건
          </p>
          <p className="text-sm text-font-sub">현재 활성 상태의 적금 상품 가입 건수입니다.</p>
        </Card>

        <Card className="gap-3 !rounded-[20px] border-border-muted !p-6">
          <p className="text-sm font-medium text-font-sub">활성 사용자 비율</p>
          <p className="text-3xl font-bold text-font-main">
            {dashboard.totalUsers === 0
              ? '0%'
              : `${Math.round((dashboard.activeUsers / dashboard.totalUsers) * 100)}%`}
          </p>
          <p className="text-sm text-font-sub">총 사용자 대비 활성 계정 비중입니다.</p>
        </Card>
      </section>
    </div>
  )
}

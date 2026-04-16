import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Badge, Button, Card, InfoRow } from '../../../components/common'
import { ROUTE_PATHS } from '../../../constants/routePaths'
import { applyUserPenalty, getAdminUser, updateUserStatus } from '../../../services/adminApi'
import type { AdminUserDetail } from '../../../types/admin'
import { formatDate, formatDateTime, formatNumber, getApiErrorMessage } from '../../../utils/admin'

export const AdminUserDetailPage = () => {
  const navigate = useNavigate()
  const params = useParams<{ userId: string }>()
  const userId = Number(params.userId)
  const [user, setUser] = useState<AdminUserDetail | null>(null)
  const [penaltyReason, setPenaltyReason] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      if (!Number.isFinite(userId)) {
        setError('유효하지 않은 사용자 ID입니다.')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError('')

      try {
        const response = await getAdminUser(userId)
        setUser(response)
      } catch (fetchError) {
        setError(getApiErrorMessage(fetchError, '사용자 상세 정보를 불러오지 못했습니다.'))
      } finally {
        setIsLoading(false)
      }
    }

    void fetchUser()
  }, [userId])

  const handleStatusToggle = async () => {
    if (!user) {
      return
    }

    const nextStatus = !user.isActive

    if (!window.confirm(`사용자 상태를 ${nextStatus ? '활성' : '비활성'}으로 변경하시겠습니까?`)) {
      return
    }

    setIsSubmitting(true)

    try {
      const updatedUser = await updateUserStatus(user.userId, nextStatus)
      setUser(updatedUser)
      alert('사용자 상태를 변경했습니다.')
    } catch (submitError) {
      alert(getApiErrorMessage(submitError, '사용자 상태 변경에 실패했습니다.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleApplyPenalty = async () => {
    if (!user || !penaltyReason.trim()) {
      return
    }

    if (!window.confirm('이 사용자에게 패널티를 부여하시겠습니까?')) {
      return
    }

    setIsSubmitting(true)

    try {
      const updatedUser = await applyUserPenalty(user.userId, penaltyReason.trim())
      setUser(updatedUser)
      setPenaltyReason('')
      alert('패널티를 부여했습니다.')
    } catch (submitError) {
      alert(getApiErrorMessage(submitError, '패널티 부여에 실패했습니다.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="items-center !py-16 text-center">
        <p className="text-sm font-medium text-font-sub">사용자 상세 정보를 불러오는 중입니다.</p>
      </Card>
    )
  }

  if (error || !user) {
    return (
      <Card className="items-center gap-4 !py-16 text-center">
        <p className="text-sm font-medium text-error">{error || '사용자 정보를 찾을 수 없습니다.'}</p>
        <Button variant="outline" onClick={() => navigate(ROUTE_PATHS.adminUsers)}>
          목록으로
        </Button>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="gap-5 !rounded-[20px] border-border-muted !p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold text-font-main">{user.name}</h2>
              <Badge tone={user.isActive ? 'success' : 'neutral'}>
                {user.isActive ? '활성' : '비활성'}
              </Badge>
              <Badge tone="primary">{user.currentGrade}</Badge>
            </div>
            <p className="mt-2 text-sm text-font-sub">
              {user.loginId} · {user.email}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => navigate(ROUTE_PATHS.adminUsers)}>
              목록으로
            </Button>
            <Button onClick={handleStatusToggle} disabled={isSubmitting}>
              {user.isActive ? '비활성 전환' : '활성 전환'}
            </Button>
          </div>
        </div>
      </Card>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="gap-4 !rounded-[20px] border-border-muted !p-6">
          <h3 className="text-lg font-semibold text-font-main">기본 정보</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <InfoRow label="이름" value={user.name} />
            <InfoRow label="로그인 아이디" value={user.loginId} />
            <InfoRow label="이메일" value={user.email} />
            <InfoRow label="휴대폰 번호" value={user.phoneNumber || '-'} />
            <InfoRow label="생년월일" value={formatDate(user.birthdate)} />
            <InfoRow label="사용자 유형" value={user.userType} />
            <InfoRow label="연동 여부" value={user.isLinked ? '연동됨' : '미연동'} />
            <InfoRow
              label="최근 활동일"
              value={user.lastActivityDate ? formatDateTime(user.lastActivityDate) : '-'}
            />
            <InfoRow label="가입일" value={formatDateTime(user.createdAt)} />
            <InfoRow label="누적 패널티 횟수" value={`${formatNumber(user.abuseCount)}회`} />
          </div>
        </Card>

        <Card className="gap-4 !rounded-[20px] border-border-muted !p-6">
          <h3 className="text-lg font-semibold text-font-main">점수 및 포인트</h3>
          <div className="grid gap-3">
            <div className="rounded-[18px] bg-primary-50 p-4">
              <p className="text-sm text-font-sub">총점</p>
              <p className="mt-2 text-3xl font-bold text-font-main">
                {formatNumber(user.totalScore)}
              </p>
            </div>
            <InfoRow label="E 점수" value={formatNumber(user.eScore)} />
            <InfoRow label="S 점수" value={formatNumber(user.sScore)} />
            <InfoRow label="G 활동 점수" value={formatNumber(user.gActivityScore)} />
            <InfoRow label="G 상환 점수" value={formatNumber(user.gRepaymentScore)} />
            <InfoRow label="보유 포인트" value={`${formatNumber(user.totalPoints)}P`} />
          </div>
        </Card>
      </section>

      <Card className="gap-4 !rounded-[20px] border-border-muted !p-6">
        <div>
          <h3 className="text-lg font-semibold text-font-main">패널티 부여</h3>
          <p className="mt-1 text-sm text-font-sub">
            기존 점수 서비스의 패널티 로직을 호출합니다. 사유를 남긴 뒤 실행하세요.
          </p>
        </div>

        <textarea
          value={penaltyReason}
          onChange={(event) => setPenaltyReason(event.target.value)}
          placeholder="패널티 사유를 입력하세요"
          className="min-h-[140px] w-full rounded-control border border-border-muted bg-white px-4 py-3 text-base text-font-main outline-none transition-colors focus:border-primary-500"
        />

        <div className="flex justify-end">
          <Button
            onClick={handleApplyPenalty}
            disabled={isSubmitting || !penaltyReason.trim()}
          >
            패널티 부여
          </Button>
        </div>
      </Card>
    </div>
  )
}

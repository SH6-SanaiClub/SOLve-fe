import type { FormEvent } from 'react'
import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { Button, Input } from '../../components/common'
import { ROUTE_PATHS } from '../../constants/routePaths'
import { adminLogin } from '../../services/adminApi'
import { useAdminAuthStore } from '../../store'
import { getApiErrorMessage } from '../../utils/admin'

interface AdminLoginLocationState {
  from?: string
}

export const AdminLoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated)
  const setAdminSession = useAdminAuthStore((state) => state.setAdminSession)
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (isAuthenticated) {
    return <Navigate replace to={ROUTE_PATHS.adminDashboard} />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await adminLogin({ loginId, password })
      setAdminSession(response.accessToken)

      const state = location.state as AdminLoginLocationState | null
      navigate(state?.from ?? ROUTE_PATHS.adminDashboard, { replace: true })
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, '관리자 로그인에 실패했습니다.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(0,70,255,0.16),_transparent_28%),linear-gradient(180deg,_#f8fbff_0%,_#f1f5f9_50%,_#e2e8f0_100%)] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-[1200px] items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[28px] border border-border-muted bg-white shadow-card lg:grid-cols-[1.1fr_0.9fr]">
          <section className="hidden bg-gray-900 px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-primary-500 shadow-card">
                <ShieldCheck size={28} />
              </div>
              <p className="mt-8 text-sm font-semibold tracking-[0.3em] text-primary-300 uppercase">
                SOLve Admin
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-tight">
                운영 데이터를
                <br />
                한 화면에서 제어합니다.
              </h1>
              <p className="mt-5 max-w-[360px] text-base leading-7 text-gray-300">
                사용자, ESG 활동, 포인트샵, 금융 상품 상태를 관리자 전용 토큰으로
                분리해 관리하는 데스크톱 콘솔입니다.
              </p>
            </div>

            <div className="rounded-[20px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-gray-300">
                이 페이지는 일반 사용자 세션과 분리된 관리자 전용 인증을 사용합니다.
              </p>
            </div>
          </section>

          <section className="px-6 py-8 sm:px-10 sm:py-12">
            <div className="mx-auto flex w-full max-w-[420px] flex-col">
              <div className="lg:hidden">
                <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-primary-500 text-white shadow-card">
                  <ShieldCheck size={24} />
                </div>
                <p className="mt-5 text-xs font-semibold tracking-[0.24em] text-primary-500 uppercase">
                  SOLve Admin
                </p>
              </div>

              <h2 className="mt-6 text-3xl font-bold tracking-tight text-font-main">
                관리자 로그인
              </h2>
              <p className="mt-3 text-sm leading-6 text-font-sub">
                발급된 관리자 계정으로 로그인한 뒤 대시보드로 이동합니다.
              </p>

              <form className="mt-10 flex flex-col gap-5" onSubmit={handleSubmit}>
                <Input
                  label="로그인 아이디"
                  placeholder="admin"
                  value={loginId}
                  onChange={(event) => setLoginId(event.target.value)}
                  autoComplete="username"
                  required
                />

                <Input
                  label="비밀번호"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  errorText={error || undefined}
                  required
                />

                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  disabled={isSubmitting || !loginId.trim() || !password.trim()}
                >
                  {isSubmitting ? '로그인 중...' : '로그인'}
                </Button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

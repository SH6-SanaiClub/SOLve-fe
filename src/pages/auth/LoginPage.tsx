import React, { useState } from 'react'
import { AxiosError } from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import logoImage from '../../assets/home/logo.png'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { ROUTE_PATHS } from '../../constants/routePaths'
import { authService } from '../../services/authService'
import { useAuthStore } from '../../store/authStore'
import { type AuthLoginRequest } from '../../types/auth'

export function LoginPage() {
  const navigate = useNavigate()
  const { setSession } = useAuthStore()
  const [loginData, setLoginData] = useState<AuthLoginRequest>({
    loginId: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await authService.login(loginData)
      setSession({
        accessToken: response.accessToken,
        user: response.user,
      })
      navigate('/')
    } catch (err) {
      if (err instanceof AxiosError) {
        const errorMessage =
          (err.response?.data as { message?: string })?.message || '로그인에 실패했습니다.'
        alert(errorMessage)
      }
    }
  }

  return (
    <div className="app-shell">
      <section className="page-card flex min-h-[calc(100vh-48px)] flex-col px-4 pt-8 pb-6">
        <div className="flex flex-1 flex-col">
          <div className="flex flex-col items-center pt-20 text-center">
            <img src={logoImage} alt="SOLve" className="mt-4 h-[56px] w-auto object-contain" />
            <h1 className="mt-5 text-[24px] leading-none font-bold tracking-[-0.03em] text-font-main">
              로그인
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="mt-12 flex flex-col gap-5">
            <Input
              label="아이디"
              name="loginId"
              value={loginData.loginId}
              onChange={handleChange}
              placeholder="아이디를 입력하세요."
              required
            />
            <Input
              label="비밀번호"
              name="password"
              type="password"
              value={loginData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요."
              required
            />

            <div className="mt-2 flex flex-col gap-3">
              <Button type="submit" variant="primary" fullWidth className="!h-[50px]">
                로그인
              </Button>
              <Link to={ROUTE_PATHS.signupAgreement}>
                <Button type="button" variant="outline" fullWidth className="!h-[50px]">
                  회원가입
                </Button>
              </Link>
            </div>
          </form>

          <button
            type="button"
            className="mt-5 text-center text-sm font-medium text-[#9AA7BA]"
          >
            아이디/비밀번호 찾기
          </button>

          <div className="mt-auto rounded-[12px] bg-[#F3F6FB] px-4 py-4">
            <p className="text-[12px] font-semibold text-font-main">부정 가입 방지 안내</p>
            <p className="mt-2 text-[12px] leading-6 text-[#6C7B91]">
              1인 1계정 원칙을 고수하여 접수 조작 및 중복 수혜를 철저히 방지하고 있습니다.
              안전한 금융 거래를 위해 협조 부탁드립니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

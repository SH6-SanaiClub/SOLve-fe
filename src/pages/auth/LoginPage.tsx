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
      <section className="page-card flex flex-col gap-4">
        <img src={logoImage} alt="SOLve" className="h-9 w-fit object-contain" />

        <div className="text-center">
          <h1 className="text-2xl font-bold text-font-main">로그인</h1>
          <p className="text-base text-font-sub">SOLve 서비스에 로그인합니다.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
          <Input
            label="아이디"
            name="loginId"
            value={loginData.loginId}
            onChange={handleChange}
            placeholder="아이디를 입력하세요"
            required
          />
          <Input
            label="비밀번호"
            name="password"
            type="password"
            value={loginData.password}
            onChange={handleChange}
            placeholder="비밀번호를 입력하세요"
            required
          />
          <Button type="submit" variant="primary" fullWidth>
            로그인
          </Button>
          <Link to={ROUTE_PATHS.signupAgreement}>
            <Button type="button" variant="outline" fullWidth>
              회원가입
            </Button>
          </Link>
        </form>

        <hr className="my-4 border-gray-200" />

        <p className="text-center text-xs leading-relaxed text-font-sub">
          부정 이용 방지를 위해 본 서비스는 가입 후 24시간 이내에는 서비스 이용이 제한될 수 있습니다.
        </p>
      </section>
    </div>
  )
}

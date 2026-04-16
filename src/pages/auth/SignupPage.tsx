import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'
import { authService } from '../../services/authService'
import { ROUTE_PATHS } from '../../constants/routePaths'
import { type AuthJoinRequest } from '../../types/auth'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import IconButton from '../../components/common/IconButton'
import { Icons } from '../../components/common/Icons'
import MainLayout from '../../components/layout/MainLayout'
import Header from '../../components/layout/Header'
import {
  clearSignupVerificationState,
  readSignupVerificationState,
} from '../../utils/signupVerificationStorage'

export function SignupPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const locationVerificationState = location.state as
    | { verificationToken?: string; preservedLoginId?: string }
    | null
  const storedVerificationState = readSignupVerificationState()
  const verificationState = locationVerificationState?.verificationToken
    ? locationVerificationState
    : storedVerificationState
  const preservedLoginId = verificationState?.preservedLoginId?.trim() ?? ''
  const isReactivationSignup = preservedLoginId.length > 0

  const [formData, setFormData] = useState<AuthJoinRequest>({
    loginId: preservedLoginId,
    password: '',
    name: '',
    email: '',
    phoneNumber: '',
    birthdate: '',
    ciDi: '',
  })
  const [isIdChecked, setIsIdChecked] = useState(false)
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [idCheckMessage, setIdCheckMessage] = useState('')
  const [idCheckColor, setIdCheckColor] = useState('')
  const isFormValid = 
      formData.loginId && 
      (isReactivationSignup || isIdChecked) && 
      formData.password && 
      formData.password === passwordConfirm && 
      formData.name && 
      formData.birthdate && 
      formData.phoneNumber && 
      formData.email;
  useEffect(() => {
    if (!verificationState?.verificationToken) {
      navigate(ROUTE_PATHS.signupAgreement, { replace: true })
    }
  }, [navigate, verificationState])

  const handleBack = () => navigate(-1)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === 'phoneNumber') {
      const onlyNums = value.replace(/[^0-9]/g, '')

      let formattedPhone = ''
      if (onlyNums.length <= 3) {
        formattedPhone = onlyNums
      } else if (onlyNums.length <= 7) {
        formattedPhone = `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`
      } else {
        formattedPhone = `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7, 11)}`
      }

      setFormData((prev) => ({ ...prev, [name]: formattedPhone }))
      return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === 'loginId') {
      setIsIdChecked(false)
      setIdCheckMessage('')
    }
  }

  const handleCheckId = async () => {
    if (!formData.loginId) {
      alert('아이디를 입력해주세요.')
      return
    }

    try {
      const isDuplicate = await authService.checkLoginId(formData.loginId)
      if (isDuplicate) {
        setIdCheckMessage('이미 사용 중인 아이디입니다.')
        setIdCheckColor('red')
        setIsIdChecked(false)
      } else {
        setIdCheckMessage('사용 가능한 아이디입니다.')
        setIdCheckColor('green')
        setIsIdChecked(true)
      }
    } catch {
      alert('중복 확인 중 오류가 발생했습니다.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isReactivationSignup && !isIdChecked) {
      alert('아이디 중복 확인을 먼저 진행해주세요.')
      return
    }
    if (formData.password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.')
      return
    }
    if (!verificationState?.verificationToken) {
      alert('본인인증 검증 정보가 없습니다. 다시 인증을 진행해주세요.')
      navigate(ROUTE_PATHS.signupAgreement, { replace: true })
      return
    }

    try {
      const requestData = {
        ...formData,
        loginId: isReactivationSignup ? preservedLoginId : formData.loginId,
        phoneNumber: formData.phoneNumber.trim(),
        ciDi: `DEV_${Date.now()}`,
        verificationToken: verificationState.verificationToken,
      }
      await authService.signup(requestData)
      clearSignupVerificationState()
      navigate(ROUTE_PATHS.signupComplete)
    } catch (err) {
      if (err instanceof AxiosError) {
        const errorMessage =
          (err.response?.data as { message?: string })?.message || '가입 중 오류가 발생했습니다.'
        alert(errorMessage)
      } else {
        alert('알 수 없는 오류가 발생했습니다.')
      }
    }
  }

  return (
    <MainLayout
      header={
        <Header
          left={
            <IconButton
              label="뒤로가기"
              icon={<Icons.Back className="text-font-main" />}
              onClick={handleBack}
            />
          }
          title="회원가입"
        />
      }
    >
      <div className="flex flex-col gap-6 pb-[140px] pt-6">
        <div className="pt-2">
          <h2 className="mb-2 text-base font-semibold text-font-main">기본 정보를 입력해주세요</h2>
          <p className="text-xs text-font-sub">
            {isReactivationSignup
              ? '재가입시 기존 아이디가 그대로 유지됩니다.'
              : '본인인증이 완료되었습니다. 회원가입 정보를 직접 입력해주세요.'}
          </p>
        </div>

        <form id="signup-form"onSubmit={handleSubmit} className="flex flex-col gap-5">
          {isReactivationSignup ? (
            <div className="rounded-control border border-primary-100 bg-primary-50 px-4 py-4">
              <p className="text-xs font-medium text-primary-600">기존 아이디</p>
              <p className="mt-1 text-sm font-semibold text-font-main">{preservedLoginId}</p>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="flex items-start gap-2">
                <div className="relative flex min-w-0 flex-1 flex-col">
                  <Input
                    label="아이디"
                    name="loginId"
                    value={formData.loginId}
                    onChange={handleChange}
                    placeholder="아이디를 입력하세요"
                    className="w-full"
                    required
                  />

                  {idCheckMessage && (
                    <p 
          className="absolute -bottom-5 right-0 text-[11px] font-medium" 
          style={{ color: idCheckColor }}
        >
                      {idCheckColor === 'green' ? '✓' : '✕'} {idCheckMessage}
                    </p>
                  )}
                </div>

                <div className="shrink-0 pt-6.5">
                  <Button type="button" onClick={handleCheckId} variant="sub" className="w-[100px] text-sm">
                    중복확인
                  </Button>
                </div>
              </div>
            </div>
          )}

          <Input
            label="비밀번호"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호를 입력하세요"
            required
          />

          <Input
            label="비밀번호 확인"
            name="passwordConfirm"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="비밀번호를 한 번 더 입력해주세요"
            required
          />

          <Input label="이름" name="name" value={formData.name} onChange={handleChange} placeholder="이름을 입력하세요" required />

          <Input
            label="생년월일"
            name="birthdate"
            type="date"
            value={formData.birthdate}
            onChange={handleChange}
            placeholder="YYYY-MM-DD"
            className="w-full appearance-none bg-transparent outline-none min-w-0" 
            required
          />

          <Input
            label="전화번호"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="010-0000-0000"
            required
          />

          <Input
            label="이메일"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="이메일을 입력하세요"
            required
          />
        </form>
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50">
  <div className="pointer-events-auto mx-auto w-full max-w-[600px] border-t border-gray-200 bg-white px-(--side-padding) pb-[calc(16px+env(safe-area-inset-bottom))] pt-4 shadow-[var(--shadow-card)]">
    <Button
      form="signup-form" // form id와 연결하여 밖에서도 submit 가능하게 함
      type="submit"
      variant="primary"
      size="md"
      fullWidth
      className="!h-[56px]"
      disabled={!isFormValid}
    >
      완료
    </Button>
  </div>
</div>
        </div>
    </MainLayout>
  )
}

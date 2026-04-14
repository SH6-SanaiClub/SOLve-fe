import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Button from '../../components/common/Button'
import Checkbox from '../../components/common/Checkbox'
import IconButton from '../../components/common/IconButton'
import { Icons } from '../../components/common/Icons'
import { ROUTE_PATHS } from '../../constants/routePaths'
import { identityVerificationService } from '../../services/identityVerificationService'
import MainLayout from '../../components/layout/MainLayout'
import Header from '../../components/layout/Header'

const agreementItems = [
  { key: 'terms', label: '[필수] 서비스 이용약관', required: true },
  { key: 'privacy', label: '[필수] 개인정보 수집 및 이용 동의', required: true },
  { key: 'credit', label: '[필수] 개인정보 및 이용정보 제공 동의', required: true },
  { key: 'lookup', label: '[필수] 개인정보 및 이용정보 조회 동의', required: true },
  { key: 'marketing', label: '[선택] 마케팅 정보 수신 동의', required: false },
]

export function SignupAgreementPage() {
  const navigate = useNavigate()
  const [isVerifying, setIsVerifying] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [checked, setChecked] = useState<Record<string, boolean>>({
    terms: false,
    privacy: false,
    credit: false,
    lookup: false,
    marketing: false,
  })

  const allRequiredChecked = agreementItems
    .filter((item) => item.required)
    .every((item) => checked[item.key])

  const allChecked = agreementItems.every((item) => checked[item.key])

  const toggleAll = (value: boolean) => {
    const next = agreementItems.reduce((acc, item) => {
      acc[item.key] = value
      return acc
    }, {} as Record<string, boolean>)
    setChecked(next)
  }

  const handleCheckbox = (key: string, value: boolean) => {
    setChecked((prev) => ({ ...prev, [key]: value }))
  }

  const handleBack = () => {
    navigate(-1)
  }

  const getAlertMessage = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const serverMessage = (error.response?.data as { message?: string } | undefined)?.message?.trim()
      return serverMessage || '본인인증 처리 중 오류가 발생했습니다.'
    }

    if (error instanceof Error) {
      const message = error.message.trim()
      if (message && !message.includes('localhost') && !message.includes('5173')) {
        return message
      }
    }

    return '본인인증 처리 중 오류가 발생했습니다.'
  }

  const handleStartVerification = async () => {
    if (!allRequiredChecked || isVerifying) return

    setIsVerifying(true)
    setErrorMessage('')

    try {
      const verifyResult = await identityVerificationService.verify()

      if (!verifyResult.verified) {
        throw new Error('본인인증 검증에 실패했습니다.')
      }
      if (!verifyResult.verificationToken) {
        throw new Error('본인인증 토큰을 받지 못했습니다.')
      }

      navigate(ROUTE_PATHS.signup, {
        state: {
          verificationToken: verifyResult.verificationToken,
          preservedLoginId: verifyResult.preservedLoginId,
        },
      })
    } catch (error) {
      setErrorMessage(getAlertMessage(error))
    } finally {
      setIsVerifying(false)
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
      <section className="flex flex-col gap-6">
        <div>
          <h2 className="mt-4 text-lg font-semibold text-font-main">
            안전한 금융 생활을 위해 약관에 동의해주세요
          </h2>
          <p className="mt-1 text-sm text-font-sub">서비스 이용을 위한 필수 약관입니다.</p>
        </div>

        <div className="flex flex-col gap-2 px-2">
          <div className="rounded-lg border bg-white p-3">
            <Checkbox
              label="전체 동의하기"
              description="필수 및 선택 약관에 모두 동의합니다"
              checked={allChecked}
              onChange={(e) => toggleAll(e.target.checked)}
            />
          </div>

          {agreementItems.map((item) => (
            <div key={item.key} className="rounded-lg border bg-white p-3">
              <Checkbox
                label={item.label}
                description={item.required ? '필수' : '선택'}
                checked={Boolean(checked[item.key])}
                onChange={(e) => handleCheckbox(item.key, e.target.checked)}
              />
            </div>
          ))}

          <p className="pt-2 text-xs text-font-sub">
            SOLve는 고객님의 개인정보를 최신 보호 기술로 안전하게 관리하며, 동의받지 않은 목적으로는 사용하지 않습니다.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          fullWidth
          disabled={!allRequiredChecked || isVerifying}
          onClick={handleStartVerification}
        >
          {isVerifying ? '인증 확인 중...' : '본인인증 시작'}
        </Button>
      </section>

      {errorMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-6">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
            <p className="text-center text-sm font-medium text-font-main">{errorMessage}</p>
            <Button
              type="button"
              variant="primary"
              fullWidth
              className="mt-5"
              onClick={() => setErrorMessage('')}
            >
              확인
            </Button>
          </div>
        </div>
      )}
    </MainLayout>
  )
}

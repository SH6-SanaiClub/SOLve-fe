import { useState } from 'react'
import axios from 'axios'
import { ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'
import Checkbox from '../../components/common/Checkbox'
import IconButton from '../../components/common/IconButton'
import { Icons } from '../../components/common/Icons'
import Header from '../../components/layout/Header'
import MainLayout from '../../components/layout/MainLayout'
import { ROUTE_PATHS } from '../../constants/routePaths'
import { identityVerificationService } from '../../services/identityVerificationService'

interface AgreementItem {
  key: string
  label: string
  required: boolean
  summary: string
  sections: Array<{
    title: string
    body: string[]
  }>
}

const agreementItems: AgreementItem[] = [
  {
    key: 'terms',
    label: '서비스 이용약관',
    required: true,
    summary: 'SOLve 서비스 이용을 위한 기본적인 권리와 의무를 규정합니다.',
    sections: [
      {
        title: '제1조 목적',
        body: [
          '본 약관은 신한 SOLve(이하 "회사")가 제공하는 금융 교육 퀴즈, ESG 활동 기록 및 리워드 서비스(이하 "서비스")를 이용함에 있어 회사와 회원의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.',
        ],
      },
      {
        title: '제2조 (용어의 정의)',
        body: [
          '"회원"이란 본 약관에 동의하고 가입 절차를 마친 이용자를 의미합니다.',
          '"리워드"란 서비스 내 활동을 통해 적립되는 포인트 및 혜택을 의미합니다.',
        ],
      },
      {
        title: '제3조 (약관의 효력 및 변경)',
        body: [
          '본 약관은 서비스 화면에 게시하거나 전자우편 등의 방법으로 회원에게 공지함으로써 효력이 발생합니다.',
          '회사는 관계 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있으며, 변경 시 적용 일자 7일 전부터 공지합니다.',
        ],
      },
    ],
  },
  {
    key: 'privacy',
    label: '개인정보 수집 및 이용 동의',
    required: true,
    summary: '회원가입 및 서비스 제공에 필요한 개인정보 처리 방침입니다.',
    sections: [
      {
        title: '1. 개인정보 수집 항목',
        body: [
          '필수 항목: 성명, 생년월일, 성별, 아이디, 비밀번호, 휴대전화번호, CI(연계정보)/DI(중복가입확인정보).',
          '자동 수집 항목: IP주소, 쿠키, 방문 일시, 서비스 이용 기록, 기기 정보.',
        ],
      },
      {
        title: '이용 목적',
        body: [
          '회원 식별, 본인 확인, 부정 이용 방지, 고객 문의 대응, 서비스 제공 및 맞춤형 콘텐츠 제공에 이용됩니다.',
          '금융 퀴즈 참여, ESG 활동 관리, 리워드 제공 및 이용 내역 안내를 위해 필요한 범위 내에서만 활용됩니다.',
        ],
      },
      {
        title: '2. 개인정보 이용 목적',
        body: [
          '회원 가입 의사 확인, 본인 식별 및 인증, 회원 자격 유지 관리.',
          '금융 퀴즈 제공, ESG 활동 점수 산출, 포인트 지급 및 사용 내역 관리.',
          '신규 서비스 개발 및 인구통계학적 특성에 따른 서비스 최적화.',
        ],
      },
      {
        title: '3. 보유 및 이용 기간',
        body: [
          '회원 탈퇴 시까지 보관하며, 탈퇴 후에는 관계 법령에 따라 5년간(전자상거래법 등) 보존 후 지체 없이 파기합니다.',
        ],
      },
    ],
  },
  {
    key: 'credit',
    label: '개인정보 제3자 제공 동의',
    required: true,
    summary: '리워드 지급 및 서비스 연계를 위한 정보 공유 동의입니다.',
    sections: [
      {
        title: '1. 제공받는 자',
        body: [
          '신한금융지주 계열사 및 서비스 연계 제휴사.',
        ],
      },
      {
        title: '2. 제공 목적',
        body: [
          '통합 포인트 연계 서비스 제공, 그룹사 공동 이벤트 참여 및 리워드 정산 처리.',
        ],
      },
      {
        title: '3. 제공 항목',
        body: [
          '성명, 휴대전화번호, 가입일자, 포인트 적립 및 사용 실적.',
        ],
      },
      {
        title: '4. 보유 기간',
        body: [
          '서비스 종료 시 또는 제3자 제공 목적 달성 시까지.',
        ],
      },
    ],
  },
  {
    key: 'lookup',
    label: '본인확인 서비스 이용 동의',
    required: true,
    summary: '안전한 거래를 위한 본인확인기관 정보 조회 동의입니다.',
    sections: [
      {
        title: '1. 이용 목적',
        body: [
          '본인확인기관(통신사, NICE평가정보 등)을 통한 실명 확인 및 본인 인증.',
          '타인 명의 도용 방지 및 서비스 보안 강화.',
        ],
      },
      {
        title: '2. 조회 범위',
        body: [
          '성명, 생년월일, 성별, 내/외국인 여부, 휴대전화번호, 통신사 정보.',
        ],
      },
      {
        title: '3. 보관 및 파기',
        body: [
          '본인확인 시점에 즉시 폐기하는 것을 원칙으로 하되, 법령에 따른 증적 보유가 필요한 경우 별도 보관합니다.',
        ],
      },
    ],
  },
  {
    key: 'marketing',
    label: '마케팅 정보 수신 동의',
    required: false,
    summary: '맞춤 혜택과 이벤트 소식을 가장 먼저 받아보실 수 있습니다.',
    sections: [
      {
        title: '1. 수신 목적',
        body: [
          '금융 퀴즈 챌린지, ESG 캠페인 안내, 신규 금융 상품 정보 및 이벤트 혜택 제공.',
        ],
      },
      {
        title: '2. 수신 채널',
        body: [
          '앱 푸시(Push), 알림톡, SMS, 이메일.',
        ],
      },
      {
        title: '3. 동의 거부권',
        body: [
          '귀하는 본 동의를 거부할 권리가 있으며, 거부 시에도 필수 서비스 이용에는 제한이 없으나 이벤트 혜택 안내가 제한될 수 있습니다.',
        ],
      },
    ],
  },
]

export function SignupAgreementDetailPage() {
  const navigate = useNavigate()
  const [isVerifying, setIsVerifying] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [expandedKey, setExpandedKey] = useState<string | null>(null)
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

  const toggleExpanded = (key: string) => {
    setExpandedKey((prev) => (prev === key ? null : key))
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
      const verifyResult = await identityVerificationService.startSignupVerification()

      if ('redirected' in verifyResult) {
        return
      }

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
              onClick={() => navigate(-1)}
            />
          }
          title="회원가입"
        />
      }
    >
      <section className="flex flex-col gap-6 pb-28">
        <div>
          <h2 className="mt-4 text-lg font-semibold text-font-main">
            안전한 금융 생활을 위해 약관에 동의해주세요
          </h2>
          <p className="mt-1 text-sm text-font-sub">
            각 항목을 눌러 상세 내용을 확인한 뒤 동의할 수 있어요.
          </p>
        </div>

        <div className="flex flex-col gap-3 px-1">
          <div className="rounded-control border border-primary-100 bg-primary-50 p-4">
            <Checkbox
              label="전체 동의하기"
              description="필수 및 선택 약관에 모두 동의합니다."
              checked={allChecked}
              onChange={(e) => toggleAll(e.target.checked)}
            />
          </div>

          {agreementItems.map((item) => {
            const isExpanded = expandedKey === item.key

            return (
              <div key={item.key} className="overflow-hidden rounded-control border border-gray-200 bg-white">
                <div className="px-4 pt-4 pb-3">
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <Checkbox
                        label={
                          <span className="flex items-center gap-2">
                            <span>{item.label}</span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                item.required
                                  ? 'bg-[#E8F0FF] text-primary-500'
                                  : 'bg-gray-100 text-gray-500'
                              }`}
                            >
                              {item.required ? '필수' : '선택'}
                            </span>
                          </span>
                        }
                        description={item.summary}
                        checked={Boolean(checked[item.key])}
                        onChange={(e) => handleCheckbox(item.key, e.target.checked)}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleExpanded(item.key)}
                      className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50"
                      aria-label={`${item.label} 상세 ${isExpanded ? '닫기' : '열기'}`}
                    >
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>
                </div>

                {isExpanded ? (
                  <div className="border-t border-gray-100 bg-[#F8FAFC] px-4 py-4">
                    <div className="space-y-4">
                      {item.sections.map((section) => (
                        <div key={section.title}>
                          <h3 className="text-sm font-semibold text-font-main">{section.title}</h3>
                          <div className="mt-2 space-y-2">
                            {section.body.map((paragraph) => (
                              <p key={paragraph} className="text-[13px] leading-6 text-gray-600">
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )
          })}

        </div>
      </section>

      <div className="fixed bottom-0 left-1/2 z-10 w-full max-w-[600px] -translate-x-1/2 bg-bg-light px-6 pt-4 pb-[calc(env(safe-area-inset-bottom)+16px)]">
        <Button
          type="button"
          variant="primary"
          fullWidth
          disabled={!allRequiredChecked || isVerifying}
          onClick={handleStartVerification}
        >
          {isVerifying ? '인증 확인 중...' : '본인인증 시작'}
        </Button>
      </div>

      {errorMessage ? (
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
      ) : null}
    </MainLayout>
  )
}

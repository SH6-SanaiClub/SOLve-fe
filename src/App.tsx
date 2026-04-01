import { type ChangeEvent, useState } from 'react'
import {
  Badge,
  Button,
  Card,
  Checkbox,
  IconButton,
  Icons,
  InfoRow,
  Input,
  ProgressBar,
  Radio,
  SectionHeader,
  SelectableCard,
  Tabs,
} from './components/common'
import BottomNavigation from './components/layout/BottomNavigation'
import Header from './components/layout/Header'
import MainLayout from './components/layout/MainLayout'

const tabItems = [
  { label: '기부', value: 'donation' },
  { label: '가치가게', value: 'store' },
  { label: '봉사', value: 'volunteer' },
]

function App() {
  const [tab, setTab] = useState('donation')
  const [agreed, setAgreed] = useState(true)
  const [payment, setPayment] = useState('card')
  const [selectedMethod, setSelectedMethod] = useState('card')
  const [userId, setUserId] = useState('')
  const [isUserIdChecked, setIsUserIdChecked] = useState(false)

  const handleUserIdChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserId(event.target.value)
    setIsUserIdChecked(false)
  }

  return (
    <MainLayout
      header={
        <Header
          bgColor="bg-bg-light"
          left={<span className="text-sh-main text-[20px] font-bold">SOLVE</span>}
          right={
            <div className="flex items-center gap-2">
              <IconButton label="채팅 열기" icon={<Icons.Chat />} />
              <IconButton label="메뉴 열기" icon={<Icons.Menu />} />
            </div>
          }
        />
      }
      nav={<BottomNavigation />}
    >
      <Card>
        <SectionHeader title="공통 컴포넌트 미리보기" meta="피그마 기준 샘플" />
        <p className="mt-2 text-sm leading-6 text-font-sub">
          화면에서 반복되는 기본 컴포넌트만 모아둔 확인용 페이지.
        </p>
      </Card>

      <Card title="Buttons">
        <div className="flex flex-col gap-3">
          <Button variant="primary" fullWidth>
            메인 버튼
          </Button>
          <Button variant="outline" fullWidth>
            아웃라인 버튼
          </Button>
          <div className="flex gap-3">
            <Button variant="sub" className="flex-1">
              보조 버튼
            </Button>
            <Button variant="gray" className="flex-1" disabled>
              비활성 버튼
            </Button>
          </div>

          <div className="pt-2">
            <SectionHeader title="헤더 아이콘 버튼" className="mb-3" />
            <div className="flex items-center gap-2">
              <IconButton label="뒤로가기" icon={<Icons.Back />} />
              <IconButton label="채팅 열기" icon={<Icons.Chat />} />
              <IconButton label="메뉴 열기" icon={<Icons.Menu />} />
            </div>
          </div>
        </div>
      </Card>

      <Card title="Tabs / Badge / Progress">
        <div className="flex flex-col gap-4">
          <Tabs items={tabItems} value={tab} onChange={setTab} />

          <div className="flex flex-wrap gap-2">
            <Badge>친환경</Badge>
            <Badge tone="neutral">포인트 사용</Badge>
            <Badge tone="success">+50P</Badge>
          </div>

          <div className="flex flex-col gap-2">
            <InfoRow label="이번주 활동 달성률" value="85%" valueClassName="text-primary-500" />
            <ProgressBar value={85} />
          </div>
        </div>
      </Card>

      <Card title="Inputs">
        <div className="flex flex-col gap-4">
          <Input
            label="아이디"
            placeholder="아이디를 입력해주세요."
            value={userId}
            onChange={handleUserIdChange}
            isVerified={isUserIdChecked}
            helperText={
              isUserIdChecked
                ? '아이디 중복 확인이 완료되었습니다.'
                : '중복 확인이나 비밀번호 일치 같은 검증이 끝나면 체크 상태를 표시할 수 있어요.'
            }
          />
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsUserIdChecked(Boolean(userId.trim()))}
            >
              중복 확인 성공 예시
            </Button>
          </div>

          <Input
            type="email"
            label="이메일"
            requiredMark
            placeholder="solve@shinhan.com"
            helperText="주로 사용하는 이메일을 입력해주세요."
          />

          <Input
            label="휴대폰 번호"
            placeholder="010-0000-0000"
            errorText="올바른 휴대폰 번호 형식을 입력해주세요."
          />
        </div>
      </Card>

      <Card title="Selection Controls">
        <div className="flex flex-col gap-4">
          <Checkbox
            label="전체 동의"
            description="서비스 이용약관, 개인정보 처리방침에 동의합니다."
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
          />

          <div className="rounded-control border border-gray-200 p-4">
            <SectionHeader title="결제 수단" className="mb-3" />
            <div className="flex flex-col gap-3">
              <Radio
                name="payment"
                value="card"
                label="신용/체크카드"
                checked={payment === 'card'}
                onChange={(event) => setPayment(event.target.value)}
              />
              <Radio
                name="payment"
                value="solpay"
                label="SOL Pay"
                checked={payment === 'solpay'}
                onChange={(event) => setPayment(event.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <SelectableCard
              title="신용/체크카드"
              description="대표 결제 수단"
              leading={<Badge variant="soft">CARD</Badge>}
              selected={selectedMethod === 'card'}
              onClick={() => setSelectedMethod('card')}
            />
            <SelectableCard
              title="SOL Pay"
              description="간편 결제 사용"
              leading={<Badge tone="neutral">PAY</Badge>}
              selected={selectedMethod === 'solpay'}
              onClick={() => setSelectedMethod('solpay')}
            />
          </div>
        </div>
      </Card>

      <Card title="Section / Info Rows">
        <div className="flex flex-col gap-4">
          <SectionHeader title="구매 상세" meta="주문번호 #1024" />
          <div className="flex flex-col gap-3">
            <InfoRow label="결제 금액" value="6,500원" />
            <InfoRow label="적립 예정 포인트" value="+50P" valueClassName="text-primary-500" />
            <InfoRow label="배송비" value="무료" />
          </div>
        </div>
      </Card>
    </MainLayout>
  )
}

export default App

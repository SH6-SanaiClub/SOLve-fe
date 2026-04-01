// import { useEffect, useState } from 'react'
import { ArrowRightIcon } from 'lucide-react'
import Card from './components/common/Card'
import { Icons } from './components/common/Icons'
import Input from './components/common/Input'
import BottomNavigation from './components/layout/BottomNavigation'
import Header from './components/layout/Header'
import MainLayout from './components/layout/MainLayout'
import Button from './components/common/Button'

// interface Item {
//   id: number
//   name: string
//   description: string
// }

function App() {
  // const [items, setItems] = useState<Item[]>([])

  // useEffect(() => {
  //   fetch('/api/test')
  //     .then(res => res.json())
  //     .then(data => setItems(data))
  //     .catch(err => console.error(err))
  // }, [])

  return (
    <MainLayout
      header={<Header bgColor="bg-bg-light" left={<span className="text-sh-main font-bold text-[20px]">SOLVE</span>}
        right={
          <div className="flex gap-4">
            <Icons.Chat className="text-font-main" />
            <Icons.Menu className="text-font-main" />
          </div>
        } />}
      nav={<BottomNavigation />}
    >

      <Card>
        <p className="text-font-main text-base">
          카드 내부에 들어갈 텍스트나 다른 컴포넌트들을 여기에 자유롭게 넣으세요.
        </p>
      </Card>

      <Card
        className="border border-primary-500 bg-primary-50 p-[24px]"
        onClick={() => alert('ESG 상세 페이지로 이동!')}>
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-semibold text-primary-500 mb-1 block">
              이달의 활동
            </span>
            <h3 className="text-xl font-bold text-font-main">
              나의 ESG 활동 내역
            </h3>
          </div>

          {/* 우측 아이콘 포인트 */}
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
            <ArrowRightIcon className="text-primary-500" />
          </div>
        </div>
      </Card>

      <Card title="이번 달 사용 내역">
        <div className="flex justify-between items-center">
          <span>교통비</span>
          <span className="font-medium">50,000원</span>
        </div>
      </Card>

      <Button variant="primary" fullWidth>확인</Button>
      <Button variant="outline" fullWidth>회원가입</Button>

      <div className="flex gap-3 w-full mt-auto">
        <Button
          variant="sub"
          className="flex-1"
          onClick={() => console.log('적금 확인 페이지로!')}
        >
          내 적금 확인하기
        </Button>
        <Button
          variant="primary"
          className="flex-1"
          onClick={() => console.log('메인으로!')}
        >
          메인으로 가기
        </Button>
      </div>

      <Button variant="primary" disabled>구매하기</Button>

      <Card className="p-0 bg-primary-50">
        <div className="p-4">내용...</div>
      </Card>

      <Input
        label="이름"
        placeholder="이름을 입력해주세요."
      />

      {/* 필수 표시 + 힌트 상태 */}
      <Input
        type="email"
        label="이메일"
        requiredMark
        placeholder="solve@shinhan.com"
        helperText="주로 사용하는 이메일을 입력하세요."
      />

      {/* 에러 상태 */}
      <Input
        label="전화번호"
        placeholder="010-0000-0000"
        errorText="올바른 전화번호 형식이 아닙니다."
      />

      {/* 비활성화 상태 */}
      <Input
        isVerified={true}
      />

    </MainLayout>
  )
}

export default App
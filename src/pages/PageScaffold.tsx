import { Card, InfoRow, SectionHeader } from '../components/common'
import { AppPageLayout } from './AppPageLayout'

interface PageScaffoldProps {
  title: string
  description: string
  currentTab?: 'home' | 'benefits' | 'finance' | 'mypage'
}

export function PageScaffold({ title, description, currentTab = 'home' }: PageScaffoldProps) {
  return (
    <AppPageLayout title={title} currentTab={currentTab}>
      <Card>
        <SectionHeader title={title} meta="초기 인프라 연결 완료" />
        <p className="mt-2 text-sm leading-6 text-font-sub">{description}</p>
      </Card>

      <Card title="현재 상태">
        <div className="flex flex-col gap-3">
          <InfoRow label="라우팅" value="연결됨" valueClassName="text-primary-500" />
          <InfoRow label="PWA" value="기본 적용" />
          <InfoRow label="전역 상태" value="Zustand 준비" />
          <InfoRow label="API 클라이언트" value="Axios 준비" />
        </div>
      </Card>
    </AppPageLayout>
  )
}

import { Card, SectionHeader } from '../components/common'
import { AppPageLayout } from './AppPageLayout'

export function NotFoundPage() {
  return (
    <AppPageLayout title="페이지 없음" currentTab="home">
      <Card>
        <SectionHeader title="페이지를 찾을 수 없습니다" />
        <p className="mt-2 text-sm leading-6 text-font-sub">
          라우팅은 준비되어 있지만, 요청한 경로는 아직 연결되지 않았습니다.
        </p>
      </Card>
    </AppPageLayout>
  )
}

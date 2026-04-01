import { PageScaffold } from '../PageScaffold'

export function ActivitiesPage() {
  return (
    <PageScaffold
      title="S 활동"
      description="활동 카테고리 진입점입니다. 세부 카테고리는 하위 라우트로 분리합니다."
      currentTab="benefits"
    />
  )
}

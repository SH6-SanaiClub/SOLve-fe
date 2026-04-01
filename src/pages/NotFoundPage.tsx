import { Link } from 'react-router-dom'
import { PageScaffold } from './PageScaffold'
import { ROUTE_PATHS } from '../constants/routePaths'

export function NotFoundPage() {
  return (
    <PageScaffold
      title="페이지를 찾을 수 없습니다"
      description="라우팅 설정은 준비되어 있지만, 요청한 경로는 아직 연결되지 않았습니다."
    >
      <Link className="text-sm font-semibold text-primary-500" to={ROUTE_PATHS.home}>
        메인으로 이동
      </Link>
    </PageScaffold>
  )
}

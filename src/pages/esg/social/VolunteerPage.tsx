import { useNavigate } from 'react-router-dom'
import { IconButton } from '../../../components/common'
import { Icons } from '../../../components/common'
import Header from '../../../components/layout/Header'
import MainLayout from '../../../components/layout/MainLayout'
import { ROUTE_PATHS } from '../../../constants/routePaths'
import { SocialActivityTabs } from './components/SocialActivityTabs'

export function VolunteerPage() {
  const navigate = useNavigate()

  return (
    <MainLayout
      header={
        <Header
          left={
            <IconButton
              label="뒤로가기"
              icon={<Icons.Back className="text-font-main" />}
              onClick={() => navigate(ROUTE_PATHS.home)}
            />
          }
          title="S 활동"
        />
      }
    >
      <SocialActivityTabs activeTab="volunteer" />
    </MainLayout>
  )
}

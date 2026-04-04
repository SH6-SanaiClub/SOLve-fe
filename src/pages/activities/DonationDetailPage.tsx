import { useNavigate } from 'react-router-dom'
import { IconButton } from '../../components/common'
import { Icons } from '../../components/common'
import Header from '../../components/layout/Header'
import MainLayout from '../../components/layout/MainLayout'

export function DonationDetailPage() {
  const navigate = useNavigate()

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
          title="기부"
        />
      }
      className="bg-gray-50"
    >
      <section className="mx-[-16px] min-h-[calc(100vh-var(--header-h)-48px)] bg-gray-50" />
    </MainLayout>
  )
}

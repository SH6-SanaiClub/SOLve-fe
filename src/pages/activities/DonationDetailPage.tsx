import { useNavigate, useParams } from 'react-router-dom'
import { IconButton } from '../../components/common'
import { Icons } from '../../components/common'
import Header from '../../components/layout/Header'
import MainLayout from '../../components/layout/MainLayout'

export function DonationDetailPage() {
  const navigate = useNavigate()
  const { donationId } = useParams()

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
    >
      <section className="pt-2">
        <div className="rounded-card bg-white p-6 shadow-card">
          <h2 className="text-lg font-semibold text-font-main">기부 상세페이지</h2>
          <p className="mt-2 text-sm leading-6 text-font-sub">donationId: {donationId}</p>
        </div>
      </section>
    </MainLayout>
  )
}

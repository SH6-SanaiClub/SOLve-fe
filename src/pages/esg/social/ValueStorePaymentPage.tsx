import { useNavigate, useParams } from 'react-router-dom'
import { IconButton } from '../../../components/common'
import { Icons } from '../../../components/common'
import Header from '../../../components/layout/Header'
import MainLayout from '../../../components/layout/MainLayout'
import {
  ROUTE_PATHS,
  getValueStoreProductDetailPath,
} from '../../../constants/routePaths'

export function ValueStorePaymentPage() {
  const navigate = useNavigate()
  const { productId } = useParams()

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    if (productId) {
      navigate(getValueStoreProductDetailPath(productId))
      return
    }

    navigate(ROUTE_PATHS.activitySocialStore)
  }

  return (
    <MainLayout
      header={
        <Header
          left={
            <IconButton
              label="뒤로가기"
              icon={<Icons.Back className="text-font-main" />}
              onClick={handleBack}
            />
          }
          title="가치가게"
        />
      }
      className="bg-gray-50"
    >
      <section className="mx-[-16px] min-h-[calc(100vh-var(--header-h)-48px)] bg-gray-50" />
    </MainLayout>
  )
}

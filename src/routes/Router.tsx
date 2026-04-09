import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  type Location,
} from 'react-router-dom'
import { ROUTE_PATHS } from '../constants/routePaths'
import { GovernancePage } from '../pages/activities/GovernancePage'
import { DonationDetailPage } from '../pages/activities/DonationDetailPage'
import { DonationPage } from '../pages/activities/DonationPage'
import { SocialPage } from '../pages/activities/SocialPage'
import { ValueStoreDetailPage } from '../pages/activities/ValueStoreDetailPage'
import { ValueStorePage } from '../pages/activities/ValueStorePage'
import { LoginPage } from '../pages/auth/LoginPage'
import { OnboardingPage } from '../pages/auth/OnboardingPage'
import { SignupPage } from '../pages/auth/SignupPage'
import { ChatbotPage } from '../pages/chatbot/ChatbotPage'
import { FinanceApplyPage } from '../pages/finance/FinanceApplyPage'
import { FinanceDetailPage } from '../pages/finance/FinanceDetailPage'
import { FinanceDonePage } from '../pages/finance/FinanceDonePage'
import { FinancePage } from '../pages/finance/FinancePage'
import { HomePage } from '../pages/home/HomePage'
import { MyFinancePage } from '../pages/my/MyFinancePage'
import { MyGradePage } from '../pages/my/MyGradePage'
import { MyHistoryPage } from '../pages/my/MyHistoryPage'
import { MyPointManagePage } from '../pages/my/MyPointManagePage'
import { MyProfilePage } from '../pages/my/MyProfilePage'
import { MyReportPage } from '../pages/my/MyReportPage'
import { MyPage } from '../pages/my/MyPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { EnvironmentEntryModalRoute } from '../pages/esg/env/EnvironmentEntryModalRoute'
import { EnvironmentEntryPage } from '../pages/esg/env/EnvironmentEntryPage'
import { EnvironmentVerifyPage } from '../pages/esg/env/EnvironmentVerifyPage'
import { ShopHistoryPage } from '../pages/shop/ShopHistoryPage'
import { ShopListPage } from '../pages/shop/ShopListPage'
import { ShopProductDetailPage } from '../pages/shop/ShopProductDetailPage'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicOnlyRoute } from './PublicOnlyRoute'

interface RouterLocationState {
  backgroundLocation?: Location
}

function AppRoutes() {
  const location = useLocation()
  const routeState = location.state as RouterLocationState | undefined

  return (
    <>
      <Routes location={routeState?.backgroundLocation ?? location}>
        <Route path={ROUTE_PATHS.root} element={<Navigate replace to={ROUTE_PATHS.home} />} />

        <Route element={<PublicOnlyRoute />}>
          <Route path={ROUTE_PATHS.login} element={<LoginPage />} />
          <Route path={ROUTE_PATHS.signup} element={<SignupPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path={ROUTE_PATHS.onboarding} element={<OnboardingPage />} />
          <Route path={ROUTE_PATHS.home} element={<HomePage />} />
          <Route path={ROUTE_PATHS.shop} element={<ShopListPage />} />
          <Route path={ROUTE_PATHS.shopHistory} element={<ShopHistoryPage />} />
          <Route path={ROUTE_PATHS.shopDetail} element={<ShopProductDetailPage />} />
          <Route path={ROUTE_PATHS.esgEnv} element={<EnvironmentEntryPage />} />
          <Route path={ROUTE_PATHS.activityEnvironment} element={<EnvironmentEntryPage />} />
          <Route path={ROUTE_PATHS.esgEnvVerify} element={<EnvironmentVerifyPage />} />
          <Route path={ROUTE_PATHS.esgSocial} element={<SocialPage />} />
          <Route path={ROUTE_PATHS.activitySocial} element={<SocialPage />} />
          <Route path={ROUTE_PATHS.esgSocialDonation} element={<DonationPage />} />
          <Route path={ROUTE_PATHS.activitySocialDonation} element={<DonationPage />} />
          <Route path={ROUTE_PATHS.activitySocialStore} element={<ValueStorePage />} />
          <Route
            path={ROUTE_PATHS.activitySocialProductDetail}
            element={<ValueStoreDetailPage />}
          />
          <Route path={ROUTE_PATHS.donationDetail} element={<DonationDetailPage />} />
          <Route path={ROUTE_PATHS.esgQuiz} element={<GovernancePage />} />
          <Route path={ROUTE_PATHS.activityGovernance} element={<GovernancePage />} />
          <Route path={ROUTE_PATHS.financeDone} element={<FinanceDonePage />} />
          <Route path={ROUTE_PATHS.financeApply} element={<FinanceApplyPage />} />
          <Route path={ROUTE_PATHS.financeDetail} element={<FinanceDetailPage />} />
          <Route path={ROUTE_PATHS.finance} element={<FinancePage />} />
          <Route path={ROUTE_PATHS.my} element={<MyPage />} />
          <Route path={ROUTE_PATHS.myProfile} element={<MyProfilePage />} />
          <Route path={ROUTE_PATHS.myGrade} element={<MyGradePage />} />
          <Route path={ROUTE_PATHS.myHistory} element={<MyHistoryPage />} />
          <Route path={ROUTE_PATHS.myFinance} element={<MyFinancePage />} />
          <Route path={ROUTE_PATHS.myPointManage} element={<MyPointManagePage />} />
          <Route path={ROUTE_PATHS.myReport} element={<MyReportPage />} />
          <Route path={ROUTE_PATHS.chatbot} element={<ChatbotPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {routeState?.backgroundLocation ? (
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path={ROUTE_PATHS.esgEnv} element={<EnvironmentEntryModalRoute />} />
          </Route>
        </Routes>
      ) : null}
    </>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

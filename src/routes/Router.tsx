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

import { DonationDetailPage } from '../pages/esg/social/DonationDetailPage'
import { DonationPaymentPage } from '../pages/esg/social/DonationPaymentPage'
import { DonationPaymentRedirectPage } from '../pages/esg/social/DonationPaymentRedirectPage'
import { DonationPaymentCompletePage } from '../pages/esg/social/DonationPaymentCompletePage'

import { DonationPage } from '../pages/esg/social/DonationPage'
import { SocialPage } from '../pages/esg/social/SocialPage'
import { ValueStoreDetailPage } from '../pages/esg/social/ValueStoreDetailPage'
import { ValueStorePaymentPage } from '../pages/esg/social/ValueStorePaymentPage'
import { ValueStorePage } from '../pages/esg/social/ValueStorePage'

import { LoginPage } from '../pages/auth/LoginPage'
import { OnboardingPage } from '../pages/auth/OnboardingPage'
import { SignupPage } from '../pages/auth/SignupPage'
import { SignupAgreementPage } from '../pages/auth/SignupAgreementPage'
import { SignupCompletePage } from '../pages/auth/SignupCompletePage'
import { ChatbotPage } from '../pages/chatbot/ChatbotPage'
import { FinancePage } from '../pages/finance/FinancePage'
import { HomePage } from '../pages/home/HomePage'
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
        <Route
          path={ROUTE_PATHS.root}
          element={<Navigate replace to={ROUTE_PATHS.home} />}
        />

        <Route element={<PublicOnlyRoute />}>
          <Route path={ROUTE_PATHS.login} element={<LoginPage />} />
          <Route path={ROUTE_PATHS.signupAgreement} element={<SignupAgreementPage />} />
          <Route path={ROUTE_PATHS.verify} element={<SignupAgreementPage />} />
          <Route path={ROUTE_PATHS.signup} element={<SignupPage />} />
          <Route path={ROUTE_PATHS.signupComplete} element={<SignupCompletePage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path={ROUTE_PATHS.onboarding} element={<OnboardingPage />} />
          <Route path={ROUTE_PATHS.home} element={<HomePage />} />
          <Route path={ROUTE_PATHS.shop} element={<ShopListPage />} />
          <Route path={ROUTE_PATHS.shopHistory} element={<ShopHistoryPage />} />
          <Route
            path={ROUTE_PATHS.shopDetail}
            element={<ShopProductDetailPage />}
          />
          <Route path={ROUTE_PATHS.esgEnv} element={<EnvironmentEntryPage />} />
          <Route
            path={ROUTE_PATHS.activityEnvironment}
            element={<EnvironmentEntryPage />}
          />
          <Route
            path={ROUTE_PATHS.esgEnvVerify}
            element={<EnvironmentVerifyPage />}
          />
          <Route path={ROUTE_PATHS.esgSocial} element={<SocialPage />} />
          <Route path={ROUTE_PATHS.activitySocial} element={<SocialPage />} />
          <Route
            path={ROUTE_PATHS.esgSocialDonation}
            element={<DonationPage />}
          />
          <Route
            path={ROUTE_PATHS.activitySocialDonation}
            element={<DonationPage />}
          />
          <Route
            path={ROUTE_PATHS.activitySocialStore}
            element={<ValueStorePage />}
          />
          <Route
            path={ROUTE_PATHS.activitySocialProductDetail}
            element={<ValueStoreDetailPage />}
          />
          <Route
            path={ROUTE_PATHS.activitySocialProductPayment}
            element={<ValueStorePaymentPage />}
          />

          <Route
            path={ROUTE_PATHS.donationDetail}
            element={<DonationDetailPage />}
          />
          <Route
            path={ROUTE_PATHS.donationPayment}
            element={<DonationPaymentPage />}
          />
          <Route
            path={ROUTE_PATHS.donationPaymentCallback}
            element={<DonationPaymentRedirectPage />}
          />
          <Route
            path={ROUTE_PATHS.donationPaymentComplete}
            element={<DonationPaymentCompletePage />}
          />

          <Route path={ROUTE_PATHS.esgQuiz} element={<GovernancePage />} />
          <Route
            path={ROUTE_PATHS.activityGovernance}
            element={<GovernancePage />}
          />

          <Route path={ROUTE_PATHS.finance} element={<FinancePage />} />
          <Route path={ROUTE_PATHS.my} element={<MyPage />} />
          <Route path={ROUTE_PATHS.chatbot} element={<ChatbotPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {routeState?.backgroundLocation ? (
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route
              path={ROUTE_PATHS.esgEnv}
              element={<EnvironmentEntryModalRoute />}
            />
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

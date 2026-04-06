import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ROUTE_PATHS } from '../constants/routePaths'
import { GovernancePage } from '../pages/activities/GovernancePage'

import { DonationDetailPage } from '../pages/activities/DonationDetailPage'

import { DonationPage } from '../pages/activities/DonationPage'
import { EnvironmentPage } from '../pages/activities/EnvironmentPage'
import { SocialPage } from '../pages/activities/SocialPage'
import { ValueStorePage } from '../pages/activities/ValueStorePage'
import { LoginPage } from '../pages/auth/LoginPage'
import { OnboardingPage } from '../pages/auth/OnboardingPage'
import { SignupPage } from '../pages/auth/SignupPage'
import { ChatbotPage } from '../pages/chatbot/ChatbotPage'
import { FinancePage } from '../pages/finance/FinancePage'
import { HomePage } from '../pages/home/HomePage'
import { MyPage } from '../pages/my/MyPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ShopHistoryPage } from '../pages/shop/ShopHistoryPage'
import { ShopListPage } from '../pages/shop/ShopListPage'
import { ShopProductDetailPage } from '../pages/shop/ShopProductDetailPage'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicOnlyRoute } from './PublicOnlyRoute'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={ROUTE_PATHS.root}
          element={<Navigate replace to={ROUTE_PATHS.home} />}
        />

        <Route element={<PublicOnlyRoute />}>
          <Route path={ROUTE_PATHS.login} element={<LoginPage />} />
          <Route path={ROUTE_PATHS.signup} element={<SignupPage />} />
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
          <Route
            path={ROUTE_PATHS.activityEnvironment}
            element={<EnvironmentPage />}
          />
          <Route path={ROUTE_PATHS.activitySocial} element={<SocialPage />} />
          <Route
            path={ROUTE_PATHS.activitySocialDonation}
            element={<DonationPage />}
          />
          <Route
            path={ROUTE_PATHS.activitySocialStore}
            element={<ValueStorePage />}
          />
          <Route
            path={ROUTE_PATHS.donationDetail}
            element={<DonationDetailPage />}
          />
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
    </BrowserRouter>
  )
}

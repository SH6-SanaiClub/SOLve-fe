import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  type Location,
} from 'react-router-dom'
import { ROUTE_PATHS } from '../constants/routePaths'
import { GovernanceQuizPage } from '../pages/esg/governance/GovernanceQuizPage'
import { GovernanceQuizResultPage } from '../pages/esg/governance/GovernanceQuizResultPage'

import { DonationDetailPage } from '../pages/esg/social/DonationDetailPage'
import { DonationPaymentPage } from '../pages/esg/social/DonationPaymentPage'
import { DonationPaymentRedirectPage } from '../pages/esg/social/DonationPaymentRedirectPage'
import { DonationPaymentCompletePage } from '../pages/esg/social/DonationPaymentCompletePage'

import { DonationPage } from '../pages/esg/social/DonationPage'
import { SocialPage } from '../pages/esg/social/SocialPage'
import { ValueStoreDetailPage } from '../pages/esg/social/ValueStoreDetailPage'
import { ValueStorePaymentCompletePage } from '../pages/esg/social/ValueStorePaymentCompletePage'
import { ValueStorePaymentPage } from '../pages/esg/social/ValueStorePaymentPage'
import { ValueStorePaymentRedirectPage } from '../pages/esg/social/ValueStorePaymentRedirectPage'
import { ValueStorePage } from '../pages/esg/social/ValueStorePage'
import { VolunteerCompletePage } from '../pages/esg/social/VolunteerCompletePage'
import { VolunteerApplicationsPage } from '../pages/esg/social/VolunteerApplicationsPage'
import { VolunteerDetailPage } from '../pages/esg/social/VolunteerDetailPage'
import { VolunteerPage } from '../pages/esg/social/VolunteerPage'

import { LoginPage } from '../pages/auth/LoginPage'
import { SurveyPage } from '../pages/auth/SurveyPage'
import { SignupPage } from '../pages/auth/SignupPage'
import { SignupAgreementDetailPage } from '../pages/auth/SignupAgreementDetailPage'
import { SignupCompletePage } from '../pages/auth/SignupCompletePage'
import { ChatbotPage } from '../pages/chatbot/ChatbotPage'
import { FinanceApplyPage } from '../pages/finance/FinanceApplyPage'
import { FinanceDetailPage } from '../pages/finance/FinanceDetailPage'
import { FinanceDonePage } from '../pages/finance/FinanceDonePage'
import { FinancePage } from '../pages/finance/FinancePage'
import { HomePage } from '../pages/home/HomePage'
import { MyFinancePage } from '../pages/my/MyFinancePage'
import { MyGradePage } from '../pages/my/MyGradePage'
import { MyHistoryPage } from '../pages/my/MyHistoryPage'
import { MyLoanHistoryPage } from '../pages/my/MyLoanHistoryPage'
import { MyPointManagePage } from '../pages/my/MyPointManagePage'
import { MyProfilePage } from '../pages/my/MyProfilePage'
import { MyReportPage } from '../pages/my/MyReportPage'
import { MySavingsHistoryPage } from '../pages/my/MySavingsHistoryPage'
import { MyPage } from '../pages/my/MyPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { RecommendPage } from '../pages/recommend/RecommendPage'
import { EnvironmentEntryModalRoute } from '../pages/esg/env/EnvironmentEntryModalRoute'
import { EnvironmentEntryPage } from '../pages/esg/env/EnvironmentEntryPage'
import { EnvironmentVerifyPage } from '../pages/esg/env/EnvironmentVerifyPage'
import { ShopHistoryPage } from '../pages/shop/ShopHistoryPage'
import { ShopListPage } from '../pages/shop/ShopListPage'
import { ShopProductDetailPage } from '../pages/shop/ShopProductDetailPage'
import { SurveyGuard } from './SurveyGuard'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicOnlyRoute } from './PublicOnlyRoute'
import { AdminLayout } from '../components/admin/AdminLayout'
import { AdminProtectedRoute } from '../components/admin/AdminProtectedRoute'
import { AdminLoginPage } from '../pages/admin/AdminLoginPage'
import { AdminActivitiesPage } from '../pages/admin/activities/AdminActivitiesPage'
import { AdminActivityFormPage } from '../pages/admin/activities/AdminActivityFormPage'
import { AdminDashboardPage } from '../pages/admin/dashboard/AdminDashboardPage'
import { AdminFinanceFormPage } from '../pages/admin/finance/AdminFinanceFormPage'
import { AdminFinancePage } from '../pages/admin/finance/AdminFinancePage'
import { AdminFinanceSubscriptionsPage } from '../pages/admin/finance/AdminFinanceSubscriptionsPage'
import { AdminShopFormPage } from '../pages/admin/shop/AdminShopFormPage'
import { AdminShopPage } from '../pages/admin/shop/AdminShopPage'
import { AdminUserDetailPage } from '../pages/admin/users/AdminUserDetailPage'
import { AdminUserListPage } from '../pages/admin/users/AdminUserListPage'

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

        <Route path={ROUTE_PATHS.adminLogin} element={<AdminLoginPage />} />

        <Route element={<PublicOnlyRoute />}>
          <Route path={ROUTE_PATHS.login} element={<LoginPage />} />
          <Route path={ROUTE_PATHS.signupAgreement} element={<SignupAgreementDetailPage />} />
          <Route path={ROUTE_PATHS.verify} element={<SignupAgreementDetailPage />} />
          <Route path={ROUTE_PATHS.signup} element={<SignupPage />} />
          <Route path={ROUTE_PATHS.signupComplete} element={<SignupCompletePage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path={ROUTE_PATHS.survey} element={<SurveyPage />} />
          <Route element={<SurveyGuard />}>
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
              path={ROUTE_PATHS.activitySocialVolunteer}
              element={<VolunteerPage />}
            />
            <Route
              path={ROUTE_PATHS.activitySocialVolunteerApplications}
              element={<VolunteerApplicationsPage />}
            />
            <Route
              path={ROUTE_PATHS.activitySocialVolunteerDetail}
              element={<VolunteerDetailPage />}
            />
            <Route
              path={ROUTE_PATHS.activitySocialVolunteerComplete}
              element={<VolunteerCompletePage />}
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
              path={ROUTE_PATHS.activitySocialProductPaymentCallback}
              element={<ValueStorePaymentRedirectPage />}
            />
            <Route
              path={ROUTE_PATHS.activitySocialProductPaymentComplete}
              element={<ValueStorePaymentCompletePage />}
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

            <Route path={ROUTE_PATHS.esgQuiz} element={<GovernanceQuizPage />} />
            <Route path={ROUTE_PATHS.esgQuizResult} element={<GovernanceQuizResultPage />} />
            <Route path={ROUTE_PATHS.activityGovernance} element={<GovernanceQuizPage />} />
            <Route path={ROUTE_PATHS.financeDone} element={<FinanceDonePage />} />
            <Route path={ROUTE_PATHS.financeApply} element={<FinanceApplyPage />} />
            <Route path={ROUTE_PATHS.financeDetail} element={<FinanceDetailPage />} />

            <Route path={ROUTE_PATHS.finance} element={<FinancePage />} />
            <Route path={ROUTE_PATHS.my} element={<MyPage />} />
            <Route path={ROUTE_PATHS.myProfile} element={<MyProfilePage />} />
            <Route path={ROUTE_PATHS.myGrade} element={<MyGradePage />} />
            <Route path={ROUTE_PATHS.myHistory} element={<MyHistoryPage />} />
            <Route path={ROUTE_PATHS.myFinance} element={<MyFinancePage />} />
            <Route path={ROUTE_PATHS.myFinanceSavingsHistory} element={<MySavingsHistoryPage />} />
            <Route path={ROUTE_PATHS.myFinanceLoanHistory} element={<MyLoanHistoryPage />} />
            <Route path={ROUTE_PATHS.myPointManage} element={<MyPointManagePage />} />
            <Route path={ROUTE_PATHS.myReport} element={<MyReportPage />} />
            <Route path={ROUTE_PATHS.chatbot} element={<ChatbotPage />} />
            <Route path={ROUTE_PATHS.recommend} element={<RecommendPage />} />
          </Route>
        </Route>

        <Route element={<AdminProtectedRoute />}>
          <Route
            path={ROUTE_PATHS.adminDashboard}
            element={
              <AdminLayout>
                <AdminDashboardPage />
              </AdminLayout>
            }
          />
          <Route
            path={ROUTE_PATHS.adminUsers}
            element={
              <AdminLayout>
                <AdminUserListPage />
              </AdminLayout>
            }
          />
          <Route
            path={ROUTE_PATHS.adminUserDetail}
            element={
              <AdminLayout>
                <AdminUserDetailPage />
              </AdminLayout>
            }
          />
          <Route
            path={ROUTE_PATHS.adminActivities}
            element={
              <AdminLayout>
                <AdminActivitiesPage />
              </AdminLayout>
            }
          />
          <Route
            path={ROUTE_PATHS.adminActivityForm}
            element={
              <AdminLayout>
                <AdminActivityFormPage />
              </AdminLayout>
            }
          />
          <Route
            path={ROUTE_PATHS.adminShop}
            element={
              <AdminLayout>
                <AdminShopPage />
              </AdminLayout>
            }
          />
          <Route
            path={ROUTE_PATHS.adminShopForm}
            element={
              <AdminLayout>
                <AdminShopFormPage />
              </AdminLayout>
            }
          />
          <Route
            path={ROUTE_PATHS.adminFinance}
            element={
              <AdminLayout>
                <AdminFinancePage />
              </AdminLayout>
            }
          />
          <Route
            path={ROUTE_PATHS.adminFinanceForm}
            element={
              <AdminLayout>
                <AdminFinanceFormPage />
              </AdminLayout>
            }
          />
          <Route
            path={ROUTE_PATHS.adminFinanceSubscriptions}
            element={
              <AdminLayout>
                <AdminFinanceSubscriptionsPage />
              </AdminLayout>
            }
          />
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

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Button from '../../components/common/Button'
import Header from '../../components/layout/Header'
import MainLayout from '../../components/layout/MainLayout'
import { ROUTE_PATHS } from '../../constants/routePaths'
import { identityVerificationService } from '../../services/identityVerificationService'
import { updateMyPhoneNumber } from '../../services/userProfileService'
import {
  clearIdentityVerificationRedirectContext,
  readIdentityVerificationRedirectContext,
} from '../../utils/identityVerificationRedirect'
import { writeSignupVerificationState } from '../../utils/signupVerificationStorage'

export function SignupVerificationRedirectPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [redirectType] = useState(() => readIdentityVerificationRedirectContext()?.type)
  const [isVerifying, setIsVerifying] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const success = searchParams.get('success')
    const impUid = searchParams.get('imp_uid')

    const run = async () => {
      if (success !== 'true') {
        clearIdentityVerificationRedirectContext()
        setErrorMessage('본인인증이 완료되지 않았어요. 다시 시도해 주세요.')
        setIsVerifying(false)
        return
      }

      if (!impUid) {
        clearIdentityVerificationRedirectContext()
        setErrorMessage('본인인증 정보를 확인할 수 없어요. 다시 시도해 주세요.')
        setIsVerifying(false)
        return
      }

      try {
        if (redirectType === 'profile-phone') {
          const response = await updateMyPhoneNumber(impUid)
          clearIdentityVerificationRedirectContext()
          navigate(ROUTE_PATHS.myProfile, {
            replace: true,
            state: {
              phoneVerificationUpdated: true,
              updatedPhoneNumber: response.phoneNumber,
            },
          })
          return
        }

        const result = await identityVerificationService.verifyImpUid(impUid)

        if (!result.verified || !result.verificationToken) {
          throw new Error('본인인증 검증에 실패했어요. 다시 시도해 주세요.')
        }

        clearIdentityVerificationRedirectContext()
        writeSignupVerificationState({
          verificationToken: result.verificationToken,
          preservedLoginId: result.preservedLoginId,
        })

        navigate(ROUTE_PATHS.signup, {
          replace: true,
          state: {
            verificationToken: result.verificationToken,
            preservedLoginId: result.preservedLoginId,
          },
        })
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setErrorMessage(
            (error.response?.data as { message?: string } | undefined)?.message ||
              '본인인증 처리 중 문제가 발생했어요.',
          )
        } else if (error instanceof Error && error.message.trim()) {
          setErrorMessage(error.message)
        } else {
          setErrorMessage('본인인증 처리 중 문제가 발생했어요.')
        }
        clearIdentityVerificationRedirectContext()
        setIsVerifying(false)
      }
    }

    void run()
  }, [navigate, redirectType, searchParams])

  return (
    <MainLayout header={<Header title="본인인증 확인" />}>
      <div className="flex min-h-[calc(100dvh-var(--header-h)-48px)] flex-col items-center justify-center px-4 text-center">
        {isVerifying ? (
          <>
            <p className="text-base font-semibold text-font-main">본인인증 결과를 확인하고 있어요.</p>
            <p className="mt-2 text-sm text-font-sub">잠시만 기다려 주세요.</p>
          </>
        ) : (
          <div className="w-full max-w-sm rounded-2xl bg-white px-5 py-6 shadow-sm">
            <p className="text-sm font-medium leading-6 text-font-main">{errorMessage}</p>
            <Button
              type="button"
              fullWidth
              className="mt-5"
              onClick={() =>
                navigate(
                  redirectType === 'profile-phone'
                    ? ROUTE_PATHS.myProfile
                    : ROUTE_PATHS.signupAgreement,
                  { replace: true },
                )
              }
            >
              다시 시도하기
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  )
}



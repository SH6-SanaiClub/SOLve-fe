import { apiClient } from './apiClient'
import { APP_CONFIG } from '../constants/config'
import { ROUTE_PATHS } from '../constants/routePaths'
import type { PortOneCertificationResponse } from '../types/portone'
import { saveIdentityVerificationRedirectContext } from '../utils/identityVerificationRedirect'

type VerifyIdentityResponse = {
  verified: boolean
  verificationToken?: string
  preservedLoginId?: string
}

type SignupVerificationStartResult =
  | { redirected: true }
  | VerifyIdentityResponse

type RedirectVerificationStartResult = { redirected: true }

const isMobileDevice = () => {
  if (typeof navigator === 'undefined') {
    return false
  }

  return /Android|iPhone|iPad|iPod|Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  )
}

async function requestImpCertification(): Promise<string> {
  if (!window.IMP) {
    throw new Error('PortOne SDK가 로드되지 않았습니다.')
  }

  if (!APP_CONFIG.portone.impCode) {
    throw new Error('VITE_PORTONE_IMP_CODE가 설정되지 않았습니다.')
  }

  const { IMP } = window
  IMP.init(APP_CONFIG.portone.impCode)

  const certificationResult = await new Promise<{ imp_uid?: string }>((resolve, reject) => {
    IMP.certification(
      {
        channelKey: APP_CONFIG.portone.channelKey || undefined,
        pg: APP_CONFIG.portone.channelKey ? undefined : APP_CONFIG.portone.pg || undefined,
        merchant_uid: `cert_${Date.now()}`,
        company: 'SOLve',
        name: '',
        phone: '',
        carrier: '',
        popup: true,
      },
      (response: PortOneCertificationResponse | null) => {
        if (!response) {
          reject(new Error('본인인증 응답이 없습니다.'))
          return
        }

        if (!response.success) {
          reject(new Error(response.error_msg || '본인인증에 실패했습니다.'))
          return
        }

        resolve(response)
      },
    )
  })

  if (!certificationResult.imp_uid) {
    throw new Error('imp_uid를 확인할 수 없습니다.')
  }

  return certificationResult.imp_uid
}

async function startRedirectCertification(
  context: 'signup' | 'profile-phone',
): Promise<{ redirected: true }> {
  if (!window.IMP) {
    throw new Error('PortOne SDK가 로드되지 않았습니다.')
  }

  if (!APP_CONFIG.portone.impCode) {
    throw new Error('VITE_PORTONE_IMP_CODE가 설정되지 않았습니다.')
  }

  const { IMP } = window
  IMP.init(APP_CONFIG.portone.impCode)

  saveIdentityVerificationRedirectContext({ type: context })

  await new Promise<void>((resolve, reject) => {
    IMP.certification(
      {
        channelKey: APP_CONFIG.portone.channelKey || undefined,
        pg: APP_CONFIG.portone.channelKey ? undefined : APP_CONFIG.portone.pg || undefined,
        merchant_uid: `cert_${Date.now()}`,
        company: 'SOLve',
        name: '',
        phone: '',
        carrier: '',
        popup: false,
        m_redirect_url: `${window.location.origin}${ROUTE_PATHS.verify}`,
      },
      (response: PortOneCertificationResponse | null) => {
        if (!response) {
          resolve()
          return
        }

        if (response.success === false) {
          reject(new Error(response.error_msg || '본인인증에 실패했습니다.'))
          return
        }

        resolve()
      },
    )
  })

  return { redirected: true }
}

export const identityVerificationService = {
  requestImpUid: requestImpCertification,
  verifyImpUid: async (impUid: string): Promise<VerifyIdentityResponse> => {
    const response = await apiClient.post<VerifyIdentityResponse>('/v1/auth/verify-identity', {
      impUid,
    })
    return response.data
  },
  startSignupVerification: async (): Promise<SignupVerificationStartResult> => {
    if (isMobileDevice()) {
      return startRedirectCertification('signup')
    }

    return identityVerificationService.verify()
  },
  startProfilePhoneVerification: async (): Promise<RedirectVerificationStartResult> =>
    startRedirectCertification('profile-phone'),
  verify: async (): Promise<VerifyIdentityResponse> => {
    const impUid = await requestImpCertification()
    return identityVerificationService.verifyImpUid(impUid)
  },
}

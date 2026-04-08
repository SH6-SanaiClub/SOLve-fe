import { apiClient } from './apiClient'
import { APP_CONFIG } from '../constants/config'

type VerifyIdentityResponse = {
  verified: boolean
  verificationToken?: string
}

declare global {
  interface Window {
    IMP?: {
      init: (impCode: string) => void
      certification: (
        data: {
          channelKey?: string
          pg?: string
          merchant_uid: string
          company: string
          name?: string
          phone?: string
          carrier?: string
          popup?: boolean
        },
        callback: (response: {
          success?: boolean
          imp_uid?: string
          error_msg?: string
        } | null) => void,
      ) => void
    }
  }
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
      (response) => {
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

export const identityVerificationService = {
  verify: async (): Promise<VerifyIdentityResponse> => {
    const impUid = await requestImpCertification()
    const response = await apiClient.post<VerifyIdentityResponse>('/auth/verify-identity', {
      impUid,
    })
    return response.data
  },
}

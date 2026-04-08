import { apiClient } from './apiClient'
import type { ApiResponse } from '../types/api'
import type {
  EnvironmentVerificationAvailabilityResponse,
  EnvironmentVerificationResponse,
  SubmitEnvironmentVerificationRequest,
} from '../types/environmentVerification'

type EnvironmentVerificationApiResponse =
  | EnvironmentVerificationResponse
  | ApiResponse<EnvironmentVerificationResponse>
type EnvironmentVerificationAvailabilityApiResponse =
  | EnvironmentVerificationAvailabilityResponse[]
  | ApiResponse<EnvironmentVerificationAvailabilityResponse[]>

function unwrapEnvironmentVerificationResponse(
  response: EnvironmentVerificationApiResponse,
): EnvironmentVerificationResponse {
  if ('data' in response) {
    return response.data
  }

  return response
}

function unwrapEnvironmentVerificationAvailabilityResponse(
  response: EnvironmentVerificationAvailabilityApiResponse,
): EnvironmentVerificationAvailabilityResponse[] {
  if ('data' in response) {
    return response.data
  }

  return response
}

export const fetchEnvironmentVerificationAvailability = async (): Promise<
  EnvironmentVerificationAvailabilityResponse[]
> => {
  const response = await apiClient.get<EnvironmentVerificationAvailabilityApiResponse>(
    '/v1/esg/e/verifications/availability',
  )

  return unwrapEnvironmentVerificationAvailabilityResponse(response.data)
}

export const submitEnvironmentVerification = async ({
  activityType,
  image,
}: SubmitEnvironmentVerificationRequest): Promise<EnvironmentVerificationResponse> => {
  const response = await apiClient.postForm<EnvironmentVerificationApiResponse>(
    '/v1/esg/e/verifications',
    {
      activityType,
      image,
    },
  )

  return unwrapEnvironmentVerificationResponse(response.data)
}

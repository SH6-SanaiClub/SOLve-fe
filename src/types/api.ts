export interface ApiErrorPayload {
  status: number
  message: string
  code?: string
  details?: unknown
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

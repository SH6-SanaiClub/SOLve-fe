export interface ApiErrorPayload {
  status: number
  message: string
  code?: string
  details?: unknown
}

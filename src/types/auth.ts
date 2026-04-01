import type { UserSummary } from './user'

export interface AuthSession {
  accessToken: string | null
  user: UserSummary | null
}

type SignupVerificationState = {
  verificationToken: string
  preservedLoginId?: string
}

const STORAGE_KEY = 'solve.signup-verification'

export const readSignupVerificationState = (): SignupVerificationState | null => {
  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as SignupVerificationState
  } catch {
    sessionStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export const writeSignupVerificationState = (state: SignupVerificationState) => {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export const clearSignupVerificationState = () => {
  sessionStorage.removeItem(STORAGE_KEY)
}

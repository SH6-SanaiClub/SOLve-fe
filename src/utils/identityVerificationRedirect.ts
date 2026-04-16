type IdentityVerificationRedirectContext =
  | { type: 'signup' }
  | { type: 'profile-phone' }

const STORAGE_KEY = 'solve.identity-verification.redirect-context'

export const saveIdentityVerificationRedirectContext = (
  context: IdentityVerificationRedirectContext,
) => {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(context))
}

export const readIdentityVerificationRedirectContext = (): IdentityVerificationRedirectContext | null => {
  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as IdentityVerificationRedirectContext
  } catch {
    sessionStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export const clearIdentityVerificationRedirectContext = () => {
  sessionStorage.removeItem(STORAGE_KEY)
}

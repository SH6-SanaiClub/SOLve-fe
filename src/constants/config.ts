export const APP_CONFIG = {
  appName: 'SOLve',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
  apiTimeoutMs: Number(import.meta.env.VITE_API_TIMEOUT_MS ?? 10000),
  enableDevAuthBypass:
    import.meta.env.VITE_ENABLE_DEV_AUTH_BYPASS === 'true' ||
    (import.meta.env.DEV && import.meta.env.VITE_ENABLE_DEV_AUTH_BYPASS !== 'false'),
  storageKeys: {
    auth: 'solve-auth',
  },
  pwa: {
    themeColor: '#0046FF',
    backgroundColor: '#F1F5F9',
  },
} as const

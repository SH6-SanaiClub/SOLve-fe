declare const __PORTONE_IMP_CODE__: string
declare const __PORTONE_CHANNEL_KEY__: string
declare const __PORTONE_PG__: string

export const APP_CONFIG = {
  appName: 'SOLve',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
  apiTimeoutMs: Number(import.meta.env.VITE_API_TIMEOUT_MS ?? 10000),
  enableDevAuthBypass: false,
  portone: {
    impCode: import.meta.env.VITE_PORTONE_IMP_CODE || __PORTONE_IMP_CODE__ || 'imp57425168',
    channelKey: import.meta.env.VITE_PORTONE_CHANNEL_KEY || __PORTONE_CHANNEL_KEY__ || '',
    pg: import.meta.env.VITE_PORTONE_PG || __PORTONE_PG__ || '',
  },

  storageKeys: {
    auth: 'solve-auth',
    adminAuth: 'admin-auth',
  },
  pwa: {
    themeColor: '#0046FF',
    backgroundColor: '#F1F5F9',
  },
} as const

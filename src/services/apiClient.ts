import axios from 'axios'
import { APP_CONFIG } from '../constants/config'
import { applyAuthInterceptor } from './interceptors/authInterceptor'
import { applyErrorInterceptor } from './interceptors/errorInterceptor'

export const apiClient = axios.create({
  baseURL: APP_CONFIG.apiBaseUrl,
  timeout: APP_CONFIG.apiTimeoutMs,
  headers: {
    'Content-Type': 'application/json',
  },
})

applyAuthInterceptor(apiClient)
applyErrorInterceptor(apiClient)

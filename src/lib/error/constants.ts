export const ERROR_CODES = {
  NETWORK: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  DATABASE: 'DATABASE_ERROR',
  AUTH: 'AUTH_ERROR',
  API: 'API_ERROR'
} as const;

export const DEFAULT_ERROR_MESSAGES = {
  [ERROR_CODES.NETWORK]: 'Network connection failed. Please check your connection and try again.',
  [ERROR_CODES.TIMEOUT]: 'Request timed out. Please try again.',
  [ERROR_CODES.DATABASE]: 'Database operation failed. Please try again.',
  [ERROR_CODES.AUTH]: 'Authentication failed. Please sign in again.',
  [ERROR_CODES.API]: 'API request failed. Please try again.'
} as const;
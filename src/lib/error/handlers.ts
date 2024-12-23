import { AppError } from './types';
import { ERROR_CODES, DEFAULT_ERROR_MESSAGES } from './constants';

export function handleNetworkError(error: unknown): AppError {
  if (error instanceof AppError) return error;

  const message = error instanceof Error ? error.message : 'Network error occurred';
  return new AppError(
    DEFAULT_ERROR_MESSAGES[ERROR_CODES.NETWORK],
    ERROR_CODES.NETWORK,
    { originalError: message }
  );
}

export function handleTimeoutError(): AppError {
  return new AppError(
    DEFAULT_ERROR_MESSAGES[ERROR_CODES.TIMEOUT],
    ERROR_CODES.TIMEOUT
  );
}

export function handleDatabaseError(error: unknown): AppError {
  if (error instanceof AppError) return error;

  const message = error instanceof Error ? error.message : 'Database error occurred';
  return new AppError(
    DEFAULT_ERROR_MESSAGES[ERROR_CODES.DATABASE],
    ERROR_CODES.DATABASE,
    { originalError: message }
  );
}
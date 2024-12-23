import { AppError } from '../error';

const MAX_RETRIES = 3;
const INITIAL_DELAY = 1000;

export async function withRetry<T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES
): Promise<T> {
  let lastError: unknown;
  let delay = INITIAL_DELAY;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (!isRetryableError(error) || attempt === retries) {
        throw error instanceof AppError ? error : new AppError(
          'Operation failed after retries',
          'RETRY_ERROR',
          error
        );
      }

      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }

  throw lastError;
}

function isRetryableError(error: unknown): boolean {
  return error instanceof Error && (
    error.message.includes('Failed to fetch') ||
    error.message.includes('NetworkError') ||
    error.message.includes('network timeout')
  );
}
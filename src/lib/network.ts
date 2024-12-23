import { AppError } from './error';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export async function withRetry<T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = RETRY_DELAY
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries === 0 || !isRetryableError(error)) {
      throw error;
    }
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return withRetry(operation, retries - 1, delay * 2);
  }
}

function isRetryableError(error: unknown): boolean {
  return error instanceof Error && 
    (error.message === 'Failed to fetch' || 
     error.message.includes('NetworkError') ||
     error.message.includes('network timeout'));
}
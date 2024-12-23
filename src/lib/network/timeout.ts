import { AppError } from '../error';

export async function withTimeout<T>(
  operation: () => Promise<T>,
  timeoutMs: number = 30000
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const result = await operation();
    return result;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new AppError('Request timed out', 'TIMEOUT_ERROR');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
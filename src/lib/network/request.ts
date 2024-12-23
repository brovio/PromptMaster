import { AppError } from '../error';
import { withRetry } from './retry';

interface RequestConfig extends RequestInit {
  timeout?: number;
}

const DEFAULT_TIMEOUT = 30000; // 30 seconds

export async function request<T>(url: string, config: RequestConfig = {}): Promise<T> {
  const { timeout = DEFAULT_TIMEOUT, ...fetchConfig } = config;

  return withRetry(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchConfig,
        signal: controller.signal
      });

      if (!response.ok) {
        throw new AppError(
          `HTTP error ${response.status}`,
          'HTTP_ERROR',
          { status: response.status }
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof AppError) throw error;
      
      if (error.name === 'AbortError') {
        throw new AppError('Request timed out', 'TIMEOUT_ERROR');
      }

      throw new AppError(
        'Network request failed',
        'NETWORK_ERROR',
        error
      );
    } finally {
      clearTimeout(timeoutId);
    }
  });
}
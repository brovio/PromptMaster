import { AppError } from './error';
import { withRetry } from './network';

interface ApiOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
}

export async function apiRequest<T>(url: string, options: ApiOptions = {}): Promise<T> {
  const fetchWithTimeout = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal
      });

      if (!response.ok) {
        const error = await response.text();
        throw new AppError(
          'API request failed',
          response.status.toString(),
          error
        );
      }

      return await response.json();
    } finally {
      clearTimeout(timeoutId);
    }
  };

  try {
    return await withRetry(fetchWithTimeout);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    
    if (error.name === 'AbortError') {
      throw new AppError('Request timed out', 'TIMEOUT_ERROR');
    }

    throw new AppError(
      'API request failed',
      'NETWORK_ERROR',
      error
    );
  }
}
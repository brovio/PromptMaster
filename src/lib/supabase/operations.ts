import { supabase } from './client';
import { handleDatabaseError } from '../error/handlers';
import { withRetry } from '../network/retry';
import { withTimeout } from '../network/timeout';

interface QueryOptions {
  timeout?: number;
  retries?: number;
}

export async function executeQuery<T>(
  operation: () => Promise<{ data: T | null; error: any }>,
  options: QueryOptions = {}
): Promise<T> {
  return withRetry(
    () => withTimeout(
      async () => {
        try {
          const { data, error } = await operation();
          if (error) throw error;
          if (!data) throw new Error('No data returned');
          return data;
        } catch (error) {
          throw handleDatabaseError(error);
        }
      },
      options.timeout
    ),
    { maxRetries: options.retries }
  );
}

export const queries = {
  async select<T>(table: string, columns = '*', options?: QueryOptions): Promise<T[]> {
    return executeQuery<T[]>(
      () => supabase.from(table).select(columns),
      options
    );
  },

  async insert<T>(table: string, data: any, options?: QueryOptions): Promise<T> {
    return executeQuery<T>(
      () => supabase.from(table).insert(data).select().single(),
      options
    );
  }
};
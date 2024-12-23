import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from './client';
import { withRetry } from '../network/retry';
import { withTimeout } from '../network/timeout';
import { AppError } from '../error';

interface QueryOptions {
  timeout?: number;
  retries?: number;
}

const DEFAULT_OPTIONS: Required<QueryOptions> = {
  timeout: 30000,
  retries: 3
};

export const enhancedClient = {
  from: (table: string) => ({
    async select(columns = '*', options: QueryOptions = {}) {
      const opts = { ...DEFAULT_OPTIONS, ...options };
      
      return withRetry(
        () => withTimeout(
          async () => {
            const { data, error } = await supabase
              .from(table)
              .select(columns);

            if (error) throw handlePostgrestError(error);
            return data;
          },
          opts.timeout
        ),
        { maxRetries: opts.retries }
      );
    },

    async insert(values: unknown, options: QueryOptions = {}) {
      const opts = { ...DEFAULT_OPTIONS, ...options };
      
      return withRetry(
        () => withTimeout(
          async () => {
            const { data, error } = await supabase
              .from(table)
              .insert(values)
              .select();

            if (error) throw handlePostgrestError(error);
            return data;
          },
          opts.timeout
        ),
        { maxRetries: opts.retries }
      );
    },

    async update(values: unknown, match: Record<string, unknown>, options: QueryOptions = {}) {
      const opts = { ...DEFAULT_OPTIONS, ...options };
      
      return withRetry(
        () => withTimeout(
          async () => {
            const { data, error } = await supabase
              .from(table)
              .update(values)
              .match(match)
              .select();

            if (error) throw handlePostgrestError(error);
            return data;
          },
          opts.timeout
        ),
        { maxRetries: opts.retries }
      );
    }
  })
};

function handlePostgrestError(error: PostgrestError): AppError {
  return new AppError(
    error.message || 'Database operation failed',
    error.code || 'DATABASE_ERROR',
    { details: error.details, hint: error.hint }
  );
}
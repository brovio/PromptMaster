import { createClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';
import { withRetry } from '../network/retry';
import { withTimeout } from '../network/timeout';
import { AppError } from '../error';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Enhanced query builder with retry and timeout
export const enhancedClient = {
  from: (table: string) => ({
    async select(columns = '*') {
      return withRetry(() => 
        withTimeout(async () => {
          const { data, error } = await supabase
            .from(table)
            .select(columns);

          if (error) throw new AppError(error.message, 'DATABASE_ERROR', error);
          return data;
        })
      );
    },

    async insert(values: unknown) {
      return withRetry(() =>
        withTimeout(async () => {
          const { data, error } = await supabase
            .from(table)
            .insert(values)
            .select();

          if (error) throw new AppError(error.message, 'DATABASE_ERROR', error);
          return data;
        })
      );
    },

    async update(values: unknown, match: Record<string, unknown>) {
      return withRetry(() =>
        withTimeout(async () => {
          const { data, error } = await supabase
            .from(table)
            .update(values)
            .match(match)
            .select();

          if (error) throw new AppError(error.message, 'DATABASE_ERROR', error);
          return data;
        })
      );
    }
  })
};
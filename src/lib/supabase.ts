import { createClient } from '@supabase/supabase-js';
import { withRetry } from './network';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Enhanced query builder with retry logic
export const enhancedQuery = {
  from: (table: string) => ({
    select: async (columns = '*') => {
      return withRetry(() => 
        supabase
          .from(table)
          .select(columns)
      );
    },
    insert: async (data: any) => {
      return withRetry(() =>
        supabase
          .from(table)
          .insert(data)
      );
    },
    update: async (data: any) => {
      return withRetry(() =>
        supabase
          .from(table)
          .update(data)
      );
    }
  })
};
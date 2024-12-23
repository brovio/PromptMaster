/*
  # Fix API Keys Table

  1. Changes
    - Safely handle existing api_keys table and policies
    - Add missing indexes
    - Update RLS policies if needed
*/

-- First, check if the api_keys table exists and create it if not
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'api_keys'
  ) THEN
    CREATE TABLE api_keys (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
      provider text NOT NULL,
      key_value text NOT NULL,
      is_active boolean DEFAULT true,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now(),
      UNIQUE(user_id, provider)
    );
  END IF;
END $$;

-- Enable RLS if not already enabled
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Safely drop existing policy if it exists and create new one
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can manage their own API keys" ON api_keys;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'api_keys' 
    AND policyname = 'Users can manage their own API keys'
  ) THEN
    CREATE POLICY "Users can manage their own API keys"
      ON api_keys FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Add index if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'api_keys' 
    AND indexname = 'idx_api_keys_user_id'
  ) THEN
    CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
  END IF;
END $$;
/*
  # Fix Prompts Table Schema

  1. Changes
    - Add missing columns for prompt processing
    - Update indexes for better performance
    - Ensure proper RLS policies
*/

-- Add missing columns to prompts table if they don't exist
DO $$ 
BEGIN
  -- Add model_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'prompts' AND column_name = 'model_id'
  ) THEN
    ALTER TABLE prompts ADD COLUMN model_id text;
  END IF;

  -- Add template_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'prompts' AND column_name = 'template_id'
  ) THEN
    ALTER TABLE prompts ADD COLUMN template_id text;
  END IF;

  -- Add result column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'prompts' AND column_name = 'result'
  ) THEN
    ALTER TABLE prompts ADD COLUMN result text;
  END IF;

  -- Add metrics columns if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'prompts' AND column_name = 'tokens'
  ) THEN
    ALTER TABLE prompts ADD COLUMN tokens integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'prompts' AND column_name = 'cost'
  ) THEN
    ALTER TABLE prompts ADD COLUMN cost numeric(10, 6) DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'prompts' AND column_name = 'processing_time'
  ) THEN
    ALTER TABLE prompts ADD COLUMN processing_time numeric DEFAULT 0;
  END IF;
END $$;
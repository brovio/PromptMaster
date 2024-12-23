/*
  # Update prompts table schema

  1. Changes
    - Add model_id column to prompts table
    - Add template_id column to prompts table
    - Add result column to store improved prompt
    - Add metrics columns for tracking usage

  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns to prompts table
ALTER TABLE prompts 
  ADD COLUMN IF NOT EXISTS model_id text,
  ADD COLUMN IF NOT EXISTS template_id text,
  ADD COLUMN IF NOT EXISTS result text,
  ADD COLUMN IF NOT EXISTS tokens integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cost numeric(10, 6) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS processing_time numeric DEFAULT 0;

-- Update existing RLS policies
DROP POLICY IF EXISTS "Users can manage their own prompts" ON prompts;

CREATE POLICY "Users can manage their own prompts"
  ON prompts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_prompts_user_id_created_at 
  ON prompts(user_id, created_at DESC);
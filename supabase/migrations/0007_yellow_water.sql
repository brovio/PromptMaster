/*
  # Add Model Preferences Table
  
  1. New Tables
    - `model_preferences`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `model_id` (text, the model identifier)
      - `provider` (text, the model provider)
      - `is_enabled` (boolean, whether the model is enabled)
      - `priority` (integer, order of preference)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on `model_preferences` table
    - Add policies for users to manage their own preferences
*/

CREATE TABLE model_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  model_id text NOT NULL,
  provider text NOT NULL,
  is_enabled boolean DEFAULT true,
  priority integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, model_id)
);

-- Enable RLS
ALTER TABLE model_preferences ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own model preferences"
  ON model_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own model preferences"
  ON model_preferences FOR ALL
  USING (auth.uid() = user_id);

-- Add index for faster queries
CREATE INDEX idx_model_preferences_user_id ON model_preferences(user_id);
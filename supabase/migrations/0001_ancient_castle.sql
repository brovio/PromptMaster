/*
  # Initial Schema Setup for Prompt Platform

  1. New Tables
    - `profiles`
      - User profile information
      - Linked to auth.users
    - `api_keys`
      - Encrypted API keys for different LLM providers
      - Linked to user profiles
    - `prompts`
      - User-created prompts
      - Version tracking
      - Categories and tags
    - `templates`
      - Reusable prompt templates
      - Rating system
    - `prompt_tests`
      - Test results for prompts
      - Performance metrics

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated access
*/

-- Profiles table for user information
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- API keys for different providers
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

-- Prompts table
CREATE TABLE prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  category text,
  tags text[],
  version integer DEFAULT 1,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Templates table
CREATE TABLE templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  content text NOT NULL,
  category text,
  rating numeric DEFAULT 0,
  usage_count integer DEFAULT 0,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Prompt test results
CREATE TABLE prompt_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id uuid REFERENCES prompts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  provider text NOT NULL,
  input text NOT NULL,
  result text NOT NULL,
  tokens integer,
  cost numeric,
  latency numeric,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_tests ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- API Keys policies
CREATE POLICY "Users can manage their own API keys"
  ON api_keys FOR ALL
  USING (auth.uid() = user_id);

-- Prompts policies
CREATE POLICY "Users can view public prompts"
  ON prompts FOR SELECT
  USING (is_public OR auth.uid() = user_id);

CREATE POLICY "Users can manage their own prompts"
  ON prompts FOR ALL
  USING (auth.uid() = user_id);

-- Templates policies
CREATE POLICY "Users can view public templates"
  ON templates FOR SELECT
  USING (is_public OR auth.uid() = user_id);

CREATE POLICY "Users can manage their own templates"
  ON templates FOR ALL
  USING (auth.uid() = user_id);

-- Prompt tests policies
CREATE POLICY "Users can view their own test results"
  ON prompt_tests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create test results"
  ON prompt_tests FOR INSERT
  WITH CHECK (auth.uid() = user_id);
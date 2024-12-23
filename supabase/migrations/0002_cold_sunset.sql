/*
  # Fix profiles table RLS policies

  1. Changes
    - Add policy to allow authenticated users to insert their own profile
    - Add policy to allow authenticated users to update their own profile
    - Keep existing policy for public profile viewing

  2. Security
    - Ensures users can only manage their own profile data
    - Maintains public read access for profiles
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Recreate policies with proper permissions
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
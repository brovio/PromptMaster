/*
  # Fix profiles table RLS policies

  1. Changes
    - Drop existing policies
    - Create new policies with proper permissions for profile management
    - Add policy for authenticated users to manage their own profiles
  
  2. Security
    - Enable RLS
    - Ensure users can only manage their own profiles
    - Allow public read access to profiles
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create new policies with proper permissions
CREATE POLICY "Profiles are publicly readable"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own profile"
  ON profiles FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
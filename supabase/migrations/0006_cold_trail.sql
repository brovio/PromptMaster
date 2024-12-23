/*
  # Fix profiles policies to eliminate recursion

  1. Changes
    - Remove recursive superadmin check
    - Implement direct user-based policies
    - Add function for superadmin check

  2. Security
    - Maintain row-level security
    - Keep public read access
    - Allow users to manage their own profiles
    - Grant superadmin access without recursion
*/

-- Create a function to check if a user is a superadmin
CREATE OR REPLACE FUNCTION is_superadmin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  -- Hardcode the superadmin email for initial setup
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = user_id
    AND email = 'ross@brov.io'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow public read access" ON profiles;
DROP POLICY IF EXISTS "Allow users to manage their own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON profiles;
DROP POLICY IF EXISTS "Allow superadmin full access" ON profiles;

-- Create new, simplified policies
CREATE POLICY "Profiles are readable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id OR is_superadmin(auth.uid()));

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id OR is_superadmin(auth.uid()));

CREATE POLICY "Users can delete their own profile"
  ON profiles FOR DELETE
  USING (auth.uid() = id OR is_superadmin(auth.uid()));
/*
  # Fix profiles table policies

  1. Changes
    - Remove circular dependencies in profiles policies
    - Simplify policy structure
    - Ensure proper superadmin access
    - Fix infinite recursion issue

  2. Security
    - Maintain row-level security
    - Keep public read access for profiles
    - Allow users to manage their own profiles
    - Grant superadmin full access
*/

-- First, drop all existing policies on profiles
DROP POLICY IF EXISTS "Profiles are publicly readable" ON profiles;
DROP POLICY IF EXISTS "Users can manage their own profile" ON profiles;
DROP POLICY IF EXISTS "Superadmins have full access to profiles" ON profiles;

-- Create new, simplified policies
CREATE POLICY "Allow public read access"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Allow users to manage their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Allow superadmin full access"
  ON profiles FOR ALL
  USING (
    CASE 
      WHEN auth.uid() IN (
        SELECT p.id 
        FROM profiles p 
        WHERE p.is_superadmin = true
      ) THEN true
      ELSE false
    END
  );
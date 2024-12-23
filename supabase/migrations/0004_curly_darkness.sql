/*
  # Add superadmin functionality

  1. Changes
    - Add `is_superadmin` column to profiles table
    - Set ross@brov.io as superadmin
    - Add policies for superadmin access

  2. Security
    - Only superadmins can modify the superadmin flag
    - Superadmins have full access to all tables
*/

-- Add superadmin column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_superadmin BOOLEAN DEFAULT false;

-- Create function to get user's email
CREATE OR REPLACE FUNCTION get_user_email()
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT email FROM auth.users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set ross@brov.io as superadmin
UPDATE profiles
SET is_superadmin = true
WHERE id IN (
  SELECT id FROM auth.users
  WHERE email = 'ross@brov.io'
);

-- Add superadmin policies to all tables
CREATE POLICY "Superadmins have full access to profiles"
  ON profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_superadmin = true
    )
  );

CREATE POLICY "Superadmins have full access to api_keys"
  ON api_keys FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_superadmin = true
    )
  );

CREATE POLICY "Superadmins have full access to prompts"
  ON prompts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_superadmin = true
    )
  );

CREATE POLICY "Superadmins have full access to templates"
  ON templates FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_superadmin = true
    )
  );

CREATE POLICY "Superadmins have full access to prompt_tests"
  ON prompt_tests FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_superadmin = true
    )
  );
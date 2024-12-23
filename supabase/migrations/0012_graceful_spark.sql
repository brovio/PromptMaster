/*
  # Add waitlist functionality
  
  1. New Tables
    - `waitlist`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `created_at` (timestamp)
      - `status` (text) - pending/approved/rejected
      - `notes` (text)
  
  2. Security
    - Enable RLS on waitlist table
    - Add policy for inserting new entries
    - Add policy for superadmins to manage entries
*/

CREATE TABLE waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to join waitlist
CREATE POLICY "Anyone can join waitlist"
  ON waitlist
  FOR INSERT
  WITH CHECK (true);

-- Only superadmins can view and manage waitlist
CREATE POLICY "Superadmins can manage waitlist"
  ON waitlist
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_superadmin = true
    )
  );
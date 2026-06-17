-- Add is_admin column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Create admin user
-- Note: You'll need to sign up manually with email 'admin@admin.com' and password 'RoboticsE'
-- Then update the profile to set is_admin = TRUE
-- Or you can insert directly into auth.users if you have access to Supabase SQL Editor

-- Update RLS policies to allow admins to see all data
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile or admins can view all"
  ON profiles FOR SELECT
  USING (auth.uid() = id OR is_admin = TRUE);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile or admins can update all"
  ON profiles FOR UPDATE
  USING (auth.uid() = id OR (
    SELECT is_admin FROM profiles WHERE id = auth.uid()
  ) = TRUE);

-- Allow admins to view all excavation runs
DROP POLICY IF EXISTS "Users can view own excavation_runs" ON excavation_runs;
CREATE POLICY "Users can view own excavation_runs or admins can view all"
  ON excavation_runs FOR SELECT
  USING (auth.uid() = user_id OR (
    SELECT is_admin FROM profiles WHERE id = auth.uid()
  ) = TRUE);

-- Allow admins to view all artifacts
DROP POLICY IF EXISTS "Users can view own artifacts" ON artifacts;
CREATE POLICY "Users can view own artifacts or admins can view all"
  ON artifacts FOR SELECT
  USING (auth.uid() = user_id OR (
    SELECT is_admin FROM profiles WHERE id = auth.uid()
  ) = TRUE);

-- Allow admins to manage lessons
DROP POLICY IF EXISTS "Anyone can view lessons" ON lessons;
CREATE POLICY "Anyone can view lessons"
  ON lessons FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can insert lessons"
  ON lessons FOR INSERT
  WITH CHECK ((
    SELECT is_admin FROM profiles WHERE id = auth.uid()
  ) = TRUE);

CREATE POLICY "Admins can update lessons"
  ON lessons FOR UPDATE
  USING ((
    SELECT is_admin FROM profiles WHERE id = auth.uid()
  ) = TRUE);

CREATE POLICY "Admins can delete lessons"
  ON lessons FOR DELETE
  USING ((
    SELECT is_admin FROM profiles WHERE id = auth.uid()
  ) = TRUE);

-- Allow admins to manage team missions
CREATE POLICY "Admins can insert team missions"
  ON team_missions FOR INSERT
  WITH CHECK ((
    SELECT is_admin FROM profiles WHERE id = auth.uid()
  ) = TRUE);

CREATE POLICY "Admins can update team missions"
  ON team_missions FOR UPDATE
  USING ((
    SELECT is_admin FROM profiles WHERE id = auth.uid()
  ) = TRUE);

CREATE POLICY "Admins can delete team missions"
  ON team_missions FOR DELETE
  USING ((
    SELECT is_admin FROM profiles WHERE id = auth.uid()
  ) = TRUE);

-- Create excavation sites table for admin to manage
CREATE TABLE IF NOT EXISTS excavation_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  era TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE excavation_sites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view excavation sites"
  ON excavation_sites FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can manage excavation sites"
  ON excavation_sites FOR ALL
  USING ((
    SELECT is_admin FROM profiles WHERE id = auth.uid()
  ) = TRUE);

-- Seed some initial excavation sites
INSERT INTO excavation_sites (name, location, era) VALUES
  ('Valley of the Kings', 'Egypt', 'Ancient Egypt'),
  ('Pompeii', 'Italy', 'Roman Empire'),
  ('Machu Picchu', 'Peru', 'Inca Civilization'),
  ('Stonehenge', 'England', 'Neolithic'),
  ('Terracotta Army', 'China', 'Qin Dynasty'),
  ('Göbekli Tepe', 'Turkey', 'Pre-Pottery Neolithic')
ON CONFLICT DO NOTHING;

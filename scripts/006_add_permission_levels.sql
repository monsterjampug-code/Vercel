-- Add permission_level to profiles (basic, beta_tester, admin)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS permission_level TEXT DEFAULT 'basic' CHECK (permission_level IN ('basic', 'beta_tester', 'admin'));

-- Migrate existing is_admin to permission_level
UPDATE profiles SET permission_level = 'admin' WHERE is_admin = TRUE;

-- Add status column to lessons (released or private)
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'released' CHECK (status IN ('released', 'private'));

-- Add status column to team_missions
ALTER TABLE team_missions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'released' CHECK (status IN ('released', 'private'));

-- Add status column to excavation_sites
ALTER TABLE excavation_sites ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'released' CHECK (status IN ('released', 'private'));

-- Update RLS policies for lessons to respect status and permission levels
DROP POLICY IF EXISTS "Anyone can view lessons" ON lessons;
CREATE POLICY "View lessons based on status and permission"
  ON lessons FOR SELECT
  USING (
    status = 'released' 
    OR 
    (SELECT permission_level FROM profiles WHERE id = auth.uid()) IN ('beta_tester', 'admin')
  );

-- Update RLS policies for team_missions
DROP POLICY IF EXISTS "Anyone can view team_missions" ON team_missions;
CREATE POLICY "View missions based on status and permission"
  ON team_missions FOR SELECT
  USING (
    status = 'released' 
    OR 
    (SELECT permission_level FROM profiles WHERE id = auth.uid()) IN ('beta_tester', 'admin')
  );

-- Update RLS policies for excavation_sites
DROP POLICY IF EXISTS "Anyone can view excavation sites" ON excavation_sites;
CREATE POLICY "View sites based on status and permission"
  ON excavation_sites FOR SELECT
  USING (
    status = 'released' 
    OR 
    (SELECT permission_level FROM profiles WHERE id = auth.uid()) IN ('beta_tester', 'admin')
  );

-- Update admin policies to use permission_level
DROP POLICY IF EXISTS "Admins can insert lessons" ON lessons;
CREATE POLICY "Admins can insert lessons"
  ON lessons FOR INSERT
  WITH CHECK ((SELECT permission_level FROM profiles WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Admins can update lessons" ON lessons;
CREATE POLICY "Admins can update lessons"
  ON lessons FOR UPDATE
  USING ((SELECT permission_level FROM profiles WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Admins can delete lessons" ON lessons;
CREATE POLICY "Admins can delete lessons"
  ON lessons FOR DELETE
  USING ((SELECT permission_level FROM profiles WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Admins can insert team missions" ON team_missions;
CREATE POLICY "Admins can insert team missions"
  ON team_missions FOR INSERT
  WITH CHECK ((SELECT permission_level FROM profiles WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Admins can update team missions" ON team_missions;
CREATE POLICY "Admins can update team missions"
  ON team_missions FOR UPDATE
  USING ((SELECT permission_level FROM profiles WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Admins can delete team missions" ON team_missions;
CREATE POLICY "Admins can delete team missions"
  ON team_missions FOR DELETE
  USING ((SELECT permission_level FROM profiles WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Admins can manage excavation sites" ON excavation_sites;
CREATE POLICY "Admins can manage excavation sites"
  ON excavation_sites FOR ALL
  USING ((SELECT permission_level FROM profiles WHERE id = auth.uid()) = 'admin');

-- Update view profile policy to use permission_level
DROP POLICY IF EXISTS "Users can view own profile or admins can view all" ON profiles;
CREATE POLICY "Users can view own profile or admins can view all"
  ON profiles FOR SELECT
  USING (
    auth.uid() = id 
    OR 
    (SELECT permission_level FROM profiles WHERE id = auth.uid()) = 'admin'
  );

DROP POLICY IF EXISTS "Users can update own profile or admins can update all" ON profiles;
CREATE POLICY "Users can update own profile or admins can update all"
  ON profiles FOR UPDATE
  USING (
    auth.uid() = id 
    OR 
    (SELECT permission_level FROM profiles WHERE id = auth.uid()) = 'admin'
  );

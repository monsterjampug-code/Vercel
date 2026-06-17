-- Complete RLS Reset - Remove all policies and create simple ones without recursion
-- This script solves the infinite recursion issue by avoiding admin checks in policies

-- ============================================
-- STEP 1: Drop ALL existing policies
-- ============================================

-- Profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update profiles" ON profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Admin full access to profiles" ON profiles;

-- Excavation runs
DROP POLICY IF EXISTS "Users can insert own runs" ON excavation_runs;
DROP POLICY IF EXISTS "Users can update own runs" ON excavation_runs;
DROP POLICY IF EXISTS "Users can view own runs" ON excavation_runs;
DROP POLICY IF EXISTS "Users can view excavation runs" ON excavation_runs;
DROP POLICY IF EXISTS "Users can insert excavation runs" ON excavation_runs;
DROP POLICY IF EXISTS "Users can update excavation runs" ON excavation_runs;
DROP POLICY IF EXISTS "Users can delete excavation runs" ON excavation_runs;
DROP POLICY IF EXISTS "Users can view own excavation_runs or admins can view all" ON excavation_runs;

-- Artifacts
DROP POLICY IF EXISTS "Users can view own artifacts or admins can view all" ON artifacts;
DROP POLICY IF EXISTS "Users can update artifacts" ON artifacts;
DROP POLICY IF EXISTS "Users can view artifacts" ON artifacts;
DROP POLICY IF EXISTS "Users can insert artifacts" ON artifacts;
DROP POLICY IF EXISTS "Users can delete artifacts" ON artifacts;
DROP POLICY IF EXISTS "Users can insert own artifacts" ON artifacts;
DROP POLICY IF EXISTS "Users can view own artifacts" ON artifacts;

-- Lessons
DROP POLICY IF EXISTS "Authenticated users can view lessons" ON lessons;
DROP POLICY IF EXISTS "Authenticated users can delete lessons" ON lessons;
DROP POLICY IF EXISTS "Admins can update lessons" ON lessons;
DROP POLICY IF EXISTS "Admins can delete lessons" ON lessons;
DROP POLICY IF EXISTS "Authenticated users can insert lessons" ON lessons;
DROP POLICY IF EXISTS "Authenticated users can update lessons" ON lessons;
DROP POLICY IF EXISTS "View lessons based on status and permission" ON lessons;
DROP POLICY IF EXISTS "Admins can insert lessons" ON lessons;

-- Team missions
DROP POLICY IF EXISTS "Admins can insert team missions" ON team_missions;
DROP POLICY IF EXISTS "Authenticated users can update missions" ON team_missions;
DROP POLICY IF EXISTS "Authenticated users can insert missions" ON team_missions;
DROP POLICY IF EXISTS "Authenticated users can delete missions" ON team_missions;
DROP POLICY IF EXISTS "Authenticated users can view missions" ON team_missions;
DROP POLICY IF EXISTS "Admins can delete team missions" ON team_missions;
DROP POLICY IF EXISTS "Admins can update team missions" ON team_missions;
DROP POLICY IF EXISTS "View missions based on status and permission" ON team_missions;
DROP POLICY IF EXISTS "Anyone can view team missions" ON team_missions;

-- Excavation sites
DROP POLICY IF EXISTS "View sites based on status and permission" ON excavation_sites;
DROP POLICY IF EXISTS "Admins can manage excavation sites" ON excavation_sites;
DROP POLICY IF EXISTS "Authenticated can view sites" ON excavation_sites;
DROP POLICY IF EXISTS "Authenticated can manage sites" ON excavation_sites;

-- Mission participants
DROP POLICY IF EXISTS "Users can manage own mission participants" ON mission_participants;
DROP POLICY IF EXISTS "Users can update their own participation" ON mission_participants;
DROP POLICY IF EXISTS "Users can join missions" ON mission_participants;
DROP POLICY IF EXISTS "Users can view mission participants" ON mission_participants;

-- User lesson progress
DROP POLICY IF EXISTS "Users can view own lesson progress" ON user_lesson_progress;
DROP POLICY IF EXISTS "Users can view their own lesson progress" ON user_lesson_progress;
DROP POLICY IF EXISTS "Users can update their own lesson progress" ON user_lesson_progress;
DROP POLICY IF EXISTS "Users can insert their own lesson progress" ON user_lesson_progress;

-- Sniffy customization
DROP POLICY IF EXISTS "Users can view own sniffy" ON sniffy_customization;
DROP POLICY IF EXISTS "Users can view their own Sniffy customization" ON sniffy_customization;
DROP POLICY IF EXISTS "Users can update their own Sniffy customization" ON sniffy_customization;
DROP POLICY IF EXISTS "Users can insert their own Sniffy customization" ON sniffy_customization;

-- ============================================
-- STEP 2: Create simple, non-recursive policies
-- ============================================

-- PROFILES: Everyone can read all profiles (needed for display names), users can only edit their own
CREATE POLICY "allow_all_authenticated_read_profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "allow_user_insert_own_profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "allow_user_update_own_profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- EXCAVATION RUNS: Users manage their own
CREATE POLICY "allow_user_own_excavation_runs"
  ON excavation_runs FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ARTIFACTS: Users manage their own
CREATE POLICY "allow_user_own_artifacts"
  ON artifacts FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- LESSONS: Everyone can read, authenticated can manage (admins control via app logic)
CREATE POLICY "allow_all_authenticated_read_lessons"
  ON lessons FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "allow_authenticated_manage_lessons"
  ON lessons FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- TEAM MISSIONS: Everyone can read, authenticated can manage
CREATE POLICY "allow_all_authenticated_read_missions"
  ON team_missions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "allow_authenticated_manage_missions"
  ON team_missions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- EXCAVATION SITES: Everyone can read, authenticated can manage
CREATE POLICY "allow_all_authenticated_read_sites"
  ON excavation_sites FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "allow_authenticated_manage_sites"
  ON excavation_sites FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- MISSION PARTICIPANTS: Users manage their own participation
CREATE POLICY "allow_user_own_mission_participation"
  ON mission_participants FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "allow_all_read_mission_participants"
  ON mission_participants FOR SELECT
  TO authenticated
  USING (true);

-- USER LESSON PROGRESS: Users manage their own
CREATE POLICY "allow_user_own_lesson_progress"
  ON user_lesson_progress FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- SNIFFY CUSTOMIZATION: Users manage their own
CREATE POLICY "allow_user_own_sniffy"
  ON sniffy_customization FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- STEP 3: Set joice.william@gmail.com as admin
-- ============================================

-- Update the user to admin status
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Find the user ID for joice.william@gmail.com
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'joice.william@gmail.com';
  
  IF admin_user_id IS NOT NULL THEN
    -- Update their profile to admin
    UPDATE profiles
    SET permission_level = 'admin',
        display_name = 'Admin'
    WHERE id = admin_user_id;
    
    RAISE NOTICE 'User joice.william@gmail.com set as admin';
  ELSE
    RAISE NOTICE 'User joice.william@gmail.com not found. Please sign up first.';
  END IF;
END $$;

-- Drop all existing problematic policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admin full access to profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can update all profiles" ON profiles;

DROP POLICY IF EXISTS "Users can view own runs" ON excavation_runs;
DROP POLICY IF EXISTS "Users can insert own runs" ON excavation_runs;
DROP POLICY IF EXISTS "Admin full access to runs" ON excavation_runs;

DROP POLICY IF EXISTS "Users can view own artifacts" ON artifacts;
DROP POLICY IF EXISTS "Users can insert own artifacts" ON artifacts;
DROP POLICY IF EXISTS "Admin full access to artifacts" ON artifacts;

DROP POLICY IF EXISTS "Anyone can view released lessons" ON lessons;
DROP POLICY IF EXISTS "Beta testers can view all lessons" ON lessons;
DROP POLICY IF EXISTS "Admin full access to lessons" ON lessons;

DROP POLICY IF EXISTS "Anyone can view released missions" ON team_missions;
DROP POLICY IF EXISTS "Beta testers can view all missions" ON team_missions;
DROP POLICY IF EXISTS "Admin full access to missions" ON team_missions;

-- Create simple, non-recursive policies for profiles
CREATE POLICY "Enable read access for authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Simple policies for excavation_runs (no admin check to avoid recursion)
CREATE POLICY "Users can view own runs"
  ON excavation_runs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own runs"
  ON excavation_runs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own runs"
  ON excavation_runs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Simple policies for artifacts
CREATE POLICY "Users can view own artifacts"
  ON artifacts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own artifacts"
  ON artifacts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Simple policies for lessons (everyone can view for now)
CREATE POLICY "Authenticated users can view lessons"
  ON lessons FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update lessons"
  ON lessons FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert lessons"
  ON lessons FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete lessons"
  ON lessons FOR DELETE
  TO authenticated
  USING (true);

-- Simple policies for team_missions
CREATE POLICY "Authenticated users can view missions"
  ON team_missions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update missions"
  ON team_missions FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert missions"
  ON team_missions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete missions"
  ON team_missions FOR DELETE
  TO authenticated
  USING (true);

-- Simple policies for other tables
CREATE POLICY "Authenticated can view sites"
  ON excavation_sites FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can manage sites"
  ON excavation_sites FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Users can view own lesson progress"
  ON user_lesson_progress FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own mission participants"
  ON mission_participants FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own sniffy"
  ON sniffy_customization FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

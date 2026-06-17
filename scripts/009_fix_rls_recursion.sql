-- Drop all existing policies that cause recursion
DROP POLICY IF EXISTS "Users can view own profile or admins can view all" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile or admins can update all" ON profiles;
DROP POLICY IF EXISTS "View lessons based on status and permission" ON lessons;
DROP POLICY IF EXISTS "View missions based on status and permission" ON team_missions;
DROP POLICY IF EXISTS "View sites based on status and permission" ON excavation_sites;
DROP POLICY IF EXISTS "Admins can insert lessons" ON lessons;
DROP POLICY IF EXISTS "Admins can update lessons" ON lessons;
DROP POLICY IF EXISTS "Admins can delete lessons" ON lessons;
DROP POLICY IF EXISTS "Admins can insert team missions" ON team_missions;
DROP POLICY IF EXISTS "Admins can update team missions" ON team_missions;
DROP POLICY IF EXISTS "Admins can delete team missions" ON team_missions;
DROP POLICY IF EXISTS "Admins can manage excavation sites" ON excavation_sites;
DROP POLICY IF EXISTS "Users can view their own excavation runs" ON excavation_runs;
DROP POLICY IF EXISTS "Users can insert their own excavation runs" ON excavation_runs;
DROP POLICY IF EXISTS "Users can update their own excavation runs" ON excavation_runs;
DROP POLICY IF EXISTS "Users can delete their own excavation runs" ON excavation_runs;
DROP POLICY IF EXISTS "Users can view their own artifacts" ON artifacts;
DROP POLICY IF EXISTS "Users can insert their own artifacts" ON artifacts;
DROP POLICY IF EXISTS "Users can update their own artifacts" ON artifacts;
DROP POLICY IF EXISTS "Users can delete their own artifacts" ON artifacts;

-- Create security definer function to check user permission without triggering RLS
CREATE OR REPLACE FUNCTION public.get_user_permission_level(user_uuid UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  perm_level TEXT;
BEGIN
  SELECT permission_level INTO perm_level
  FROM public.profiles
  WHERE id = user_uuid;
  
  RETURN COALESCE(perm_level, 'basic');
END;
$$;

-- Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (SELECT permission_level FROM public.profiles WHERE id = auth.uid()) = 'admin';
END;
$$;

-- Recreate profiles policies without recursion
CREATE POLICY "Users can view profiles"
  ON profiles FOR SELECT
  USING (
    auth.uid() = id 
    OR 
    public.get_user_permission_level(auth.uid()) = 'admin'
  );

CREATE POLICY "Users can update profiles"
  ON profiles FOR UPDATE
  USING (
    auth.uid() = id 
    OR 
    public.get_user_permission_level(auth.uid()) = 'admin'
  );

-- Recreate lessons policies
CREATE POLICY "View lessons based on status and permission"
  ON lessons FOR SELECT
  USING (
    status = 'released' 
    OR 
    public.get_user_permission_level(auth.uid()) IN ('beta_tester', 'admin')
  );

CREATE POLICY "Admins can insert lessons"
  ON lessons FOR INSERT
  WITH CHECK (public.get_user_permission_level(auth.uid()) = 'admin');

CREATE POLICY "Admins can update lessons"
  ON lessons FOR UPDATE
  USING (public.get_user_permission_level(auth.uid()) = 'admin');

CREATE POLICY "Admins can delete lessons"
  ON lessons FOR DELETE
  USING (public.get_user_permission_level(auth.uid()) = 'admin');

-- Recreate team missions policies
CREATE POLICY "View missions based on status and permission"
  ON team_missions FOR SELECT
  USING (
    status = 'released' 
    OR 
    public.get_user_permission_level(auth.uid()) IN ('beta_tester', 'admin')
  );

CREATE POLICY "Admins can insert team missions"
  ON team_missions FOR INSERT
  WITH CHECK (public.get_user_permission_level(auth.uid()) = 'admin');

CREATE POLICY "Admins can update team missions"
  ON team_missions FOR UPDATE
  USING (public.get_user_permission_level(auth.uid()) = 'admin');

CREATE POLICY "Admins can delete team missions"
  ON team_missions FOR DELETE
  USING (public.get_user_permission_level(auth.uid()) = 'admin');

-- Recreate excavation sites policies
CREATE POLICY "View sites based on status and permission"
  ON excavation_sites FOR SELECT
  USING (
    status = 'released' 
    OR 
    public.get_user_permission_level(auth.uid()) IN ('beta_tester', 'admin')
  );

CREATE POLICY "Admins can manage excavation sites"
  ON excavation_sites FOR ALL
  USING (public.get_user_permission_level(auth.uid()) = 'admin');

-- Recreate excavation runs policies (with admin access)
CREATE POLICY "Users can view excavation runs"
  ON excavation_runs FOR SELECT
  USING (
    auth.uid() = user_id 
    OR 
    public.get_user_permission_level(auth.uid()) = 'admin'
  );

CREATE POLICY "Users can insert excavation runs"
  ON excavation_runs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update excavation runs"
  ON excavation_runs FOR UPDATE
  USING (
    auth.uid() = user_id 
    OR 
    public.get_user_permission_level(auth.uid()) = 'admin'
  );

CREATE POLICY "Users can delete excavation runs"
  ON excavation_runs FOR DELETE
  USING (
    auth.uid() = user_id 
    OR 
    public.get_user_permission_level(auth.uid()) = 'admin'
  );

-- Recreate artifacts policies (with admin access)
CREATE POLICY "Users can view artifacts"
  ON artifacts FOR SELECT
  USING (
    auth.uid() = user_id 
    OR 
    public.get_user_permission_level(auth.uid()) = 'admin'
  );

CREATE POLICY "Users can insert artifacts"
  ON artifacts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update artifacts"
  ON artifacts FOR UPDATE
  USING (
    auth.uid() = user_id 
    OR 
    public.get_user_permission_level(auth.uid()) = 'admin'
  );

CREATE POLICY "Users can delete artifacts"
  ON artifacts FOR DELETE
  USING (
    auth.uid() = user_id 
    OR 
    public.get_user_permission_level(auth.uid()) = 'admin'
  );

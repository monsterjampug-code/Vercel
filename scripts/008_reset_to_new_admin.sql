-- Clear all existing data (safely handles if tables don't exist yet)
DO $$ 
BEGIN
  -- Delete in order of dependencies
  DELETE FROM mission_participants;
  DELETE FROM user_lesson_progress;
  DELETE FROM artifacts;
  DELETE FROM excavation_runs;
  DELETE FROM sniffy_customization;
  DELETE FROM profiles;
EXCEPTION
  WHEN undefined_table THEN
    RAISE NOTICE 'Some tables do not exist yet. Continuing...';
END $$;

-- Note: You need to manually delete users from the Supabase Authentication dashboard
-- Go to Authentication > Users and delete all users
-- Then create a new user with email: rocklockr@gmail.com and any password you want

-- After creating the user in Supabase, this function will make them admin
CREATE OR REPLACE FUNCTION make_user_admin(user_email TEXT)
RETURNS void AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Find the user by email
  SELECT id INTO user_id FROM profiles WHERE email = user_email;
  
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
  
  -- Update to admin
  UPDATE profiles 
  SET permission_level = 'admin',
      display_name = 'Admin'
  WHERE id = user_id;
  
  RAISE NOTICE 'User % is now an admin!', user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- After signing up with rocklockr@gmail.com and confirming your email, run:
-- SELECT make_user_admin('rocklockr@gmail.com');

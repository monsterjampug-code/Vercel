-- Delete all user data except for joice.william@gmail.com
-- First, find the user ID for joice.william@gmail.com
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Get the user ID for joice.william@gmail.com
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'joice.william@gmail.com';

  -- If user exists, delete all other users' data
  IF admin_user_id IS NOT NULL THEN
    -- Delete from all user-related tables (keep only admin user)
    DELETE FROM user_lesson_progress WHERE user_id != admin_user_id;
    DELETE FROM mission_participants WHERE user_id != admin_user_id;
    DELETE FROM artifacts WHERE user_id != admin_user_id;
    DELETE FROM excavation_runs WHERE user_id != admin_user_id;
    DELETE FROM sniffy_customization WHERE user_id != admin_user_id;
    DELETE FROM profiles WHERE id != admin_user_id;
    
    -- Note: We cannot delete from auth.users directly via SQL
    -- You'll need to delete other users from Supabase dashboard > Authentication > Users
    
    -- Set the remaining user as admin
    UPDATE profiles 
    SET permission_level = 'admin',
        display_name = 'Admin'
    WHERE id = admin_user_id;
    
    RAISE NOTICE 'Successfully set joice.william@gmail.com as admin and cleaned up data';
  ELSE
    RAISE NOTICE 'User joice.william@gmail.com not found. Please sign up first.';
  END IF;
END $$;

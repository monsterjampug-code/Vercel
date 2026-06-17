-- This script sets up the admin profile after the admin user is created
-- The admin account should be created through the API route at /api/setup-admin
-- Or through the /setup-admin page

-- Create a function to set up admin account after auth user is created
CREATE OR REPLACE FUNCTION setup_admin_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Find the admin user by email
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'admin@admin.com';
  
  -- If admin user exists, ensure their profile is set to admin
  IF admin_user_id IS NOT NULL THEN
    -- Using correct column names: display_name and email instead of username
    -- Update or insert the admin profile
    INSERT INTO profiles (id, display_name, email, permission_level)
    VALUES (admin_user_id, 'Admin', 'admin@admin.com', 'admin')
    ON CONFLICT (id) 
    DO UPDATE SET 
      permission_level = 'admin',
      display_name = 'Admin',
      email = 'admin@admin.com';
    
    -- Ensure admin has a Sniffy customization
    INSERT INTO sniffy_customization (user_id)
    VALUES (admin_user_id)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
END;
$$;

-- Run setup automatically if admin user exists
SELECT setup_admin_account();

-- Note: The recommended way is to visit /setup-admin page to create the admin account
-- Or use the /admin-login page which bypasses email confirmation entirely

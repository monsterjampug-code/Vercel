-- Create Feature Modules System
-- Allows admins to create entirely new feature sections dynamically

CREATE TABLE IF NOT EXISTS feature_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  display_name text NOT NULL,
  description text,
  icon text, -- Icon name or emoji
  route_path text NOT NULL UNIQUE, -- e.g., '/custom-feature'
  status text DEFAULT 'private' CHECK (status IN ('released', 'private')),
  required_permission text DEFAULT 'basic' CHECK (required_permission IN ('basic', 'beta_tester', 'admin')),
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  config jsonb DEFAULT '{}'::jsonb -- Store custom configuration for the module
);

-- Enable RLS
ALTER TABLE feature_modules ENABLE ROW LEVEL SECURITY;

-- Everyone can read active modules
CREATE POLICY "allow_all_authenticated_read_modules"
  ON feature_modules FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can manage (admin check happens in app)
CREATE POLICY "allow_authenticated_manage_modules"
  ON feature_modules FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default feature modules for existing features
INSERT INTO feature_modules (name, display_name, description, icon, route_path, status, required_permission, order_index) VALUES
  ('excavation', 'Start an Excavation', 'Begin a new archaeological dig and discover ancient artifacts', '⛏️', '/excavation', 'released', 'basic', 1),
  ('lessons', 'Lessons', 'Learn about archaeology and ancient civilizations', '📚', '/lessons', 'released', 'basic', 2),
  ('missions', 'Team Missions', 'Join collaborative archaeological expeditions', '🗺️', '/missions', 'released', 'basic', 3),
  ('sniffy', 'Customize Sniffy', 'Personalize your archaeological companion', '🐕', '/sniffy', 'released', 'basic', 4),
  ('artifacts', 'Artifact Library', 'View your collection of discovered artifacts', '🏺', '/artifacts', 'released', 'basic', 5)
ON CONFLICT (name) DO NOTHING;

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  photo_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create endorsements table
CREATE TABLE IF NOT EXISTS endorsements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  quote TEXT NOT NULL,
  photo_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE endorsements ENABLE ROW LEVEL SECURITY;

-- Create policies - everyone can read, only admins can modify
CREATE POLICY "Anyone can view team members"
  ON team_members FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert team members"
  ON team_members FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update team members"
  ON team_members FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete team members"
  ON team_members FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone can view endorsements"
  ON endorsements FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert endorsements"
  ON endorsements FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update endorsements"
  ON endorsements FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete endorsements"
  ON endorsements FOR DELETE
  USING (auth.role() = 'authenticated');

-- Add some sample data
INSERT INTO team_members (name, role, display_order) VALUES
  ('Dr. Sarah Mitchell', 'Lead Archaeologist', 1),
  ('Professor James Chen', 'Paleontologist', 2),
  ('Dr. Maria Rodriguez', 'Field Researcher', 3);

INSERT INTO endorsements (name, job_title, quote, display_order) VALUES
  ('Dr. Emily Watson', 'Museum Curator', 'This platform has revolutionized how we teach archaeology to the next generation.', 1),
  ('Robert Johnson', 'University Professor', 'An incredible tool for engaging students in the fascinating world of ancient history.', 2),
  ('Dr. Lisa Park', 'Archaeological Society Director', 'The best interactive archaeology experience available today.', 3);

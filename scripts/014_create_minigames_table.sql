-- Create table to track minigame scores
CREATE TABLE IF NOT EXISTS minigame_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  artifact_id UUID NOT NULL REFERENCES artifacts(id) ON DELETE CASCADE,
  game_type TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  high_score INTEGER NOT NULL DEFAULT 0,
  plays INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for minigame_scores
ALTER TABLE minigame_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own minigame scores"
  ON minigame_scores FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own minigame scores"
  ON minigame_scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own minigame scores"
  ON minigame_scores FOR UPDATE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX minigame_scores_user_id_idx ON minigame_scores(user_id);
CREATE INDEX minigame_scores_artifact_id_idx ON minigame_scores(artifact_id);

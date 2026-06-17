-- Seed some team missions
INSERT INTO public.team_missions (title, description, objective, reward, difficulty, max_participants) VALUES
  ('Desert Expedition', 'Join your team to uncover the lost treasures of an ancient desert civilization.', 'Excavate 3 rare artifacts from the Sahara site', 'Rare Desert Amulet', 'medium', 4),
  ('Fossil Hunt Challenge', 'Race against time to discover prehistoric fossils in a newly discovered site.', 'Find 5 different fossil types within 48 hours', 'Legendary T-Rex Tooth', 'hard', 3),
  ('Ancient Temple Quest', 'Explore the ruins of a mysterious temple and decode its secrets.', 'Complete all temple chambers and collect artifacts', 'Epic Golden Idol', 'expert', 4),
  ('Beginner Dig Site', 'Perfect for newcomers! Learn the basics while excavating a well-documented site.', 'Successfully complete your first excavation', 'Common Pottery Shards Set', 'easy', 6);

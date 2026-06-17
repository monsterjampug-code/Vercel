-- Seed some initial archaeology lessons
INSERT INTO public.lessons (title, category, content, difficulty, duration_minutes, image_url) VALUES
  ('Introduction to Archaeology', 'Basics', 'Learn the fundamentals of archaeological exploration, including site identification, excavation techniques, and artifact preservation.', 'beginner', 15, '/placeholder.svg?height=200&width=300'),
  ('Fossil Dating Techniques', 'Methods', 'Discover how scientists determine the age of fossils using radiometric dating, stratigraphy, and other scientific methods.', 'intermediate', 25, '/placeholder.svg?height=200&width=300'),
  ('Ancient Civilizations Overview', 'History', 'Explore the rise and fall of major ancient civilizations including Egypt, Rome, Greece, and Mesopotamia.', 'beginner', 20, '/placeholder.svg?height=200&width=300'),
  ('Dinosaur Era Deep Dive', 'Paleontology', 'Journey through the Mesozoic Era and learn about the different periods of dinosaur evolution.', 'intermediate', 30, '/placeholder.svg?height=200&width=300'),
  ('Advanced Excavation Strategies', 'Methods', 'Master advanced excavation techniques including grid systems, soil analysis, and preservation protocols.', 'advanced', 40, '/placeholder.svg?height=200&width=300');

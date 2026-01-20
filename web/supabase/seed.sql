-- Enable pgcrypto if not already
create extension if not exists "pgcrypto";

-- Create a test user: demo@flamefit.app / password123
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'authenticated',
  'authenticated',
  'demo@flamefit.app',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name": "Demo User"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Identity mapping
INSERT INTO auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'demo@flamefit.app',
  '{"sub": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11", "email": "demo@flamefit.app"}',
  'email',
  now(),
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Update profile with realistic data
UPDATE profiles 
SET 
  height = 180,
  weight = 82,
  goals = ARRAY['Build Muscle', 'Increase Strength'],
  preferences = '{"theme": "dark", "units": "metric"}'::jsonb
WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

-- Seed Exercises
INSERT INTO exercises (id, name, muscle_groups, difficulty, description, video_url) VALUES
  ('e1111111-1111-1111-1111-111111111111', 'Bench Press', ARRAY['Chest', 'Triceps', 'Shoulders'], 'intermediate', 'Classic compound movement for upper body strength', 'https://example.com/bench-press'),
  ('e2222222-2222-2222-2222-222222222222', 'Squat', ARRAY['Quads', 'Glutes', 'Hamstrings'], 'intermediate', 'King of leg exercises for lower body development', 'https://example.com/squat'),
  ('e3333333-3333-3333-3333-333333333333', 'Deadlift', ARRAY['Back', 'Glutes', 'Hamstrings'], 'advanced', 'Full body compound movement for overall strength', 'https://example.com/deadlift'),
  ('e4444444-4444-4444-4444-444444444444', 'Pull-ups', ARRAY['Back', 'Biceps'], 'intermediate', 'Bodyweight exercise for back and arm development', 'https://example.com/pullups'),
  ('e5555555-5555-5555-5555-555555555555', 'Overhead Press', ARRAY['Shoulders', 'Triceps'], 'intermediate', 'Shoulder strength and stability builder', 'https://example.com/ohp')
ON CONFLICT (id) DO NOTHING;

-- Seed Food Items
INSERT INTO food_items (id, name, brand, calories, protein, carbs, fats, serving_size) VALUES
  ('f1111111-1111-1111-1111-111111111111', 'Chicken Breast', 'Generic', 165, 31, 0, 3.6, '100g'),
  ('f2222222-2222-2222-2222-222222222222', 'White Rice', 'Generic', 130, 2.7, 28, 0.3, '100g cooked'),
  ('f3333333-3333-3333-3333-333333333333', 'Broccoli', 'Generic', 34, 2.8, 7, 0.4, '100g'),
  ('f4444444-4444-4444-4444-444444444444', 'Eggs', 'Generic', 155, 13, 1.1, 11, '2 large eggs'),
  ('f5555555-5555-5555-5555-555555555555', 'Oatmeal', 'Generic', 389, 17, 66, 7, '100g dry'),
  ('f6666666-6666-6666-6666-666666666666', 'Greek Yogurt', 'Generic', 59, 10, 3.6, 0.4, '100g'),
  ('f7777777-7777-7777-7777-777777777777', 'Banana', 'Generic', 89, 1.1, 23, 0.3, '1 medium'),
  ('f8888888-8888-8888-8888-888888888888', 'Protein Shake', 'Generic', 120, 24, 3, 1.5, '1 scoop (30g)')
ON CONFLICT (id) DO NOTHING;

-- Seed Today's Workout Session (Completed)
INSERT INTO workout_sessions (id, user_id, date, duration, name, status, created_at) VALUES
  ('w1111111-1111-1111-1111-111111111111', 
   'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 
   CURRENT_DATE, 
   45, 
   'Push Day - Chest & Triceps', 
   'completed',
   CURRENT_DATE + TIME '09:00:00')
ON CONFLICT (id) DO NOTHING;

-- Seed Set Logs for Today's Workout
INSERT INTO set_logs (workout_session_id, exercise_id, weight, reps, rpe, completed_at) VALUES
  ('w1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', 80, 8, 7.5, CURRENT_DATE + TIME '09:10:00'),
  ('w1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', 80, 8, 8.0, CURRENT_DATE + TIME '09:15:00'),
  ('w1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', 80, 7, 8.5, CURRENT_DATE + TIME '09:20:00'),
  ('w1111111-1111-1111-1111-111111111111', 'e5555555-5555-5555-5555-555555555555', 50, 10, 7.0, CURRENT_DATE + TIME '09:30:00'),
  ('w1111111-1111-1111-1111-111111111111', 'e5555555-5555-5555-5555-555555555555', 50, 9, 7.5, CURRENT_DATE + TIME '09:35:00')
ON CONFLICT (id) DO NOTHING;

-- Seed Today's Nutrient Logs

-- Breakfast
INSERT INTO nutrient_logs (id, user_id, date, meal_type, total_calories, total_protein, total_carbs, total_fats, created_at) VALUES
  ('n1111111-1111-1111-1111-111111111111',
   'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
   CURRENT_DATE,
   'breakfast',
   0, 0, 0, 0,
   CURRENT_DATE + TIME '07:30:00')
ON CONFLICT (id) DO NOTHING;

INSERT INTO nutrient_log_items (nutrient_log_id, food_item_id, quantity) VALUES
  ('n1111111-1111-1111-1111-111111111111', 'f5555555-5555-5555-5555-555555555555', 0.6),  -- 60g oatmeal
  ('n1111111-1111-1111-1111-111111111111', 'f6666666-6666-6666-6666-666666666666', 1.5),  -- 150g yogurt
  ('n1111111-1111-1111-1111-111111111111', 'f7777777-7777-7777-7777-777777777777', 1),    -- 1 banana
  ('n1111111-1111-1111-1111-111111111111', 'f8888888-8888-8888-8888-888888888888', 1)     -- 1 scoop protein
ON CONFLICT (id) DO NOTHING;

-- Lunch
INSERT INTO nutrient_logs (id, user_id, date, meal_type, total_calories, total_protein, total_carbs, total_fats, created_at) VALUES
  ('n2222222-2222-2222-2222-222222222222',
   'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
   CURRENT_DATE,
   'lunch',
   0, 0, 0, 0,
   CURRENT_DATE + TIME '12:30:00')
ON CONFLICT (id) DO NOTHING;

INSERT INTO nutrient_log_items (nutrient_log_id, food_item_id, quantity) VALUES
  ('n2222222-2222-2222-2222-222222222222', 'f1111111-1111-1111-1111-111111111111', 2),    -- 200g chicken
  ('n2222222-2222-2222-2222-222222222222', 'f2222222-2222-2222-2222-222222222222', 2),    -- 200g rice
  ('n2222222-2222-2222-2222-222222222222', 'f3333333-3333-3333-3333-333333333333', 1.5)   -- 150g broccoli
ON CONFLICT (id) DO NOTHING;

-- Snack
INSERT INTO nutrient_logs (id, user_id, date, meal_type, total_calories, total_protein, total_carbs, total_fats, created_at) VALUES
  ('n3333333-3333-3333-3333-333333333333',
   'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
   CURRENT_DATE,
   'snack',
   0, 0, 0, 0,
   CURRENT_DATE + TIME '15:00:00')
ON CONFLICT (id) DO NOTHING;

INSERT INTO nutrient_log_items (nutrient_log_id, food_item_id, quantity) VALUES
  ('n3333333-3333-3333-3333-333333333333', 'f6666666-6666-6666-6666-666666666666', 2),    -- 200g yogurt
  ('n3333333-3333-3333-3333-333333333333', 'f7777777-7777-7777-7777-777777777777', 1)     -- 1 banana
ON CONFLICT (id) DO NOTHING;

-- Seed an upcoming workout for tomorrow
INSERT INTO workout_sessions (id, user_id, date, duration, name, status, created_at) VALUES
  ('w2222222-2222-2222-2222-222222222222', 
   'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 
   CURRENT_DATE + INTERVAL '1 day', 
   NULL, 
   'Pull Day - Back & Biceps', 
   'planned',
   now())
ON CONFLICT (id) DO NOTHING;

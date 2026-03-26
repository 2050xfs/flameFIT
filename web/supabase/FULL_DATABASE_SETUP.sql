-- =============================================================================
-- flameFIT — COMPLETE DATABASE SETUP
-- Paste this entire file into the Supabase SQL Editor and run it.
-- Safe to re-run: uses CREATE TABLE IF NOT EXISTS and DO $$ everywhere.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- EXTENSIONS
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ---------------------------------------------------------------------------
-- PROFILES
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  email text,
  name text,
  height numeric,
  weight numeric,
  goals text[],
  preferences jsonb DEFAULT '{"theme": "system", "units": "metric"}'::jsonb,
  role text DEFAULT 'user',
  -- Subscription (added 2026-03-26)
  subscription_tier text NOT NULL DEFAULT 'free'
    CHECK (subscription_tier IN ('free', 'pro', 'elite')),
  subscription_started_at timestamp with time zone,
  subscription_expires_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add subscription columns if profiles table already existed
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='subscription_tier') THEN
    ALTER TABLE profiles ADD COLUMN subscription_tier text NOT NULL DEFAULT 'free'
      CHECK (subscription_tier IN ('free', 'pro', 'elite'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='subscription_started_at') THEN
    ALTER TABLE profiles ADD COLUMN subscription_started_at timestamp with time zone;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='subscription_expires_at') THEN
    ALTER TABLE profiles ADD COLUMN subscription_expires_at timestamp with time zone;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier ON profiles(subscription_tier);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='Users can view their own profile.') THEN
    CREATE POLICY "Users can view their own profile." ON profiles FOR SELECT USING (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='Users can update their own profile.') THEN
    CREATE POLICY "Users can update their own profile." ON profiles FOR UPDATE USING (auth.uid() = id);
  END IF;
END $$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ---------------------------------------------------------------------------
-- EXERCISES
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS exercises (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  muscle_groups text[] NOT NULL,
  video_url text,
  description text,
  difficulty text CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='exercises' AND policyname='Anyone can view exercises.') THEN
    CREATE POLICY "Anyone can view exercises." ON exercises FOR SELECT USING (true);
  END IF;
END $$;


-- ---------------------------------------------------------------------------
-- FOOD ITEMS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS food_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  brand text,
  calories numeric NOT NULL,
  protein numeric NOT NULL,
  carbs numeric NOT NULL,
  fats numeric NOT NULL,
  serving_size text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='food_items' AND policyname='Anyone can view food items.') THEN
    CREATE POLICY "Anyone can view food items." ON food_items FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='food_items' AND policyname='Anyone can insert food items.') THEN
    CREATE POLICY "Anyone can insert food items." ON food_items FOR INSERT WITH CHECK (true);
  END IF;
END $$;


-- ---------------------------------------------------------------------------
-- WORKOUT SESSIONS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS workout_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) NOT NULL,
  date timestamp with time zone DEFAULT now() NOT NULL,
  duration integer,
  name text,
  status text DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed')),
  program_author text,
  is_pro_template boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Add pro columns if table already existed
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='workout_sessions' AND column_name='program_author') THEN
    ALTER TABLE workout_sessions ADD COLUMN program_author text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='workout_sessions' AND column_name='is_pro_template') THEN
    ALTER TABLE workout_sessions ADD COLUMN is_pro_template boolean DEFAULT false;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_date ON workout_sessions(user_id, date);

ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='workout_sessions' AND policyname='Users can view their own workout sessions.') THEN
    CREATE POLICY "Users can view their own workout sessions." ON workout_sessions FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Users can insert their own workout sessions." ON workout_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Users can update their own workout sessions." ON workout_sessions FOR UPDATE USING (auth.uid() = user_id);
    CREATE POLICY "Users can delete their own workout sessions." ON workout_sessions FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;


-- ---------------------------------------------------------------------------
-- SET LOGS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS set_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_session_id uuid REFERENCES workout_sessions(id) ON DELETE CASCADE NOT NULL,
  exercise_id uuid REFERENCES exercises(id) NOT NULL,
  weight numeric,
  reps integer,
  rpe numeric,
  completed_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_set_logs_workout_session ON set_logs(workout_session_id);

ALTER TABLE set_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='set_logs' AND policyname='Users can view their own set logs.') THEN
    CREATE POLICY "Users can view their own set logs." ON set_logs FOR SELECT
      USING (EXISTS (SELECT 1 FROM workout_sessions WHERE workout_sessions.id = set_logs.workout_session_id AND workout_sessions.user_id = auth.uid()));
    CREATE POLICY "Users can insert their own set logs." ON set_logs FOR INSERT
      WITH CHECK (EXISTS (SELECT 1 FROM workout_sessions WHERE workout_sessions.id = set_logs.workout_session_id AND workout_sessions.user_id = auth.uid()));
    CREATE POLICY "Users can update their own set logs." ON set_logs FOR UPDATE
      USING (EXISTS (SELECT 1 FROM workout_sessions WHERE workout_sessions.id = set_logs.workout_session_id AND workout_sessions.user_id = auth.uid()));
    CREATE POLICY "Users can delete their own set logs." ON set_logs FOR DELETE
      USING (EXISTS (SELECT 1 FROM workout_sessions WHERE workout_sessions.id = set_logs.workout_session_id AND workout_sessions.user_id = auth.uid()));
  END IF;
END $$;


-- ---------------------------------------------------------------------------
-- NUTRIENT LOGS & ITEMS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS nutrient_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) NOT NULL,
  date date NOT NULL,
  meal_type text CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  total_calories numeric DEFAULT 0,
  total_protein numeric DEFAULT 0,
  total_carbs numeric DEFAULT 0,
  total_fats numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_nutrient_logs_user_date ON nutrient_logs(user_id, date);

ALTER TABLE nutrient_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='nutrient_logs' AND policyname='Users can view their own nutrient logs.') THEN
    CREATE POLICY "Users can view their own nutrient logs." ON nutrient_logs FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Users can insert their own nutrient logs." ON nutrient_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Users can update their own nutrient logs." ON nutrient_logs FOR UPDATE USING (auth.uid() = user_id);
    CREATE POLICY "Users can delete their own nutrient logs." ON nutrient_logs FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS nutrient_log_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nutrient_log_id uuid REFERENCES nutrient_logs(id) ON DELETE CASCADE NOT NULL,
  food_item_id uuid REFERENCES food_items(id) NOT NULL,
  quantity numeric DEFAULT 1,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_nutrient_log_items_log_id ON nutrient_log_items(nutrient_log_id);

ALTER TABLE nutrient_log_items ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='nutrient_log_items' AND policyname='Users can view their own nutrient log items.') THEN
    CREATE POLICY "Users can view their own nutrient log items." ON nutrient_log_items FOR SELECT
      USING (EXISTS (SELECT 1 FROM nutrient_logs WHERE nutrient_logs.id = nutrient_log_items.nutrient_log_id AND nutrient_logs.user_id = auth.uid()));
    CREATE POLICY "Users can insert their own nutrient log items." ON nutrient_log_items FOR INSERT
      WITH CHECK (EXISTS (SELECT 1 FROM nutrient_logs WHERE nutrient_logs.id = nutrient_log_items.nutrient_log_id AND nutrient_logs.user_id = auth.uid()));
    CREATE POLICY "Users can update their own nutrient log items." ON nutrient_log_items FOR UPDATE
      USING (EXISTS (SELECT 1 FROM nutrient_logs WHERE nutrient_logs.id = nutrient_log_items.nutrient_log_id AND nutrient_logs.user_id = auth.uid()));
    CREATE POLICY "Users can delete their own nutrient log items." ON nutrient_log_items FOR DELETE
      USING (EXISTS (SELECT 1 FROM nutrient_logs WHERE nutrient_logs.id = nutrient_log_items.nutrient_log_id AND nutrient_logs.user_id = auth.uid()));
  END IF;
END $$;


-- ---------------------------------------------------------------------------
-- WATER LOGS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS water_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  amount numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_water_logs_user_date ON water_logs(user_id, date);

ALTER TABLE water_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='water_logs' AND policyname='Users can view their own water logs.') THEN
    CREATE POLICY "Users can view their own water logs." ON water_logs FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Users can insert their own water logs." ON water_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Users can update their own water logs." ON water_logs FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;


-- ---------------------------------------------------------------------------
-- WEIGHT LOGS (time-series; replaces body_stats for app use)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS weight_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  weight_kg numeric NOT NULL CHECK (weight_kg > 0),
  date date NOT NULL DEFAULT CURRENT_DATE,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_weight_logs_user_date ON weight_logs(user_id, date DESC);

ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='weight_logs' AND policyname='Users can manage their own weight logs') THEN
    CREATE POLICY "Users can manage their own weight logs" ON weight_logs FOR ALL
      USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;


-- ---------------------------------------------------------------------------
-- BODY STATS (kept for schema compatibility)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS body_stats (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  weight numeric NOT NULL,
  body_fat_pct numeric,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_body_stats_user_date ON body_stats(user_id, date);

ALTER TABLE body_stats ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='body_stats' AND policyname='Users can view their own body stats.') THEN
    CREATE POLICY "Users can view their own body stats." ON body_stats FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Users can insert their own body stats." ON body_stats FOR INSERT WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Users can update their own body stats." ON body_stats FOR UPDATE USING (auth.uid() = user_id);
    CREATE POLICY "Users can delete their own body stats." ON body_stats FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;


-- ---------------------------------------------------------------------------
-- READINESS LOGS (daily check-in: sleep / mood / soreness)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS readiness_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  sleep_hours numeric CHECK (sleep_hours BETWEEN 0 AND 24),
  sleep_quality integer CHECK (sleep_quality BETWEEN 1 AND 5),
  mood integer CHECK (mood BETWEEN 1 AND 5),
  soreness integer CHECK (soreness BETWEEN 1 AND 5),
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_readiness_logs_user_date ON readiness_logs(user_id, date DESC);

ALTER TABLE readiness_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='readiness_logs' AND policyname='Users can manage their own readiness logs') THEN
    CREATE POLICY "Users can manage their own readiness logs" ON readiness_logs FOR ALL
      USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;


-- ---------------------------------------------------------------------------
-- PROGRESS PHOTOS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS progress_photos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  storage_path text NOT NULL,
  public_url text,
  photo_date date NOT NULL DEFAULT CURRENT_DATE,
  label text,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_progress_photos_user_date ON progress_photos(user_id, photo_date DESC);

ALTER TABLE progress_photos ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='progress_photos' AND policyname='Users can manage their own progress photos') THEN
    CREATE POLICY "Users can manage their own progress photos" ON progress_photos FOR ALL
      USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;


-- ---------------------------------------------------------------------------
-- CHAT SESSIONS & MESSAGES
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) NOT NULL,
  title text DEFAULT 'New Chat',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_user ON chat_sessions(user_id);

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='chat_sessions' AND policyname='Users can view their own chat sessions.') THEN
    CREATE POLICY "Users can view their own chat sessions." ON chat_sessions FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Users can insert their own chat sessions." ON chat_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Users can update their own chat sessions." ON chat_sessions FOR UPDATE USING (auth.uid() = user_id);
    CREATE POLICY "Users can delete their own chat sessions." ON chat_sessions FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id uuid REFERENCES chat_sessions(id) ON DELETE CASCADE NOT NULL,
  role text CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  widget_data jsonb,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='chat_messages' AND policyname='Users can view messages from their sessions.') THEN
    CREATE POLICY "Users can view messages from their sessions." ON chat_messages FOR SELECT
      USING (EXISTS (SELECT 1 FROM chat_sessions WHERE chat_sessions.id = chat_messages.session_id AND chat_sessions.user_id = auth.uid()));
    CREATE POLICY "Users can insert messages into their sessions." ON chat_messages FOR INSERT
      WITH CHECK (EXISTS (SELECT 1 FROM chat_sessions WHERE chat_sessions.id = chat_messages.session_id AND chat_sessions.user_id = auth.uid()));
  END IF;
END $$;


-- ---------------------------------------------------------------------------
-- GENERATED WORKOUTS (Spark Architect)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS generated_workouts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  estimated_duration int,
  total_volume int,
  cns_intensity text CHECK (cns_intensity IN ('low', 'moderate', 'high', 'extreme')),
  estimated_calories int,
  exercises jsonb NOT NULL DEFAULT '[]'::jsonb,
  generation_prompt text,
  spark_insight text,
  tags text[] DEFAULT '{}',
  muscle_groups text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_generated_workouts_user_id ON generated_workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_workouts_created_at ON generated_workouts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generated_workouts_tags ON generated_workouts USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_generated_workouts_muscle_groups ON generated_workouts USING gin(muscle_groups);

ALTER TABLE generated_workouts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='generated_workouts' AND policyname='Users can view their own generated workouts') THEN
    CREATE POLICY "Users can view their own generated workouts" ON generated_workouts FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Users can insert their own generated workouts" ON generated_workouts FOR INSERT WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Users can update their own generated workouts" ON generated_workouts FOR UPDATE USING (auth.uid() = user_id);
    CREATE POLICY "Users can delete their own generated workouts" ON generated_workouts FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;


-- ---------------------------------------------------------------------------
-- PROGRAM TEMPLATES (Pro / Signature Series)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS program_templates (
  id text PRIMARY KEY,
  title text NOT NULL,
  creator text NOT NULL,
  description text,
  difficulty text CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  duration_weeks int,
  thumbnail_url text,
  curriculum jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE program_templates ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='program_templates' AND policyname='Allow public read access on program_templates') THEN
    CREATE POLICY "Allow public read access on program_templates" ON program_templates FOR SELECT USING (true);
  END IF;
END $$;


-- ---------------------------------------------------------------------------
-- PROGRAM SUBSCRIPTIONS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS program_subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  program_id text NOT NULL,
  subscribed_at timestamptz DEFAULT now(),
  status text DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  current_week int DEFAULT 1,
  completed_chapters text[] DEFAULT '{}',
  UNIQUE(user_id, program_id)
);

CREATE INDEX IF NOT EXISTS idx_program_subscriptions_user_id ON program_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_program_subscriptions_program_id ON program_subscriptions(program_id);

ALTER TABLE program_subscriptions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='program_subscriptions' AND policyname='Users can view their own subscriptions') THEN
    CREATE POLICY "Users can view their own subscriptions" ON program_subscriptions FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Users can create their own subscriptions" ON program_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Users can update their own subscriptions" ON program_subscriptions FOR UPDATE USING (auth.uid() = user_id);
    CREATE POLICY "Users can delete their own subscriptions" ON program_subscriptions FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;


-- ---------------------------------------------------------------------------
-- KNOWLEDGE BASE
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS knowledge_base_content (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  category text CHECK (category IN ('strength', 'cardio', 'mobility', 'nutrition', 'recovery')),
  tags text[],
  duration text,
  difficulty text CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  thumbnail_url text,
  video_url text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE knowledge_base_content ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='knowledge_base_content' AND policyname='Anyone can view knowledge base content.') THEN
    CREATE POLICY "Anyone can view knowledge base content." ON knowledge_base_content FOR SELECT USING (true);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS knowledge_base_bookmarks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) NOT NULL,
  content_id uuid REFERENCES knowledge_base_content(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, content_id)
);

CREATE INDEX IF NOT EXISTS idx_kb_bookmarks_user ON knowledge_base_bookmarks(user_id);

ALTER TABLE knowledge_base_bookmarks ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='knowledge_base_bookmarks' AND policyname='Users can view their own bookmarks.') THEN
    CREATE POLICY "Users can view their own bookmarks." ON knowledge_base_bookmarks FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Users can insert their own bookmarks." ON knowledge_base_bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Users can delete their own bookmarks." ON knowledge_base_bookmarks FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;


-- ---------------------------------------------------------------------------
-- UPDATED_AT TRIGGER (shared function)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_generated_workouts_updated_at ON generated_workouts;
CREATE TRIGGER update_generated_workouts_updated_at
  BEFORE UPDATE ON generated_workouts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_program_templates_updated_at ON program_templates;
CREATE TRIGGER update_program_templates_updated_at
  BEFORE UPDATE ON program_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ---------------------------------------------------------------------------
-- STORAGE BUCKET: progress-photos
-- Run this AFTER the SQL above. Supabase Storage is configured separately,
-- but the INSERT below will create the bucket if the storage schema exists.
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('progress-photos', 'progress-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own photos
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Users can upload their own progress photos') THEN
    CREATE POLICY "Users can upload their own progress photos"
      ON storage.objects FOR INSERT TO authenticated
      WITH CHECK (bucket_id = 'progress-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

    CREATE POLICY "Users can read their own progress photos"
      ON storage.objects FOR SELECT TO authenticated
      USING (bucket_id = 'progress-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

    CREATE POLICY "Public can read progress photos"
      ON storage.objects FOR SELECT TO anon
      USING (bucket_id = 'progress-photos');

    CREATE POLICY "Users can delete their own progress photos"
      ON storage.objects FOR DELETE TO authenticated
      USING (bucket_id = 'progress-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;
END $$;


-- ---------------------------------------------------------------------------
-- DONE
-- All tables, RLS policies, indexes, triggers, and storage bucket created.
-- ---------------------------------------------------------------------------

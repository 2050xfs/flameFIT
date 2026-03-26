-- Migration: subscription_tier, readiness logs, weight logs, progress photos

-- 1. Add subscription_tier to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS subscription_tier text NOT NULL DEFAULT 'free'
    CHECK (subscription_tier IN ('free', 'pro', 'elite')),
  ADD COLUMN IF NOT EXISTS subscription_started_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS subscription_expires_at timestamp with time zone;

-- Index for fast tier lookup
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier ON profiles(subscription_tier);

-- 2. Readiness logs — daily sleep/mood/soreness inputs
CREATE TABLE IF NOT EXISTS readiness_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  sleep_hours numeric CHECK (sleep_hours BETWEEN 0 AND 24),
  sleep_quality integer CHECK (sleep_quality BETWEEN 1 AND 5),
  mood integer CHECK (mood BETWEEN 1 AND 5),
  soreness integer CHECK (soreness BETWEEN 1 AND 5),
  notes text,
  created_at timestamp with time zone DEFAULT now()
);

-- One log per user per day
CREATE UNIQUE INDEX IF NOT EXISTS idx_readiness_logs_user_date ON readiness_logs(user_id, date);

ALTER TABLE readiness_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own readiness logs"
  ON readiness_logs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3. Weight logs — time-series weight tracking
CREATE TABLE IF NOT EXISTS weight_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  weight_kg numeric NOT NULL CHECK (weight_kg > 0),
  date date NOT NULL DEFAULT CURRENT_DATE,
  notes text,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_weight_logs_user_date ON weight_logs(user_id, date DESC);

ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own weight logs"
  ON weight_logs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Progress photos
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

CREATE POLICY "Users can manage their own progress photos"
  ON progress_photos FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

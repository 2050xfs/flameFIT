-- Migration: Add Generated Workouts and Program Subscriptions
-- Created: 2026-01-19
-- Purpose: Enable cross-device persistence for Spark-generated workouts and pro program ownership

-- ============================================================================
-- 1. GENERATED WORKOUTS TABLE
-- ============================================================================
-- Stores user-created workout protocols from the Spark Architect
create table if not exists generated_workouts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  
  -- Core Info
  title text not null,
  description text,
  
  -- Metadata
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  -- Workout Stats
  estimated_duration int, -- minutes
  total_volume int, -- total sets * reps
  cns_intensity text check (cns_intensity in ('low', 'moderate', 'high', 'extreme')),
  estimated_calories int,
  
  -- Exercise Data (JSONB for flexibility)
  -- Format: [{exerciseId, name, sets, reps, notes}]
  exercises jsonb not null default '[]'::jsonb,
  
  -- AI Context
  generation_prompt text, -- Original user request
  spark_insight text, -- AI-generated training philosophy
  
  -- Tags for filtering
  tags text[] default '{}',
  muscle_groups text[] default '{}'
);

-- Indexes for performance
create index if not exists idx_generated_workouts_user_id on generated_workouts(user_id);
create index if not exists idx_generated_workouts_created_at on generated_workouts(user_id, created_at desc);
create index if not exists idx_generated_workouts_tags on generated_workouts using gin(tags);
create index if not exists idx_generated_workouts_muscle_groups on generated_workouts using gin(muscle_groups);

-- RLS Policies
alter table generated_workouts enable row level security;

create policy "Users can view their own generated workouts"
  on generated_workouts for select
  using (auth.uid() = user_id);

create policy "Users can insert their own generated workouts"
  on generated_workouts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own generated workouts"
  on generated_workouts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own generated workouts"
  on generated_workouts for delete
  using (auth.uid() = user_id);

-- ============================================================================
-- 2. PROGRAM SUBSCRIPTIONS TABLE
-- ============================================================================
-- Tracks user ownership and progress for premium workout programs
create table if not exists program_subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  program_id text not null, -- References program_templates.id (can be text or uuid)
  
  subscribed_at timestamptz default now(),
  status text default 'active' check (status in ('active', 'paused', 'completed')),
  
  -- Progress Tracking
  current_week int default 1,
  completed_chapters text[] default '{}',
  
  -- Ensure one subscription per user per program
  unique(user_id, program_id)
);

-- Indexes
create index if not exists idx_program_subscriptions_user_id on program_subscriptions(user_id);
create index if not exists idx_program_subscriptions_program_id on program_subscriptions(program_id);

-- RLS Policies
alter table program_subscriptions enable row level security;

create policy "Users can view their own subscriptions"
  on program_subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can create their own subscriptions"
  on program_subscriptions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own subscriptions"
  on program_subscriptions for update
  using (auth.uid() = user_id);

create policy "Users can delete their own subscriptions"
  on program_subscriptions for delete
  using (auth.uid() = user_id);

-- ============================================================================
-- 3. PROGRAM TEMPLATES TABLE
-- ============================================================================
-- Create the program templates table for premium workout programs
create table if not exists program_templates (
  id text primary key, -- Custom IDs like 'sadik-abs', 'aj-formula'
  title text not null,
  creator text not null,
  description text,
  difficulty text check (difficulty in ('beginner', 'intermediate', 'advanced')),
  duration_weeks int,
  thumbnail_url text,
  
  -- Rich Content (from PDFs in /workout inspo)
  curriculum jsonb default '[]'::jsonb,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS Policies for program_templates
alter table program_templates enable row level security;

create policy "Allow public read access on program_templates"
  on program_templates for select
  using (true);

-- ============================================================================
-- 4. TRIGGER FOR UPDATED_AT TIMESTAMPS
-- ============================================================================
-- Auto-update updated_at on row changes
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply to generated_workouts
drop trigger if exists update_generated_workouts_updated_at on generated_workouts;
create trigger update_generated_workouts_updated_at
  before update on generated_workouts
  for each row
  execute function update_updated_at_column();

-- Apply to program_templates
drop trigger if exists update_program_templates_updated_at on program_templates;
create trigger update_program_templates_updated_at
  before update on program_templates
  for each row
  execute function update_updated_at_column();

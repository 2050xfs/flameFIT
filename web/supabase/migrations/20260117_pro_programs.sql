-- Migration: Create Pro Program Tables
-- Run this in your Supabase SQL Editor

create table if not exists program_templates (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  creator text not null,
  description text,
  difficulty text check (difficulty in ('beginner', 'intermediate', 'advanced')),
  duration_weeks int,
  original_pdf_path text,
  created_at timestamp with time zone default now()
);

create table if not exists template_days (
  id uuid default gen_random_uuid() primary key,
  template_id uuid references program_templates(id) on delete cascade not null,
  day_number int not null,
  name text,
  unique(template_id, day_number)
);

create table if not exists template_exercises (
  id uuid default gen_random_uuid() primary key,
  day_id uuid references template_days(id) on delete cascade not null,
  exercise_id uuid references exercises(id) not null,
  set_count int,
  rep_range text,
  rpe_target int,
  rest_period int, -- seconds
  created_at timestamp with time zone default now()
);

-- Add markers to workout_sessions for pro tracking
do $$ 
begin
  if not exists (select 1 from information_schema.columns where table_name='workout_sessions' and column_name='program_author') then
    alter table workout_sessions add column program_author text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='workout_sessions' and column_name='is_pro_template') then
    alter table workout_sessions add column is_pro_template boolean default false;
  end if;
end $$;

-- Enable RLS
alter table program_templates enable row level security;
alter table template_days enable row level security;
alter table template_exercises enable row level security;

-- Basic Public Access (Read Only)
create policy "Allow public read access on program_templates" on program_templates for select using (true);
create policy "Allow public read access on template_days" on template_days for select using (true);
create policy "Allow public read access on template_exercises" on template_exercises for select using (true);

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Public User Data)
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  name text,
  height numeric, -- cm
  weight numeric, -- kg
  goals text[], -- array of strings
  preferences jsonb default '{"theme": "system", "units": "metric"}'::jsonb,
  role text default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Profiles
alter table profiles enable row level security;

create policy "Users can view their own profile."
  on profiles for select
  using ( auth.uid() = id );

create policy "Users can update their own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Trigger to create profile on signup
create function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- EXERCISES (Exercise Library)
create table exercises (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  muscle_groups text[] not null,
  video_url text,
  description text,
  difficulty text check (difficulty in ('beginner', 'intermediate', 'advanced')),
  created_at timestamp with time zone default now()
);

-- RLS for Exercises (public read, admin write)
alter table exercises enable row level security;

create policy "Anyone can view exercises."
  on exercises for select
  using ( true );


-- FOOD ITEMS (Cached Nutrition Data)
create table food_items (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  brand text,
  calories numeric not null,
  protein numeric not null,
  carbs numeric not null,
  fats numeric not null,
  serving_size text,
  created_at timestamp with time zone default now()
);

-- RLS for Food Items (public read)
alter table food_items enable row level security;

create policy "Anyone can view food items."
  on food_items for select
  using ( true );

create policy "Anyone can insert food items."
  on food_items for insert
  with check ( true );


-- WORKOUT SESSIONS
create table workout_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) not null,
  date timestamp with time zone default now() not null,
  duration integer, -- in minutes
  name text,
  status text default 'planned' check (status in ('planned', 'active', 'completed')),
  created_at timestamp with time zone default now()
);

-- RLS for Workout Sessions
alter table workout_sessions enable row level security;

create policy "Users can view their own workout sessions."
  on workout_sessions for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own workout sessions."
  on workout_sessions for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own workout sessions."
  on workout_sessions for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own workout sessions."
  on workout_sessions for delete
  using ( auth.uid() = user_id );

-- Index for dashboard queries
create index idx_workout_sessions_user_date on workout_sessions(user_id, date);


-- SET LOGS (Individual Set Performance)
create table set_logs (
  id uuid default gen_random_uuid() primary key,
  workout_session_id uuid references workout_sessions(id) on delete cascade not null,
  exercise_id uuid references exercises(id) not null,
  weight numeric,
  reps integer,
  rpe numeric, -- Rate of Perceived Exertion (1-10)
  completed_at timestamp with time zone default now()
);

-- RLS for Set Logs
alter table set_logs enable row level security;

create policy "Users can view their own set logs."
  on set_logs for select
  using ( 
    exists (
      select 1 from workout_sessions 
      where workout_sessions.id = set_logs.workout_session_id 
      and workout_sessions.user_id = auth.uid()
    )
  );

create policy "Users can insert their own set logs."
  on set_logs for insert
  with check ( 
    exists (
      select 1 from workout_sessions 
      where workout_sessions.id = set_logs.workout_session_id 
      and workout_sessions.user_id = auth.uid()
    )
  );

create policy "Users can update their own set logs."
  on set_logs for update
  using ( 
    exists (
      select 1 from workout_sessions 
      where workout_sessions.id = set_logs.workout_session_id 
      and workout_sessions.user_id = auth.uid()
    )
  );

create policy "Users can delete their own set logs."
  on set_logs for delete
  using ( 
    exists (
      select 1 from workout_sessions 
      where workout_sessions.id = set_logs.workout_session_id 
      and workout_sessions.user_id = auth.uid()
    )
  );

-- Index for workout detail queries
create index idx_set_logs_workout_session on set_logs(workout_session_id);


-- NUTRIENT LOGS (Daily Meal Logs)
create table nutrient_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) not null,
  date date not null,
  meal_type text check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack')),
  total_calories numeric default 0,
  total_protein numeric default 0,
  total_carbs numeric default 0,
  total_fats numeric default 0,
  created_at timestamp with time zone default now()
);

-- RLS for Nutrient Logs
alter table nutrient_logs enable row level security;

create policy "Users can view their own nutrient logs."
  on nutrient_logs for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own nutrient logs."
  on nutrient_logs for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own nutrient logs."
  on nutrient_logs for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own nutrient logs."
  on nutrient_logs for delete
  using ( auth.uid() = user_id );

-- Index for dashboard queries
create index idx_nutrient_logs_user_date on nutrient_logs(user_id, date);


-- NUTRIENT LOG ITEMS (Individual Food Items in Meals)
create table nutrient_log_items (
  id uuid default gen_random_uuid() primary key,
  nutrient_log_id uuid references nutrient_logs(id) on delete cascade not null,
  food_item_id uuid references food_items(id) not null,
  quantity numeric default 1, -- multiplier of serving size
  created_at timestamp with time zone default now()
);

-- RLS for Nutrient Log Items
alter table nutrient_log_items enable row level security;

create policy "Users can view their own nutrient log items."
  on nutrient_log_items for select
  using ( 
    exists (
      select 1 from nutrient_logs 
      where nutrient_logs.id = nutrient_log_items.nutrient_log_id 
      and nutrient_logs.user_id = auth.uid()
    )
  );

create policy "Users can insert their own nutrient log items."
  on nutrient_log_items for insert
  with check ( 
    exists (
      select 1 from nutrient_logs 
      where nutrient_logs.id = nutrient_log_items.nutrient_log_id 
      and nutrient_logs.user_id = auth.uid()
    )
  );

create policy "Users can update their own nutrient log items."
  on nutrient_log_items for update
  using ( 
    exists (
      select 1 from nutrient_logs 
      where nutrient_logs.id = nutrient_log_items.nutrient_log_id 
      and nutrient_logs.user_id = auth.uid()
    )
  );

create policy "Users can delete their own nutrient log items."
  on nutrient_log_items for delete
  using ( 
    exists (
      and nutrient_logs.user_id = auth.uid()
    )
  );

-- Index for log items
create index idx_nutrient_log_items_log_id on nutrient_log_items(nutrient_log_id);


-- MEALS (Legacy - kept for backward compatibility)
create table meals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  calories numeric not null,
  protein numeric not null,
  carbs numeric not null,
  fats numeric not null,
  serving_size text,
  meal_type text check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack')),
  logged_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Meals
alter table meals enable row level security;

create policy "Users can view their own meals."
  on meals for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own meals."
  on meals for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own meals."
  on meals for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own meals."
  on meals for delete
  using ( auth.uid() = user_id );


-- WATER LOGS (Daily Hydration Tracking)
create table water_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) not null,
  date date not null default current_date,
  amount numeric default 0,
  created_at timestamp with time zone default now(),
  unique(user_id, date)
);

-- RLS for Water Logs
alter table water_logs enable row level security;

create policy "Users can view their own water logs."
  on water_logs for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own water logs."
  on water_logs for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own water logs."
  on water_logs for update
  using ( auth.uid() = user_id );

-- INDEXES (already existing ones)
create index if not exists idx_water_logs_user_date on water_logs(user_id, date);

-- BODY STATS (Weight & Body Composition Tracking)
create table body_stats (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) not null,
  date date not null default current_date,
  weight numeric not null,
  body_fat_pct numeric,
  notes text,
  created_at timestamp with time zone default now(),
  unique(user_id, date)
);

-- RLS for Body Stats
alter table body_stats enable row level security;

create policy "Users can view their own body stats."
  on body_stats for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own body stats."
  on body_stats for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own body stats."
  on body_stats for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own body stats."
  on body_stats for delete
  using ( auth.uid() = user_id );

-- Index for history
create index if not exists idx_body_stats_user_date on body_stats(user_id, date);

-- KNOWLEDGE BASE CONTENT
create table knowledge_base_content (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  category text check (category in ('strength', 'cardio', 'mobility', 'nutrition', 'recovery')),
  tags text[],
  duration text,
  difficulty text check (difficulty in ('beginner', 'intermediate', 'advanced')),
  thumbnail_url text,
  video_url text,
  created_at timestamp with time zone default now()
);

-- RLS for Knowledge Base Content (Public Read)
alter table knowledge_base_content enable row level security;

create policy "Anyone can view knowledge base content."
  on knowledge_base_content for select
  using ( true );

-- KNOWLEDGE BASE BOOKMARKS
create table knowledge_base_bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) not null,
  content_id uuid references knowledge_base_content(id) on delete cascade not null,
  created_at timestamp with time zone default now(),
  unique(user_id, content_id)
);

-- RLS for Knowledge Base Bookmarks
alter table knowledge_base_bookmarks enable row level security;

create policy "Users can view their own bookmarks."
  on knowledge_base_bookmarks for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own bookmarks."
  on knowledge_base_bookmarks for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete their own bookmarks."
  on knowledge_base_bookmarks for delete
  using ( auth.uid() = user_id );

-- Index for bookmarks
create index idx_kb_bookmarks_user on knowledge_base_bookmarks(user_id);



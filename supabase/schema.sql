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


-- MEALS (Kitchen Log)
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

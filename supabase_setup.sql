-- 1. CLEANUP: Drop existing objects to ensure fresh setup
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- 2. TABLE SETUP: Create or Update profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  avatar_url text,
  website text,
  full_name text
);

-- Ensure columns exist (in case table was created previously without them)
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'username') then
    alter table profiles add column username text unique;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'full_name') then
    alter table profiles add column full_name text;
  end if;
end $$;

-- 3. SECURITY: Enable RLS and Policies
alter table profiles enable row level security;

-- Drop existing policies to ensure clean state
drop policy if exists "Public profiles are viewable by everyone." on profiles;
drop policy if exists "Users can insert their own profile." on profiles;
drop policy if exists "Users can update own profile." on profiles;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- 4. STORAGE: Set up Avatars bucket
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

drop policy if exists "Avatar images are publicly accessible." on storage.objects;
drop policy if exists "Anyone can upload an avatar." on storage.objects;
drop policy if exists "Anyone can update an avatar." on storage.objects;

create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Anyone can upload an avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' );

create policy "Anyone can update an avatar."
  on storage.objects for update
  with check ( bucket_id = 'avatars' );

-- 5. TRIGGER: Handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, username)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url', 
    new.email -- Use email as username to guarantee uniqueness
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    avatar_url = excluded.avatar_url,
    username = excluded.username;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6. TABLE SETUP: Create learned_signs table
-- Create a table for storing learned signs (both static and dynamic)
-- Create the table if it doesn't exist
create table if not exists learned_signs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null unique,
  type text not null check (type in ('static', 'dynamic')),
  data jsonb not null -- Stores landmarks (static) or motion path (dynamic)
);

-- Enable Row Level Security (RLS)
alter table learned_signs enable row level security;

-- Drop existing policies to ensure clean state
drop policy if exists "Public can view learned signs" on learned_signs;
drop policy if exists "Authenticated users can add signs" on learned_signs;
drop policy if exists "Only admin can add signs" on learned_signs;
drop policy if exists "Users can insert their own signs." on learned_signs;
drop policy if exists "Everyone can view learned signs." on learned_signs;

-- Create policies
-- Allow everyone to read learned signs (Public Knowledge Base)
create policy "Public can view learned signs"
  on learned_signs for select
  using (true);

-- Allow authenticated users to insert new signs (Teaching mode) - RESTRICTED TO ADMINS
create policy "Only admin can add signs"
  on learned_signs for insert
  with check (auth.jwt() ->> 'email' in ('aareevs@gmail.com', 'abahuguna2007@gmail.com'));

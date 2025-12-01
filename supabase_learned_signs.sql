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

-- Create policies
-- Allow everyone to read learned signs (Public Knowledge Base)
create policy "Public can view learned signs"
  on learned_signs for select
  using (true);

-- Allow authenticated users to insert new signs (Teaching mode) - RESTRICTED TO ADMIN
create policy "Only admin can add signs"
  on learned_signs for insert
  with check (auth.jwt() ->> 'email' = 'aareevs@gmail.com');

-- Allow users to update/delete their own signs (Optional, for now let's keep it simple)
-- You might want to add a user_id column if you want ownership tracking

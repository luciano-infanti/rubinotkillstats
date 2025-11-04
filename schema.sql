-- schema.sql
-- Run this in your Supabase SQL Editor to set up the database

-- Create tables
create table if not exists worlds (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

create table if not exists bosses (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

-- One row per calendar day the boss spawned (with total kills that day)
create table if not exists boss_daily_kills (
  id bigserial primary key,
  boss_id uuid references bosses(id) on delete cascade,
  world_id uuid references worlds(id) on delete cascade,
  day date not null,
  kills int not null check (kills >= 0),
  inserted_at timestamptz not null default now(),
  unique (boss_id, world_id, day)
);

-- Optional: store raw uploads for audit/debug
create table if not exists raw_uploads (
  id bigserial primary key,
  world_id uuid references worlds(id) on delete set null,
  uploaded_at timestamptz not null default now(),
  raw_text text not null
);

-- Seed the main world used in the sample
insert into worlds (name)
values ('Lunarian') on conflict (name) do nothing;

-- Enable Row Level Security
alter table worlds enable row level security;
alter table bosses enable row level security;
alter table boss_daily_kills enable row level security;
alter table raw_uploads enable row level security;

-- Public read policies
create policy "public read worlds" on worlds 
  for select using (true);

create policy "public read bosses" on bosses 
  for select using (true);

create policy "public read boss_daily_kills" on boss_daily_kills 
  for select using (true);

-- Insert policies for anonymous users
create policy "insert bosses" on bosses 
  for insert with check (true);

create policy "insert boss_daily_kills" on boss_daily_kills 
  for insert with check (true);

create policy "insert uploads" on raw_uploads 
  for insert with check (true);

-- Create indexes for better query performance
create index if not exists idx_boss_daily_kills_boss_id on boss_daily_kills(boss_id);
create index if not exists idx_boss_daily_kills_world_id on boss_daily_kills(world_id);
create index if not exists idx_boss_daily_kills_day on boss_daily_kills(day);
create index if not exists idx_raw_uploads_uploaded_at on raw_uploads(uploaded_at desc);

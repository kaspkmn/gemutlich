-- Gemütlich: one row holds all of your progress as JSON.
-- Run this once in the Supabase SQL editor.

create table if not exists public.german_progress (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Row level security on, with no policies: the public API can't read or write
-- this table at all. Only the site's server (using the secret key) can.
alter table public.german_progress enable row level security;

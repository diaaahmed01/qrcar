-- ============================================================
-- QrCar — Supabase SQL Schema
-- Run this in your Supabase project → SQL Editor → New Query
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Owners table ───
create table if not exists public.owners (
  id          uuid primary key,               -- matches auth.users.id
  name        text not null,
  phone       text not null,
  whatsapp    text,
  email       text,
  plate       text not null,
  car         text not null,
  avatar      text,
  bio         text,
  created_at  timestamptz default now()
);

-- ─── Pings table ───
create table if not exists public.pings (
  id          bigserial primary key,
  owner_id    uuid references public.owners(id) on delete cascade,
  sender_name text default 'Anonymous',
  reason      text not null,
  label       text,
  message     text,
  method      text not null check (method in ('in-app','whatsapp','sms')),
  read        boolean default false,
  created_at  timestamptz default now()
);

-- ─── Row Level Security ───
alter table public.owners enable row level security;
alter table public.pings  enable row level security;

-- Owners: anyone can read (needed for public QR scan page)
create policy "Public can read owners"
  on public.owners for select
  using (true);

-- Owners: only the owner themselves can insert/update
create policy "Owner can insert own profile"
  on public.owners for insert
  with check (auth.uid() = id);

create policy "Owner can update own profile"
  on public.owners for update
  using (auth.uid() = id);

-- Pings: anyone can insert (public ping action)
create policy "Anyone can create a ping"
  on public.pings for insert
  with check (true);

-- Pings: only the owner can read their own pings
create policy "Owner can read own pings"
  on public.pings for select
  using (auth.uid() = owner_id);

-- Pings: only the owner can mark pings as read
create policy "Owner can update own pings"
  on public.pings for update
  using (auth.uid() = owner_id);

-- ─── Real-time ───
-- Enable real-time for pings table
alter publication supabase_realtime add table public.pings;

-- ─── Indexes ───
create index if not exists idx_pings_owner_id   on public.pings(owner_id);
create index if not exists idx_pings_created_at on public.pings(created_at desc);
create index if not exists idx_owners_plate     on public.owners(plate);

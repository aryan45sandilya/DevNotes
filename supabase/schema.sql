-- ============================================================
-- DevOS Notes — Supabase Schema
-- Run this in Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- Users table
create table if not exists users (
  id          uuid primary key default gen_random_uuid(),
  email       text unique not null,
  name        text not null,
  password    text not null,
  created_at  timestamptz default now()
);

-- Folders table
create table if not exists folders (
  id          text primary key,
  user_id     uuid not null references users(id) on delete cascade,
  name        text not null,
  icon        text default 'Folder',
  color       text default 'cyan',
  created_at  timestamptz default now()
);

-- Notes table
create table if not exists notes (
  id          text primary key,
  user_id     uuid not null references users(id) on delete cascade,
  folder_id   text not null references folders(id) on delete cascade,
  title       text not null default 'Untitled',
  content     text not null default '',
  favorite    boolean default false,
  pinned      boolean default false,
  tags        text[] default '{}',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Sticky notes table
create table if not exists stickies (
  id          text primary key,
  user_id     uuid not null references users(id) on delete cascade,
  content     text not null default '',
  color       text default 'cyan',
  updated_at  timestamptz default now()
);

-- Activity logs table
create table if not exists activities (
  id          text primary key,
  user_id     uuid not null references users(id) on delete cascade,
  note_id     text not null,
  note_title  text not null,
  type        text not null,
  timestamp   timestamptz default now()
);

-- Indexes for performance
create index if not exists idx_folders_user_id   on folders(user_id);
create index if not exists idx_notes_user_id     on notes(user_id);
create index if not exists idx_notes_folder_id   on notes(folder_id);
create index if not exists idx_stickies_user_id  on stickies(user_id);
create index if not exists idx_activities_user_id on activities(user_id);

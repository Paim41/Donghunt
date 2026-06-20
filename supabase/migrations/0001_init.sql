-- Donghunt schema (run in Supabase SQL editor or via CLI)
-- Enable extensions
create extension if not exists "pgcrypto";

-- USERS (mirrors auth.users; profile row)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  created_at timestamptz not null default now()
);

-- ANIME
create table if not exists public.anime (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  cover_image text,
  genres text[] not null default '{}',
  status text not null default 'ongoing', -- ongoing | completed
  total_episodes int not null default 0,
  updated_at timestamptz not null default now()
);

-- EPISODES (servers stored as jsonb: [{ name, url }])
create table if not exists public.episodes (
  id uuid primary key default gen_random_uuid(),
  anime_id uuid not null references public.anime(id) on delete cascade,
  episode_number int not null,
  title text,
  thumbnail text,
  subtitles jsonb not null default '[]', -- [{ lang, url }] (VTT)
  servers jsonb not null default '[]',   -- [{ name, url }]
  unique (anime_id, episode_number)
);

-- WATCH HISTORY
create table if not exists public.watch_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  anime_id uuid not null references public.anime(id) on delete cascade,
  last_watched_episode int not null default 1,
  resume_timestamp numeric not null default 0, -- seconds into episode
  is_completed boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (user_id, anime_id)
);

-- BOOKMARKS / FAVORITES
create table if not exists public.bookmarks (
  user_id uuid not null references auth.users(id) on delete cascade,
  anime_id uuid not null references public.anime(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, anime_id)
);

-- Auto-create a profile row when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ROW LEVEL SECURITY
alter table public.anime enable row level security;
alter table public.episodes enable row level security;
alter table public.users enable row level security;
alter table public.watch_history enable row level security;
alter table public.bookmarks enable row level security;

-- Catalog is publicly readable (so guests can browse)
create policy "anime readable by all" on public.anime for select using (true);
create policy "episodes readable by all" on public.episodes for select using (true);

-- Users can read/update only their own profile
create policy "own profile select" on public.users for select using (auth.uid() = id);
create policy "own profile update" on public.users for update using (auth.uid() = id);

-- Watch history: owner-only access
create policy "own history select" on public.watch_history for select using (auth.uid() = user_id);
create policy "own history upsert" on public.watch_history for insert with check (auth.uid() = user_id);
create policy "own history update" on public.watch_history for update using (auth.uid() = user_id);

-- Bookmarks: owner-only access
create policy "own bookmarks select" on public.bookmarks for select using (auth.uid() = user_id);
create policy "own bookmarks insert" on public.bookmarks for insert with check (auth.uid() = user_id);
create policy "own bookmarks delete" on public.bookmarks for delete using (auth.uid() = user_id);

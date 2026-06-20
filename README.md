# Donghunt

A modern anime / donghua **streaming + tracker** web app. Rebuilt from a single
`donghunt.html` prototype into a production-ready, modular Next.js application with
Supabase auth + database, Zustand state, and a premium dark glassmorphism UI.

> The original prototype is kept as `donghunt.html` for reference.

## Features

- **Auth gating** \u2013 the navbar only appears after you log in or choose *Continue as Guest*.
- **Supabase Auth** (email + password) and a **guest mode** (no login).
- **Real data** fetched from Supabase (no mock-only data in components).
- **Library** with responsive grid, debounced search, and genre/status filters.
- **Anime detail** page (poster, synopsis, episode list).
- **Video player** (React Player) with play/pause, seek, volume, **VTT subtitles**,
  and **multi-server switching with no page reload**.
- **Watch progress**: saved at most every 10s (throttled), with **auto-resume**.
- **Bookmarks/Favorites**, **Continue Watching**, **Recently Updated**.
- Framer Motion animations, lazy-loaded images, dynamic imports.

## Tech stack

Next.js (React) \u00b7 TailwindCSS \u00b7 Zustand \u00b7 Supabase \u00b7 React Player \u00b7 Framer Motion

## Project structure

```
src/
  pages/        index, login, browse, anime/[id], watch/[id], _app, _document
  components/   Navbar, AnimeCard, AnimeGrid, VideoPlayer, ServerSwitcher, ProgressBar
  store/        useStore.js (Zustand)
  lib/          supabaseClient.js, auth.js, api.js
  styles/       globals.css
supabase/
  migrations/0001_init.sql
  seed.sql
```

## Getting started

### 1. Install

```bash
npm install
```

### 2. Create a Supabase project

1. Go to https://supabase.com and create a new project.
2. Open **Project Settings \u2192 API** and copy the **Project URL** and **anon public key**.

### 3. Configure environment

```bash
cp .env.example .env.local
```

Fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```

### 4. Set up the database

In the Supabase dashboard **SQL Editor**, run:

1. `supabase/migrations/0001_init.sql` \u2013 creates tables, RLS policies, and the
   trigger that creates a profile row on sign-up.
2. `supabase/seed.sql` \u2013 inserts an example catalog so the app shows real data.

(Or use the Supabase CLI: `supabase db push` then run the seed.)

### 5. Enable email auth

In **Authentication \u2192 Providers**, ensure **Email** is enabled. For quick local
testing you may disable "Confirm email".

### 6. Run

```bash
npm run dev
```

Open http://localhost:3000. Log in, sign up, or continue as guest.

## Database schema

- **users**: `id`, `email`, `created_at`
- **anime**: `id`, `title`, `description`, `cover_image`, `genres`, `status`, `total_episodes`
- **episodes**: `id`, `anime_id`, `episode_number`, `title`, `thumbnail`, `subtitles`, `servers` (`[{name,url}]`)
- **watch_history**: `id`, `user_id`, `anime_id`, `last_watched_episode`, `resume_timestamp`, `is_completed`, `updated_at`
- **bookmarks**: `user_id`, `anime_id`, `created_at`

## Notes

- Catalog tables are publicly readable so guests can browse; user data is protected by RLS.
- Guest progress/bookmarks persist in `localStorage`; logged-in users sync to Supabase.
- Replace the seed's sample video URLs with your own sources.

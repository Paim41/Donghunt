<div align="center">

# 🎌 DongHunt

**Your personal anime & donghua library — browse, track, and collect.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-6C5CE7?style=flat-square)](https://donghunt.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=flat-square&logo=vercel)](https://vercel.com/)

</div>

---

## Overview

DongHunt is a modern web app for anime and donghua enthusiasts. Sign in, explore a curated library, save your favorites, and pick up where you left off — all backed by real-time data from Supabase.

---

## Features

- 🔐 **Authentication** — Secure sign-up and login via Supabase Auth
- 📚 **Library browsing** — Explore anime and donghua titles in one place
- ⭐ **Favorites** — Save and manage your personal watchlist
- 👤 **Guest mode** — Browse without an account
- ⚡ **Fast** — Built on Next.js with server-side rendering

---

## Tech Stack

<div align="center">
  
| Layer | Technology |
|---|---|
| Frontend | Next.js, React |
| Auth & Database | Supabase |
| Styling | Tailwind CSS |
| Deployment | Vercel |
</div>

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com/) project

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/donghuntdemo.git
cd donghuntdemo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set up the database

In your Supabase dashboard, open the **SQL Editor** and run these files in order:

```
supabase/migrations/0001_init.sql
supabase/seed.sql
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment

This project deploys to Vercel in minutes:

1. Push your repo to GitHub
2. Import it at [vercel.com/new](https://vercel.com/new)
3. Add your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variables
4. Click **Deploy**

---

## Roadmap

- [ ] Search and filter by genre, year, or status
- [ ] Episode progress tracking
- [ ] User reviews and ratings
- [ ] Improved mobile experience

---

## Notes

- `.env.local` is intentionally excluded from version control — never commit your keys
- Supabase Email Auth must be enabled in your project settings
- Restart the dev server after any changes to `.env.local`


---

## License

For educational purposes only.

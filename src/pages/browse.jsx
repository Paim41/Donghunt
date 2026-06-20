import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useStore } from '@/store/useStore';
import { getAnimeList } from '@/lib/api';
import AnimeGrid from '@/components/AnimeGrid';

// Library page: real Supabase data, responsive grid, search + genre/status filter.
const GENRES = ['Action', 'Fantasy', 'Adventure', 'Supernatural', 'Martial Arts', 'Drama'];
const STATUSES = ['ongoing', 'completed'];

export default function Browse() {
  const router = useRouter();
  const authReady = useStore((s) => s.authReady);
  const authed = useStore((s) => s.isAuthenticated());

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [status, setStatus] = useState('');

  // Guard: bounce to landing if not authenticated/guest.
  useEffect(() => {
    if (authReady && !authed) router.replace('/');
  }, [authReady, authed, router]);

  // Debounce the search input to avoid a query per keystroke.
  const [debounced, setDebounced] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    getAnimeList({ search: debounced, genre, status })
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [debounced, genre, status]);

  const selectClass = 'rounded-lg bg-black/30 px-3 py-2 text-sm text-white ring-1 ring-white/10 outline-none focus:ring-primary';

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-28">
      <h1 className="mb-6 font-heading text-3xl text-white">Browse</h1>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <input
          placeholder="Search titles\u2026"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg bg-black/30 px-4 py-2 text-white ring-1 ring-white/10 outline-none focus:ring-primary"
        />
        <select value={genre} onChange={(e) => setGenre(e.target.value)} className={selectClass}>
          <option value="">All genres</option>
          {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
          <option value="">Any status</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      {loading ? (
        <p className="py-16 text-center text-gray-400">Loading\u2026</p>
      ) : (
        <AnimeGrid items={items} />
      )}
    </main>
  );
}

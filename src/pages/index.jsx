import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { enableGuest } from '@/lib/auth';
import { getRecentlyUpdated, getWatchHistory } from '@/lib/api';
import AnimeGrid from '@/components/AnimeGrid';

// Landing / auth-gate. If not authenticated -> show hero + CTA (NO navbar).
// If authenticated -> show dashboard (Continue Watching, Recently Updated).
export default function Home() {
  const router = useRouter();
  const authReady = useStore((s) => s.authReady);
  const authed = useStore((s) => s.isAuthenticated());
  const user = useStore((s) => s.user);
  const setGuest = useStore((s) => s.setGuest);
  const bookmarks = useStore((s) => s.bookmarks);

  const [recent, setRecent] = useState([]);
  const [continueList, setContinueList] = useState([]);

  useEffect(() => {
    if (!authed) return;
    getRecentlyUpdated().then(setRecent).catch(console.error);
    if (user) {
      getWatchHistory(user.id)
        .then((rows) => setContinueList(rows.map((r) => r.anime).filter(Boolean)))
        .catch(console.error);
    }
  }, [authed, user]);

  const continueAsGuest = () => {
    enableGuest();
    setGuest(true);
    router.push('/browse');
  };

  if (!authReady) {
    return <div className="flex min-h-screen items-center justify-center text-gray-400">Loading</div>;
  }

  // --- Unauthenticated: landing/auth screen only ---
  if (!authed) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-5xl font-extrabold text-white sm:text-7xl"
        >
          DONG<span className="text-primary">HUNT</span>
        </motion.h1>
        <p className="mt-4 max-w-md text-gray-300">
          Track and stream your favorite donghua. Resume anywhere, on any device.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="rounded-xl bg-primary px-6 py-3 font-medium text-white shadow-glow transition hover:opacity-90"
          >
            Login / Sign up
          </Link>
          <button
            onClick={continueAsGuest}
            className="rounded-xl glass px-6 py-3 font-medium text-white transition hover:bg-white/10"
          >
            Continue as Guest
          </button>
        </div>
      </main>
    );
  }

  // --- Authenticated dashboard ---
  const bookmarkIds = Object.keys(bookmarks);
  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-28">
      {continueList.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 font-heading text-2xl text-white">Continue Watching</h2>
          <AnimeGrid items={continueList} />
        </section>
      )}
      <section className="mb-10">
        <h2 className="mb-4 font-heading text-2xl text-white">Recently Updated</h2>
        <AnimeGrid items={recent} />
      </section>
      {bookmarkIds.length > 0 && (
        <section>
          <h2 className="mb-4 font-heading text-2xl text-white">Your Favorites</h2>
          <AnimeGrid items={recent.filter((a) => bookmarks[a.id])} />
        </section>
      )}
    </main>
  );
}

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getAnimeById, getEpisodes } from '@/lib/api';
import { useStore } from '@/store/useStore';

// Anime detail: poster, synopsis, episode list.
export default function AnimeDetail() {
  const router = useRouter();
  const { id } = router.query;
  const isBookmarked = useStore((s) => (id ? s.isBookmarked(id) : false));
  const toggleBookmark = useStore((s) => s.toggleBookmark);

  const [anime, setAnime] = useState(null);
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    if (!id) return;
    getAnimeById(id).then(setAnime).catch(console.error);
    getEpisodes(id).then(setEpisodes).catch(console.error);
  }, [id]);

  if (!anime) {
    return <p className="pt-28 text-center text-gray-400">Loading\u2026</p>;
  }

  return (
    <main className="mx-auto max-w-5xl px-4 pb-16 pt-28">
      <div className="flex flex-col gap-6 md:flex-row">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative aspect-[2/3] w-full max-w-[260px] overflow-hidden rounded-2xl glass"
        >
          <Image src={anime.cover_image} alt={anime.title} fill sizes="260px" className="object-cover" />
        </motion.div>
        <div className="flex-1">
          <h1 className="font-heading text-3xl text-white">{anime.title}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            {(anime.genres || []).map((g) => (
              <span key={g} className="rounded-full bg-white/10 px-3 py-1 text-xs text-gray-200">{g}</span>
            ))}
            <span className="rounded-full bg-primary/30 px-3 py-1 text-xs capitalize text-white">{anime.status}</span>
          </div>
          <p className="mt-4 text-gray-300">{anime.description}</p>
          <button
            onClick={() => toggleBookmark(anime.id)}
            className="mt-5 rounded-xl glass px-5 py-2.5 text-sm text-white transition hover:bg-white/10"
          >
            {isBookmarked ? '★ Bookmarked' : '☆ Add to Favorites'}
          </button>
        </div>
      </div>

      <h2 className="mb-4 mt-10 font-heading text-2xl text-white">Episodes</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {episodes.map((ep) => (
          <Link
            key={ep.id}
            href={`/watch/${anime.id}?ep=${ep.episode_number}`}
            className="flex items-center gap-3 rounded-xl glass p-3 transition hover:bg-white/10"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-white">
              {ep.episode_number}
            </span>
            <span className="truncate text-sm text-gray-200">{ep.title || `Episode ${ep.episode_number}`}</span>
          </Link>
        ))}
        {!episodes.length && <p className="text-gray-400">No episodes yet.</p>}
      </div>
    </main>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ProgressBar from './ProgressBar';
import { useStore } from '@/store/useStore';

// Anime poster card with hover scale + glow and an episode progress bar.
export default function AnimeCard({ anime, progressPct = 0 }) {
  const isBookmarked = useStore((s) => s.isBookmarked(anime.id));
  const toggleBookmark = useStore((s) => s.toggleBookmark);

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      transition={{ type: 'spring', stiffness: 250, damping: 18 }}
      className="group relative overflow-hidden rounded-2xl glass hover:shadow-glow"
    >
      <Link href={`/anime/${anime.id}`} className="block">
        <div className="relative aspect-[2/3] w-full">
          <Image
            src={anime.cover_image}
            alt={anime.title}
            fill
            sizes="(max-width:768px) 50vw, 200px"
            loading="lazy"
            className="object-cover transition duration-300 group-hover:brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        </div>
        <div className="absolute bottom-0 w-full p-3">
          <h3 className="truncate font-heading text-sm font-semibold text-white">{anime.title}</h3>
          <p className="mb-2 truncate text-xs text-gray-300">{(anime.genres || []).slice(0, 2).join(' \u2022 ')}</p>
          {progressPct > 0 && <ProgressBar value={progressPct} />}
        </div>
      </Link>
      <button
        aria-label="Bookmark"
        onClick={() => toggleBookmark(anime.id)}
        className={`absolute right-2 top-2 rounded-full p-2 text-sm backdrop-blur transition ${
          isBookmarked ? 'bg-primary text-white' : 'bg-black/40 text-gray-200 hover:bg-black/60'
        }`}
      >
        {isBookmarked ? '\u2605' : '\u2606'}
      </button>
    </motion.div>
  );
}

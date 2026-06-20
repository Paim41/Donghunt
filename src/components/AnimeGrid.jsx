import AnimeCard from './AnimeCard';
import { useStore } from '@/store/useStore';

// Responsive grid of AnimeCards. Pulls progress from the store for each item.
export default function AnimeGrid({ items = [] }) {
  const progress = useStore((s) => s.progress);

  if (!items.length) {
    return <p className="py-16 text-center text-gray-400">No titles found.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {items.map((anime) => {
        const p = progress[anime.id];
        const pct = p && anime.total_episodes
          ? Math.round((p.episode / anime.total_episodes) * 100)
          : 0;
        return <AnimeCard key={anime.id} anime={anime} progressPct={pct} />;
      })}
    </div>
  );
}

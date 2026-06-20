import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getAnimeById, getEpisodes, getResume } from '@/lib/api';
import { useStore } from '@/store/useStore';
import VideoPlayer from '@/components/VideoPlayer';
import ServerSwitcher from '@/components/ServerSwitcher';

// Episode page: video player, server switcher, resume playback.
export default function Watch() {
  const router = useRouter();
  const { id, ep } = router.query;
  const episodeNumber = Number(ep) || 1;

  const user = useStore((s) => s.user);
  const saveProgress = useStore((s) => s.saveProgress);
  const getLocalProgress = useStore((s) => s.getProgress);

  const [anime, setAnime] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [activeServer, setActiveServer] = useState(0);
  const [resumeTime, setResumeTime] = useState(0);

  const currentEp = episodes.find((e) => e.episode_number === episodeNumber);

  useEffect(() => {
    if (!id) return;
    getAnimeById(id).then(setAnime).catch(console.error);
    getEpisodes(id).then(setEpisodes).catch(console.error);
  }, [id]);

  // Determine resume position: Supabase for users, local store for guests.
  useEffect(() => {
    if (!id) return;
    setActiveServer(0);
    (async () => {
      if (user) {
        const row = await getResume(user.id, id).catch(() => null);
        if (row && row.last_watched_episode === episodeNumber) setResumeTime(Number(row.resume_timestamp) || 0);
        else setResumeTime(0);
      } else {
        const p = getLocalProgress(id);
        setResumeTime(p && p.episode === episodeNumber ? p.time : 0);
      }
    })();
  }, [id, episodeNumber, user, getLocalProgress]);

  // Throttled callback wired from VideoPlayer (fires <= every 10s).
  const handleProgressSave = useCallback(
    (seconds) => {
      if (!id) return;
      saveProgress(id, { episode: episodeNumber, time: seconds, completed: false });
    },
    [id, episodeNumber, saveProgress]
  );

  const handleEnded = useCallback(() => {
    if (!id) return;
    saveProgress(id, { episode: episodeNumber, time: 0, completed: true });
  }, [id, episodeNumber, saveProgress]);

  if (!anime || !currentEp) {
    return <p className="pt-28 text-center text-gray-400">Loading</p>;
  }

  const servers = currentEp.servers || [];
  const currentUrl = servers[activeServer]?.url;

  return (
    <main className="mx-auto max-w-5xl px-4 pb-16 pt-28">
      <Link href={`/anime/${anime.id}`} className="text-sm text-accent hover:underline">
        \u2190 {anime.title}
      </Link>
      <h1 className="mb-4 mt-2 font-heading text-2xl text-white">
        Episode {currentEp.episode_number}{currentEp.title ? ` \u2013 ${currentEp.title}` : ''}
      </h1>

      {/* key forces a fresh resume seek when source changes; switching
          servers updates url in place (no reload) */}
      <VideoPlayer
        key={`${currentEp.id}`}
        url={currentUrl}
        subtitles={currentEp.subtitles || []}
        resumeTime={resumeTime}
        onProgressSave={handleProgressSave}
        onEnded={handleEnded}
      />

      <div className="mt-4">
        <p className="mb-2 text-sm text-gray-400">Servers</p>
        <ServerSwitcher servers={servers} active={activeServer} onChange={setActiveServer} />
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {episodes.map((e) => (
          <Link
            key={e.id}
            href={`/watch/${anime.id}?ep=${e.episode_number}`}
            className={`rounded-lg px-3 py-1.5 text-sm transition ${
              e.episode_number === episodeNumber ? 'bg-primary text-white' : 'glass text-gray-200 hover:bg-white/10'
            }`}
          >
            EP {e.episode_number}
          </Link>
        ))}
      </div>
    </main>
  );
}

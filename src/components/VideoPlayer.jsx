import { useEffect, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import throttle from 'lodash.throttle';

// react-player is client-only; load it dynamically to avoid SSR issues + blocking.
const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

// Video player with play/pause, seek, volume, subtitles (VTT), and
// throttled progress saving (at most once / 10s) + auto-resume.
export default function VideoPlayer({
  url,
  subtitles = [],
  resumeTime = 0,
  onProgressSave, // (seconds) => void
  onEnded,
}) {
  const playerRef = useRef(null);
  const resumedRef = useRef(false);

  // Throttle saves so we never "save every frame". Trailing call ensures the
  // last position within a window is still captured.
  const throttledSave = useMemo(
    () => throttle((seconds) => onProgressSave?.(seconds), 10000, { trailing: true }),
    [onProgressSave]
  );

  useEffect(() => () => throttledSave.cancel(), [throttledSave]);

  // Auto-resume once the player is ready.
  const handleReady = () => {
    if (!resumedRef.current && resumeTime > 1 && playerRef.current) {
      playerRef.current.seekTo(resumeTime, 'seconds');
      resumedRef.current = true;
    }
  };

  const tracks = subtitles.map((s, i) => ({
    kind: 'subtitles',
    src: s.url,
    srcLang: (s.lang || `s${i}`).slice(0, 2).toLowerCase(),
    label: s.lang || `Track ${i + 1}`,
    default: i === 0,
  }));

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl glass">
      <ReactPlayer
        ref={playerRef}
        url={url}
        width="100%"
        height="100%"
        controls // play/pause, seek bar, volume from native controls
        playing={false}
        onReady={handleReady}
        onProgress={({ playedSeconds }) => throttledSave(playedSeconds)}
        onEnded={onEnded}
        config={{ file: { attributes: { crossOrigin: 'anonymous' }, tracks } }}
      />
    </div>
  );
}

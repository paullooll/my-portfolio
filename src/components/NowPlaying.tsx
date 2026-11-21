import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Track } from "../../api/now-playing";
import { useAfterLoad } from "@/hooks/useAfterLoad";

/**
 * Live Spotify track for the Music card, from /api/now-playing (a Vercel
 * function). Fetched after page load; any failure (no keys, `pnpm dev`
 * without `vercel dev`, offline) quietly shows the fallback line.
 */
export function NowPlaying({ fallback }: { fallback: string }) {
  const ready = useAfterLoad();
  const [track, setTrack] = useState<Track | null>(null);

  useEffect(() => {
    if (!ready) return;
    const ctrl = new AbortController();
    fetch("/api/now-playing", { signal: ctrl.signal })
      .then(r => (r.ok ? r.json() : null))
      .then((d: { track?: Track | null } | null) => setTrack(d?.track ?? null))
      .catch(() => {}); // dev server returns HTML here: keep the fallback
    return () => ctrl.abort();
  }, [ready]);

  if (!track) return <p className="muted">{fallback}</p>;
  return (
    <div className="now-playing">
      {track.image && (
        <img src={track.image} alt="" width={48} height={48} loading="lazy" />
      )}
      <div>
        <p className="mono muted now-playing-label">
          {track.playing && <span className="live-dot" aria-hidden="true" />}
          {track.playing ? "Now playing" : "Last played"}
        </p>
        <a className="text-link" href={track.url} target="_blank" rel="noreferrer">
          {track.title} <ArrowUpRight size={14} aria-hidden="true" />
          <span className="sr-only"> (opens Spotify)</span>
        </a>
        <p className="muted">{track.artist}</p>
      </div>
    </div>
  );
}

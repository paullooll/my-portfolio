/**
 * Vercel function: GET /api/now-playing
 *
 * Returns what Paul is playing on Spotify right now, or the last track played:
 *   { track: { title, artist, url, image, playing } | null }
 *
 * Needs three SERVER-ONLY env vars (never VITE_*, they would reach the browser):
 *   SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN
 * Get the refresh token once with: node scripts/spotify-token.mjs
 *
 * Self-contained on purpose (no relative imports), so Vercel runs it as-is.
 */

export interface Track {
  title: string;
  artist: string;
  url: string;
  image: string | null;
  playing: boolean;
}

export interface SpotifyCreds {
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
}

interface SpotifyItem {
  name?: string;
  artists?: { name?: string }[];
  external_urls?: { spotify?: string };
  album?: { images?: { url?: string; width?: number }[] };
}

/** Spotify track object → our small shape. Null for podcasts, ads, junk. */
export function toTrack(item: SpotifyItem | null | undefined, playing: boolean): Track | null {
  const url = item?.external_urls?.spotify;
  if (!item?.name || !url || !/^https:\/\/open\.spotify\.com\//.test(url)) return null;
  // Smallest album image that is still >= 64px (the card shows it at 48px).
  const images = (item.album?.images ?? []).filter(i => i.url);
  const image =
    images
      .filter(i => (i.width ?? 0) >= 64)
      .sort((a, b) => (a.width ?? 0) - (b.width ?? 0))[0]?.url ??
    images[0]?.url ??
    null;
  return {
    title: item.name,
    artist: (item.artists ?? []).map(a => a.name).filter(Boolean).join(", "),
    url,
    image,
    playing,
  };
}

/** Refresh the access token, then ask for the current (or last) track. */
export async function fetchNowPlaying(
  creds: SpotifyCreds,
  fetchImpl: typeof fetch = globalThis.fetch
): Promise<Track | null> {
  const { clientId, clientSecret, refreshToken } = creds;
  if (!clientId || !clientSecret || !refreshToken) return null;

  const tokenRes = await fetchImpl("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }),
  });
  if (!tokenRes.ok) throw new Error(`Spotify token: HTTP ${tokenRes.status}`);
  const { access_token } = (await tokenRes.json()) as { access_token?: string };
  if (!access_token) throw new Error("Spotify token: no access_token");
  const auth = { headers: { Authorization: `Bearer ${access_token}` } };

  const now = await fetchImpl("https://api.spotify.com/v1/me/player/currently-playing", auth);
  if (now.status === 200) {
    const data = (await now.json()) as { is_playing?: boolean; item?: SpotifyItem };
    const track = toTrack(data.item, data.is_playing === true);
    if (track?.playing) return track;
  } else if (now.status !== 204) {
    throw new Error(`Spotify now playing: HTTP ${now.status}`);
  }

  // Nothing playing (or paused): show the last track instead.
  const recent = await fetchImpl(
    "https://api.spotify.com/v1/me/player/recently-played?limit=1",
    auth
  );
  if (!recent.ok) throw new Error(`Spotify recently played: HTTP ${recent.status}`);
  const { items } = (await recent.json()) as { items?: { track?: SpotifyItem }[] };
  return toTrack(items?.[0]?.track, false);
}

export async function GET(): Promise<Response> {
  let track: Track | null = null;
  try {
    track = await fetchNowPlaying({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      refreshToken: process.env.SPOTIFY_REFRESH_TOKEN,
    });
  } catch (err) {
    console.error(err);
  }
  return Response.json(
    { track },
    // Edge-cache briefly so visitors don't each hit Spotify's rate limit.
    { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" } }
  );
}

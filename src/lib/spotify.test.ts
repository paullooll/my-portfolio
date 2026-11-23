import { describe, expect, it } from "vitest";
import { fetchNowPlaying, toTrack } from "../../api/now-playing";

const item = {
  name: "Song",
  artists: [{ name: "A" }, { name: "B" }],
  external_urls: { spotify: "https://open.spotify.com/track/1" },
  album: {
    images: [
      { url: "big", width: 640 },
      { url: "mid", width: 300 },
      { url: "tiny", width: 32 },
    ],
  },
};
const creds = { clientId: "id", clientSecret: "secret", refreshToken: "rt" };

/** Fake fetch that answers by URL. */
function fakeFetch(routes: Record<string, () => Response>) {
  const calls: string[] = [];
  const impl = (async (input: RequestInfo | URL) => {
    const url = String(input);
    calls.push(url);
    const key = Object.keys(routes).find(k => url.includes(k));
    if (!key) throw new Error(`unexpected ${url}`);
    return routes[key]();
  }) as typeof fetch;
  return { impl, calls };
}
const token = () => Response.json({ access_token: "at" });

describe("toTrack", () => {
  it("maps a Spotify item and picks the smallest image >= 64px", () => {
    expect(toTrack(item, true)).toEqual({
      title: "Song",
      artist: "A, B",
      url: "https://open.spotify.com/track/1",
      image: "mid",
      playing: true,
    });
  });
  it("rejects podcasts/ads (no item) and non-Spotify links", () => {
    expect(toTrack(null, true)).toBeNull();
    expect(
      toTrack({ ...item, external_urls: { spotify: "javascript:alert(1)" } }, true)
    ).toBeNull();
  });
});

describe("fetchNowPlaying", () => {
  it("returns null without credentials (no network call)", async () => {
    const { impl, calls } = fakeFetch({});
    expect(await fetchNowPlaying({}, impl)).toBeNull();
    expect(calls).toEqual([]);
  });

  it("returns the current track when playing", async () => {
    const { impl } = fakeFetch({
      "/api/token": token,
      "currently-playing": () => Response.json({ is_playing: true, item }),
    });
    expect((await fetchNowPlaying(creds, impl))?.playing).toBe(true);
  });

  it("falls back to the last played track when nothing is playing (204)", async () => {
    const { impl } = fakeFetch({
      "/api/token": token,
      "currently-playing": () => new Response(null, { status: 204 }),
      "recently-played": () => Response.json({ items: [{ track: item }] }),
    });
    const t = await fetchNowPlaying(creds, impl);
    expect(t?.title).toBe("Song");
    expect(t?.playing).toBe(false);
  });

  it("throws on a rejected token so the handler can log it", async () => {
    const { impl } = fakeFetch({ "/api/token": () => new Response(null, { status: 400 }) });
    await expect(fetchNowPlaying(creds, impl)).rejects.toThrow("Spotify token");
  });
});

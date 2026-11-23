// One-time helper: get a Spotify refresh token for api/now-playing.ts.
//
// 1. Create an app at https://developer.spotify.com/dashboard
//    Redirect URI: http://127.0.0.1:8888/callback   (APIs used: Web API)
// 2. Run:  node scripts/spotify-token.mjs <client_id> <client_secret>
// 3. Open the printed link, approve, and copy the refresh token it prints into
//    Vercel as SPOTIFY_REFRESH_TOKEN (with SPOTIFY_CLIENT_ID / _SECRET).
// Read-only scopes: what's playing now and the last track played.
import { createServer } from "node:http";
import { randomBytes } from "node:crypto";

const [clientId, clientSecret] = process.argv.slice(2);
if (!clientId || !clientSecret) {
  console.error("Usage: node scripts/spotify-token.mjs <client_id> <client_secret>");
  process.exit(1);
}

const redirect = "http://127.0.0.1:8888/callback";
const state = randomBytes(16).toString("hex");
const authUrl =
  "https://accounts.spotify.com/authorize?" +
  new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirect,
    scope: "user-read-currently-playing user-read-recently-played",
    state,
  });

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", redirect);
  if (url.pathname !== "/callback") return res.writeHead(404).end();
  const code = url.searchParams.get("code");
  if (!code || url.searchParams.get("state") !== state) {
    res.writeHead(400).end("Missing code or wrong state. Run the script again.");
    return server.close();
  }
  try {
    const r = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: redirect }),
    });
    const data = await r.json();
    if (!r.ok || !data.refresh_token) throw new Error(JSON.stringify(data));
    console.log("\nSPOTIFY_REFRESH_TOKEN=" + data.refresh_token + "\n");
    res.end("Done. Copy the refresh token from your terminal. You can close this tab.");
  } catch (err) {
    console.error("Token exchange failed:", err.message);
    res.writeHead(500).end("Token exchange failed. See the terminal.");
  }
  server.close();
});

server.listen(8888, "127.0.0.1", () => {
  console.log("Open this link, sign in to Spotify and approve:\n\n" + authUrl + "\n");
});

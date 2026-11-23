// Cuts each fully visible phone out of a mockup: flood-fills the white background to transparent.
const sharp = require(process.env.SHARP), fs = require("fs"), path = require("path");
const src = "C:/Users/HP/Documents/Personal/Projects/ChorDefine/assets/images/screenshots/";
const out = path.join(__dirname, "phones");
const pick = { "App Feedback Page.jpg": "feedback", "ChordDetectingPage.jpg": "detect", "ChordDetectionOnboarding.jpg": "fret",
  "EarTrainer.png": "ear", "Lyrics Page.jpg": "lyrics", "MainInterface.png": "main", "Onboarding.jpg": "onboard",
  "Learning Page.jpg": "learn", "Learning Pages.jpg": "library", "Progress Tracking Page.png": "progress", "Tuner Page.png": "tuner", "Chord Detection Major Page.jpg": "chords" };
(async () => {
  for (const [file, name] of Object.entries(pick)) {
    const { data, info } = await sharp(src + file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const W = info.width, H = info.height, bg = new Uint8Array(W * H);
    const light = i => data[i * 4 + 3] < 20 || data[i * 4] > 225 && data[i * 4 + 1] > 225 && data[i * 4 + 2] > 225;
    const st = [];
    for (let x = 0; x < W; x++) st.push(x, (H - 1) * W + x);
    for (let y = 0; y < H; y++) st.push(y * W, y * W + W - 1);
    while (st.length) { const i = st.pop(); if (bg[i] || !light(i)) continue; bg[i] = 1; const x = i % W;
      if (x > 0) st.push(i - 1); if (x < W - 1) st.push(i + 1); if (i >= W) st.push(i - W); if (i < W * (H - 1)) st.push(i + W); }
    // column runs of phone pixels
    const colHas = x => { let n = 0; for (let y = 0; y < H; y++) if (!bg[y * W + x]) n++; return n > 300; };
    const runs = []; let s = -1;
    for (let x = 0; x <= W; x++) { const h = x < W && colHas(x); if (h && s < 0) s = x; if (!h && s >= 0) { runs.push([s, x]); s = -1; } }
    let k = 0;
    for (const [x0, x1] of runs) {
      if (x1 - x0 < 250 || x0 < 3 || x1 > W - 3) continue; // partially cut phones are skipped
      let y0 = H, y1 = 0;
      for (let y = 0; y < H; y++) for (let x = x0; x < x1; x++) if (!bg[y * W + x]) { if (y < y0) y0 = y; if (y > y1) y1 = y; break; }
      const w = x1 - x0, h = y1 - y0 + 1, buf = Buffer.alloc(w * h * 4);
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const si = (y + y0) * W + x + x0, di = (y * w + x) * 4;
        if (bg[si]) continue; data.copy(buf, di, si * 4, si * 4 + 4); }
      await sharp(buf, { raw: { width: w, height: h, channels: 4 } }).png().toFile(path.join(out, `${name}-${k++}.png`));
      console.log(name, k - 1, w, h);
    }
  }
})();

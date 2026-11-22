// Generates one Kokoro voice line per scene and reports each duration vs its slot.
import { KokoroTTS } from "kokoro-js";
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const voice = process.argv[2] || "af_heart";
const out = process.argv[3] || "lines";
mkdirSync(out, { recursive: true });

// [id, start (s), slot end (s), text] — "Chord Define" so it's pronounced right
// A project can pass its own module (3rd arg) exporting `lines` and `bounds` (scene edges).
const custom = process.argv[4] && (await import(pathToFileURL(resolve(process.argv[4]))));
const chordefineLines = [
  ["s1", 1.3, 4.2, "Meet Chord Define. Guitar practice, with real-time feedback."],
  ["s2", 4.5, 8.4, "Practising guitar alone? Nobody tells you when a chord is wrong."],
  ["s3", 8.7, 12.6, "Your practice partner. Learn, practise, explore, and tune."],
  ["s4", 12.8, 17.9, "Point the camera at your guitar. A model on the phone recognises the chord, and tells you if it's right."],
  ["s5", 18.3, 22.0, "A second model checks every finger on the fret."],
  ["s6", 22.3, 26.4, "Plus a tuner, an ear trainer, and sing-along songs."],
  ["s7", 26.7, 30.4, "Lessons and progress tracking, all offline."],
  ["s8", 30.9, 34.0, "Chord Define. Our thesis at West Visayas State University."],
];

const lines = custom ? custom.lines : chordefineLines;
const bounds = custom ? custom.bounds : [0, 4.2, 8.4, 12.6, 17.9, 22.0, 26.4, 30.4, 34.0];
const clips = [];
const tts = await KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX", { dtype: "q8", device: "cpu" });
for (const [id, start, end, text] of lines) {
  const audio = await tts.generate(text, { voice, speed: 1.05 });
  writeFileSync(`${out}/${id}.wav`, Buffer.from(audio.toWav()));
  const dur = audio.audio.length / audio.sampling_rate;
  const room = end - start - 0.2;
  clips.push({ id, file: `${id}.wav`, offset: start - bounds[clips.length], dur });
  console.log(id, dur.toFixed(2), "of", room.toFixed(2), dur > room ? "TOO LONG" : "ok");
}

// stretch each scene so its line fits with a short breath after it
const newBounds = [0];
clips.forEach((c, i) => {
  const len = bounds[i + 1] - bounds[i];
  newBounds.push(newBounds[i] + Math.max(len, c.offset + c.dur + (i === clips.length - 1 ? 1.6 : 0.5)));
});
const timing = { bounds, newBounds, clips: clips.map((c, i) => ({ file: c.file, at: +(newBounds[i] + c.offset).toFixed(3), dur: +c.dur.toFixed(3) })) };
writeFileSync(`${out}/timing.json`, JSON.stringify(timing, null, 2));
console.log("new length", newBounds.at(-1).toFixed(2));

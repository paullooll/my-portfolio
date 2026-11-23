/**
 * How the chat gets its answers.
 *
 * Default: the offline brain in haunt-brain.ts (instant, free, never invents).
 *
 * Optional upgrade to a real chatbot: set VITE_HAUNT_API_URL to your own
 * endpoint (e.g. a serverless function that calls an LLM with content.ts as
 * context). The page POSTs { question, history } and expects
 * { text: string, links?: { label, href }[] } back. Any error, timeout or bad
 * response falls back to the offline brain, so the chat never breaks.
 * Keep API keys on the server — never put them in VITE_* variables.
 */
import type { SiteContent } from "../content";
import { answer, type HauntLink, type HauntReply } from "./haunt-brain";

export interface ChatTurn {
  role: "user" | "haunt";
  text: string;
}

const isLink = (l: unknown): l is HauntLink =>
  !!l &&
  typeof (l as HauntLink).label === "string" &&
  typeof (l as HauntLink).href === "string" &&
  /^(https?:|mailto:|#|\/)/.test((l as HauntLink).href);

export async function askHaunt(
  question: string,
  history: ChatTurn[],
  c: SiteContent,
  endpoint?: string,
  fetchImpl: typeof fetch = globalThis.fetch
): Promise<HauntReply> {
  if (!endpoint) return answer(question, c);
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 12000);
    const res = await fetchImpl(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, history: history.slice(-6) }),
      signal: ctrl.signal,
    }).finally(() => clearTimeout(timer));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: unknown = await res.json();
    const text = (data as { text?: unknown }).text;
    if (typeof text !== "string" || !text.trim()) throw new Error("bad reply");
    const links = (data as { links?: unknown }).links;
    return {
      topic: "unknown",
      text: text.slice(0, 2000),
      links: Array.isArray(links) ? links.filter(isLink).slice(0, 4) : [],
    };
  } catch {
    return answer(question, c);
  }
}

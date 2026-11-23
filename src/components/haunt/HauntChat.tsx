import { type FormEvent, useEffect, useId, useRef, useState } from "react";
import { ArrowUp, X } from "lucide-react";
import content from "@/content";
import type { HauntLink } from "@/lib/haunt-brain";
import { askHaunt } from "@/lib/haunt-client";
import { prefersReducedMotion } from "@/motion/reducedMotion";
import { HauntSprite, type HauntState } from "./HauntSprite";

interface Message {
  id: number;
  role: "user" | "haunt";
  text: string;
  links?: HauntLink[];
}

/** Optional AI backend; without it Haunt answers offline from content.ts. */
const ENDPOINT = import.meta.env.VITE_HAUNT_API_URL as string | undefined;

/**
 * Haunt, the chat mascot. A launcher button in the corner opens a small,
 * non-modal chat panel that answers questions about Richie and this site.
 *
 * Accessibility: the panel is a labelled dialog region; new replies are read
 * out through a polite live region; Esc closes it and focus returns to the
 * launcher. It never auto-opens or auto-plays anything.
 */
export function HauntChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "haunt", text: content.haunt.greeting },
  ]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const [mood, setMood] = useState<HauntState>("idle");
  const nextId = useRef(1);
  const launcher = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const log = useRef<HTMLOListElement>(null);
  const titleId = useId();

  // Focus the input on open; Esc closes and returns focus to the launcher.
  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      launcher.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Keep the newest message in view.
  useEffect(() => {
    const el = log.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, thinking, open]);

  const send = async (question: string) => {
    const q = question.trim();
    if (!q || thinking) return;
    const history = messages.map(m => ({ role: m.role, text: m.text }));
    setMessages(m => [...m, { id: nextId.current++, role: "user", text: q }]);
    setDraft("");
    setThinking(true);
    setMood("talk");
    const started = Date.now();
    const reply = await askHaunt(q, history, content, ENDPOINT);
    // A short "typing" pause feels less abrupt; skipped with reduced motion.
    const wait = prefersReducedMotion() ? 0 : 350 - (Date.now() - started);
    if (wait > 0) await new Promise(r => setTimeout(r, wait));
    setMessages(m => [
      ...m,
      {
        id: nextId.current++,
        role: "haunt",
        text: reply.text,
        links: reply.links,
      },
    ]);
    setThinking(false);
    setMood(reply.topic === "unknown" ? "surprised" : "idle");
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(draft);
  };

  // On small screens the panel covers the page, so following a link closes it.
  const onLink = (href: string) => {
    if (href.startsWith("#") && window.innerWidth < 640) setOpen(false);
  };

  const asked = messages.some(m => m.role === "user");

  return (
    <div className="haunt-chat">
      {open && (
        <section
          id="haunt-panel"
          className="chat-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
        >
          <header className="chat-head">
            <HauntSprite state={mood} size={36} />
            <div>
              <h2 id={titleId}>Ask Haunt</h2>
              <p className="mono muted">
                {ENDPOINT
                  ? "AI assistant · may make mistakes"
                  : "Answers from this site only"}
              </p>
            </div>
            <button
              type="button"
              className="icon-button"
              onClick={() => {
                setOpen(false);
                launcher.current?.focus();
              }}
            >
              <X size={16} aria-hidden="true" />
              <span className="sr-only">Close chat</span>
            </button>
          </header>

          <ol className="chat-log" ref={log} aria-live="polite">
            {messages.map(m => (
              <li key={m.id} className={`msg msg-${m.role}`}>
                <span className="sr-only">
                  {m.role === "user" ? "You said:" : "Haunt said:"}
                </span>
                {m.text.split("\n").map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
                {m.links && m.links.length > 0 && (
                  <ul className="msg-links">
                    {m.links.map(l => (
                      <li key={l.href + l.label}>
                        <a
                          href={l.href}
                          onClick={() => onLink(l.href)}
                          {...(/^https?:/.test(l.href)
                            ? { target: "_blank", rel: "noreferrer" }
                            : {})}
                        >
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            {thinking && (
              <li className="msg msg-haunt msg-typing">
                <span className="sr-only">Haunt is typing</span>
                <span className="dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
              </li>
            )}
          </ol>

          {!asked && (
            <ul className="chat-suggestions" aria-label="Suggested questions">
              {content.haunt.suggestions.map(s => (
                <li key={s}>
                  <button
                    type="button"
                    className="chip"
                    onClick={() => void send(s)}
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <form className="chat-form" onSubmit={onSubmit}>
            <label htmlFor="haunt-input" className="sr-only">
              Ask Haunt a question
            </label>
            <input
              id="haunt-input"
              ref={input}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              placeholder="Ask about projects, skills…"
              autoComplete="off"
              maxLength={300}
            />
            <button
              type="submit"
              className="chat-send"
              disabled={!draft.trim() || thinking}
            >
              <ArrowUp size={16} aria-hidden="true" />
              <span className="sr-only">Send</span>
            </button>
          </form>
        </section>
      )}

      <button
        ref={launcher}
        type="button"
        className="chat-launcher"
        aria-expanded={open}
        aria-controls="haunt-panel"
        aria-label={open ? "Close chat with Haunt" : "Ask Haunt, the site assistant"}
        onClick={() => setOpen(o => !o)}
      >
        <HauntSprite state={open ? "talk" : "idle"} size={34} />
        <span className="chat-launcher-label" aria-hidden="true">
          {open ? "Close" : "Ask Haunt"}
        </span>
      </button>
    </div>
  );
}

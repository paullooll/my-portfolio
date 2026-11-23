import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Command } from "cmdk";
import {
  ArrowRight,
  Download,
  ExternalLink,
  FolderOpen,
  Mail,
  SunMoon,
  Terminal as TerminalIcon,
} from "lucide-react";
import content, { type SectionId } from "@/content";
import { useTheme } from "@/contexts/ThemeContext";
import { isFilled } from "@/lib/placeholder";
import { runCommand, type TerminalAction } from "@/lib/terminal";

export type PaletteMode = "palette" | "terminal";

interface Props {
  open: boolean;
  mode: PaletteMode;
  onOpenChange: (open: boolean) => void;
  onModeChange: (mode: PaletteMode) => void;
  onGoTo: (id: SectionId) => void;
}

function download(href: string) {
  const link = document.createElement("a");
  link.href = href;
  link.download = "";
  link.click();
}

const sectionIds = new Set(content.sections.map(s => s.id));

/**
 * Ctrl/Cmd+K palette: jump to a section or case study, switch theme, reach
 * contact links. Typing ">" (or pressing `) switches to the mini terminal.
 * Radix Dialog gives the focus trap, Esc, and focus return for free.
 */
export default function CommandPalette({
  open,
  mode,
  onOpenChange,
  onModeChange,
  onGoTo,
}: Props) {
  const { toggleTheme } = useTheme();
  // Set when an item navigates somewhere: focus then stays at the destination
  // instead of jumping back to whatever opened the palette.
  const navigated = useRef(false);

  const go = (hashOrId: string) => {
    navigated.current = true;
    onOpenChange(false);
    const id = hashOrId.replace(/^#/, "");
    // Wait a frame so the dialog has released scroll lock and focus.
    requestAnimationFrame(() => {
      if (sectionIds.has(id as SectionId)) onGoTo(id as SectionId);
      else window.location.hash = hashOrId;
    });
  };

  const run = (fn: () => void) => () => {
    onOpenChange(false);
    fn();
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="palette-overlay" />
        <Dialog.Content
          className="palette"
          aria-describedby={undefined}
          onCloseAutoFocus={e => {
            if (navigated.current) e.preventDefault();
            navigated.current = false;
          }}
        >
          <Dialog.Title className="sr-only">
            {mode === "terminal" ? "Terminal" : "Command palette"}
          </Dialog.Title>
          {mode === "terminal" ? (
            <Terminal
              onAction={a => {
                if (a.type === "close") onOpenChange(false);
                else if (a.type === "goto") go(a.hash);
                else if (a.type === "download") download(a.href);
              }}
              onBack={() => onModeChange("palette")}
            />
          ) : (
            <Command label="Command palette" loop>
              <div className="palette-search">
                <Command.Input
                  placeholder="Jump to… (type > for terminal)"
                  onValueChange={v => v.startsWith(">") && onModeChange("terminal")}
                />
                <kbd className="kbd">Esc</kbd>
              </div>
              <Command.List className="palette-list">
                <Command.Empty className="palette-empty">No results.</Command.Empty>
                <Command.Group heading="Sections">
                  {content.sections.map(s => (
                    <Command.Item
                      key={s.id}
                      value={`section ${s.plain}`}
                      onSelect={() => go(s.id)}
                    >
                      <ArrowRight size={15} aria-hidden="true" />
                      {s.plain}
                      <span className="palette-hint">{s.summary}</span>
                    </Command.Item>
                  ))}
                </Command.Group>
                <Command.Group heading="Case studies">
                  {content.projects.map(p => (
                    <Command.Item
                      key={p.id}
                      value={`project ${p.title} ${p.stack.join(" ")}`}
                      onSelect={() => go(`#project-${p.id}`)}
                    >
                      <FolderOpen size={15} aria-hidden="true" />
                      {p.title}
                      <span className="palette-hint">{p.type}</span>
                    </Command.Item>
                  ))}
                </Command.Group>
                <Command.Group heading="Actions">
                  {toggleTheme && (
                    <Command.Item value="toggle theme dark light" onSelect={run(toggleTheme)}>
                      <SunMoon size={15} aria-hidden="true" />
                      Toggle theme
                    </Command.Item>
                  )}
                  <Command.Item
                    value="open terminal console"
                    onSelect={() => onModeChange("terminal")}
                  >
                    <TerminalIcon size={15} aria-hidden="true" />
                    Open terminal
                    <kbd className="kbd palette-hint">`</kbd>
                  </Command.Item>
                  <Command.Item
                    value={`email ${content.email}`}
                    onSelect={run(() => (window.location.href = `mailto:${content.email}`))}
                  >
                    <Mail size={15} aria-hidden="true" />
                    Email me
                    <span className="palette-hint">{content.email}</span>
                  </Command.Item>
                  {isFilled(content.cv) && (
                    <Command.Item
                      value="download resume cv"
                      onSelect={run(() => download(content.cv as string))}
                    >
                      <Download size={15} aria-hidden="true" />
                      Download resume
                    </Command.Item>
                  )}
                  {content.socials.map(s => (
                    <Command.Item
                      key={s.label}
                      value={`social ${s.label}`}
                      onSelect={run(() => window.open(s.href, "_blank", "noopener"))}
                    >
                      <ExternalLink size={15} aria-hidden="true" />
                      {s.label}
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>
              <p className="palette-foot mono" aria-hidden="true">
                <span><kbd className="kbd">↑</kbd><kbd className="kbd">↓</kbd> move</span>
                <span><kbd className="kbd">↵</kbd> open</span>
                <span><kbd className="kbd">&gt;</kbd> terminal</span>
              </p>
            </Command>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

type Line = { kind: "in" | "out"; text: string };

/** The hidden mini terminal: `help`, `about`, `projects`, `contact`, `resume`. */
function Terminal({
  onAction,
  onBack,
}: {
  onAction: (a: TerminalAction) => void;
  onBack: () => void;
}) {
  const [lines, setLines] = useState<Line[]>([
    { kind: "out", text: `${content.shortName.toLowerCase()}@portfolio — type \`help\` to start.` },
  ]);
  const [value, setValue] = useState("");
  const history = useRef<string[]>([]);
  const cursor = useRef(-1);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [lines]);

  const submit = () => {
    const input = value;
    setValue("");
    cursor.current = -1;
    if (input.trim()) history.current.unshift(input);
    const { lines: out, action } = runCommand(input, content);
    if (action?.type === "clear") return setLines([]);
    setLines(l => [
      ...l,
      { kind: "in", text: input },
      ...out.map(text => ({ kind: "out" as const, text })),
    ]);
    if (action) setTimeout(() => onAction(action), action.type === "goto" ? 450 : 0);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const h = history.current;
      cursor.current = Math.max(-1, Math.min(h.length - 1, cursor.current + (e.key === "ArrowUp" ? 1 : -1)));
      setValue(cursor.current < 0 ? "" : h[cursor.current]);
    } else if (e.key === "Backspace" && value === "") {
      onBack();
    }
  };

  return (
    <div className="terminal">
      <div className="terminal-bar" aria-hidden="true">
        <span /><span /><span />
        <p className="mono">~/portfolio</p>
      </div>
      <div className="terminal-log mono" ref={logRef} role="log" aria-live="polite">
        {lines.map((l, i) => (
          <p key={i} className={l.kind === "in" ? "terminal-in" : undefined}>
            {l.kind === "in" && <span aria-hidden="true">$ </span>}
            {l.text || " "}
          </p>
        ))}
      </div>
      <label className="terminal-prompt mono">
        <span aria-hidden="true">$</span>
        <span className="sr-only">Command</span>
        <input
          autoFocus
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
        />
      </label>
    </div>
  );
}

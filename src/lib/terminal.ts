import type { SiteContent } from "../content";
import { isFilled } from "./placeholder";

/** What the mini terminal should do after printing its lines. */
export type TerminalAction =
  | { type: "clear" }
  | { type: "close" }
  | { type: "goto"; hash: string }
  | { type: "download"; href: string };

export interface TerminalResult {
  lines: string[];
  action?: TerminalAction;
}

export const TERMINAL_COMMANDS: [string, string][] = [
  ["help", "list commands"],
  ["about", "who I am"],
  ["projects", "what I've built (projects <n> opens one)"],
  ["contact", "how to reach me"],
  ["resume", "download my CV"],
  ["clear", "clear the screen"],
  ["exit", "close the terminal"],
];

/**
 * Runs one mini-terminal command against the site content. Pure: every word
 * printed comes from content.ts, so nothing here can drift from the page.
 */
export function runCommand(input: string, c: SiteContent): TerminalResult {
  const [cmd = "", ...args] = input.trim().toLowerCase().split(/\s+/);
  switch (cmd) {
    case "":
      return { lines: [] };
    case "help":
    case "?":
      return {
        lines: TERMINAL_COMMANDS.map(([n, d]) => `  ${n.padEnd(10)}${d}`),
      };
    case "about":
    case "whoami":
      return {
        lines: [`${c.name} · ${c.role}`, c.location, "", c.valueStatement],
        action: { type: "goto", hash: "#about" },
      };
    case "projects":
    case "ls": {
      const n = Number(args[0]);
      if (args.length) {
        const p = c.projects[n - 1];
        if (!Number.isInteger(n) || !p)
          return { lines: [`projects: no project #${args[0]} (1-${c.projects.length})`] };
        return {
          lines: [`Opening ${p.title}…`],
          action: { type: "goto", hash: `#project-${p.id}` },
        };
      }
      return {
        lines: [
          ...c.projects.map(
            (p, i) => `  ${i + 1}. ${p.title} — ${p.stack.slice(0, 3).join(", ")}`
          ),
          "",
          "Type `projects <n>` to open a case study.",
        ],
      };
    }
    case "contact":
      return {
        lines: [
          `email    ${c.email}`,
          ...c.socials.map(s => `${s.label.toLowerCase().padEnd(9)}${s.href}`),
        ],
        action: { type: "goto", hash: "#contact" },
      };
    case "resume":
    case "cv":
      return isFilled(c.cv)
        ? {
            lines: ["Downloading resume…"],
            action: { type: "download", href: c.cv as string },
          }
        : { lines: ["resume: [TODO] not uploaded yet. Try `contact`."] };
    case "clear":
    case "cls":
      return { lines: [], action: { type: "clear" } };
    case "exit":
    case "quit":
      return { lines: [], action: { type: "close" } };
    case "sudo":
      return { lines: ["Nice try. This incident will be reported to Haunt."] };
    default:
      return { lines: [`${cmd}: command not found. Type \`help\`.`] };
  }
}

/**
 * Haunt's "brain": answers questions about Richie using ONLY src/content.ts.
 *
 * It is a small, deterministic intent matcher (no network, no AI), so it can
 * never invent facts: every answer is assembled from content fields, and
 * anything still set to [TODO] is skipped. When it doesn't know, it says so.
 *
 * To plug in a real LLM later, see src/lib/haunt-client.ts — this module stays
 * as the offline fallback.
 */
import type { Project, SiteContent } from "../content";
import { isFilled } from "./placeholder";

export interface HauntLink {
  label: string;
  href: string;
}

export type Topic =
  | "help"
  | "greeting"
  | "thanks"
  | "self"
  | "secret"
  | "project"
  | "tech"
  | "resume"
  | "availability"
  | "contact"
  | "privacy"
  | "now"
  | "education"
  | "experience"
  | "projects"
  | "skills"
  | "location"
  | "hobbies"
  | "about"
  | "unknown";

export interface HauntReply {
  text: string;
  links?: HauntLink[];
  topic: Topic;
}

/* ---------- text matching helpers ---------- */

/** Lowercase, strip accents and punctuation, collapse spaces. */
export function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9+#]+/g, " ")
    .trim();
}

/**
 * True when any keyword appears in the question. Keywords with a space are
 * matched as phrases; short ones (≤ 3 chars) must be a whole word ("hi" must
 * not match "his"); longer ones match as a word prefix ("project" → "projects").
 */
function mentions(q: string, keywords: string[]): boolean {
  const words = q.split(" ");
  return keywords.some(k =>
    k.includes(" ")
      ? ` ${q} `.includes(` ${k} `)
      : k.length <= 3
        ? words.includes(k)
        : words.some(w => w.startsWith(k))
  );
}

const list = (items: string[]) =>
  items.length <= 1
    ? items.join("")
    : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

const filled = <T>(v: T | string): v is T => isFilled(v);

/* ---------- tech lookup ---------- */

/** Extra spellings people type for techs listed in content.ts. */
const TECH_ALIASES: Record<string, string> = {
  node: "NodeJS",
  "node js": "NodeJS",
  js: "JavaScript",
  ts: "TypeScript",
  tailwind: "TailwindCSS",
  "next js": "NextJS",
  nextjs: "NextJS",
  nest: "NestJS",
  "nest js": "NestJS",
  postgres: "PostgreSQL",
  git: "Git and GitHub",
  rbac: "RBAC and JWT authentication",
  jwt: "RBAC and JWT authentication",
  auth: "RBAC and JWT authentication",
  authentication: "RBAC and JWT authentication",
  chatgpt: "ChatGPT API",
  openai: "ChatGPT API",
  colab: "Google Colab",
  mongo: "MongoDB",
};

function allTechs(c: SiteContent): string[] {
  const set = new Set<string>();
  for (const g of c.skills) {
    g.using.forEach(t => set.add(t));
    if (Array.isArray(g.learning)) g.learning.forEach(t => set.add(t));
  }
  c.projects.forEach(p => p.stack.forEach(t => set.add(t)));
  return Array.from(set);
}

/** Techs named in the question, matched on whole words. */
export function findTechs(q: string, c: SiteContent): string[] {
  const padded = ` ${q} `;
  const found = new Set<string>();
  for (const t of allTechs(c))
    if (padded.includes(` ${normalize(t)} `)) found.add(t);
  for (const [alias, t] of Object.entries(TECH_ALIASES))
    if (padded.includes(` ${alias} `)) found.add(t);
  return Array.from(found);
}

function techAnswer(tech: string, c: SiteContent): string {
  const group = c.skills.find(g => g.using.includes(tech));
  const learning = c.skills.find(
    g => Array.isArray(g.learning) && g.learning.includes(tech)
  );
  const used = c.projects.filter(p => p.stack.includes(tech)).map(p => p.title);
  const status = group
    ? `${tech}: yes, it's part of his ${group.name} toolkit.`
    : learning
      ? `${tech}: he's currently learning it (${learning.name}).`
      : `${tech}: it isn't in his skills list, but he has worked with it on a project.`;
  return used.length ? `${status} Used in ${list(used)}.` : status;
}

/* ---------- answers ---------- */

const caseLink = (p: Project): HauntLink => ({
  label: `${p.title} case study`,
  href: `#project-${p.id}`,
});

function projectAnswer(p: Project): HauntReply {
  const parts = [`${p.title} (${p.type}). ${p.description}`];
  if (filled(p.caseStudy.problem)) parts.push(`Problem: ${p.caseStudy.problem}`);
  parts.push(`Built with ${list(p.stack)}.`);
  if (filled(p.caseStudy.result)) parts.push(`Result: ${p.caseStudy.result}`);
  if (p.private)
    parts.push(
      filled(p.caseStudy.video)
        ? "It's an internal government system, so the demo video runs on a copy with made-up data, and there's no public link."
        : "It's an internal government system, so there are no public screenshots, links or data."
    );
  const links = [caseLink(p)];
  if (p.github) links.push({ label: "Source on GitHub", href: p.github });
  return { topic: "project", text: parts.join("\n"), links };
}

const contactLinks = (c: SiteContent): HauntLink[] => {
  const links: HauntLink[] = [
    { label: "Contact form", href: "#contact" },
    { label: "Email", href: `mailto:${c.email}` },
  ];
  for (const icon of ["linkedin", "github"] as const) {
    const s = c.socials.find(x => x.icon === icon);
    if (s) links.push({ label: s.label, href: s.href });
  }
  return links;
};

/** Answer one question. Pure: same input, same output. */
export function answer(question: string, c: SiteContent): HauntReply {
  const q = normalize(question);
  const name = c.shortName;

  if (!q)
    return {
      topic: "help",
      text: `Ask me about ${name}'s projects, skills, experience, education, or how to reach him.`,
    };

  if (mentions(q, ["secret", "easter", "konami", "hidden", "minigame", "mini game"]))
    return {
      topic: "secret",
      text: "Psst… there's a tiny world hidden on this page. Try ↑ ↑ ↓ ↓ ← → ← → B A anywhere (not inside a form).",
    };

  if (
    mentions(q, [
      "who are you",
      "what are you",
      "are you ai",
      "are you a bot",
      "your name",
      "haunt",
    ])
  )
    return {
      topic: "self",
      text: `I'm Haunt, the little ghost who lives on ${name}'s site. I only answer from what's written here, so I won't make things up. If I don't know, I'll point you to ${name}.`,
    };

  // A specific project beats every general topic.
  const project = c.projects.find(
    p =>
      ` ${q} `.includes(` ${normalize(p.title)} `) ||
      ` ${q} `.includes(` ${normalize(p.id)} `)
  );
  if (project) return projectAnswer(project);

  if (
    mentions(q, [
      "confidential",
      "private",
      "screenshot",
      "nda",
      "why no",
      "real data",
    ])
  )
    return {
      topic: "privacy",
      text: `Some of ${name}'s work is for the Iloilo City Government. Those systems are internal, so the site shows mock previews or demo videos with made-up data instead of real screenshots, and no internal URLs, names or data.`,
      links: [{ label: "See the projects", href: "#projects" }],
    };

  const techs = findTechs(q, c);
  if (techs.length)
    return {
      topic: "tech",
      text: techs.slice(0, 3).map(t => techAnswer(t, c)).join("\n"),
      links: [{ label: "All skills", href: "#skills" }],
    };

  if (mentions(q, ["resume", "cv", "curriculum"]))
    return filled(c.cv)
      ? {
          topic: "resume",
          text: `Here's ${name}'s resume.`,
          links: [{ label: "Download resume", href: c.cv }],
        }
      : {
          topic: "resume",
          text: `The resume download isn't up yet. Send ${name} a message and he can share it directly.`,
          links: contactLinks(c),
        };

  if (
    mentions(q, [
      "open to work",
      "available",
      "availability",
      "hire",
      "hiring",
      "job",
      "opportunit",
      "freelance",
      "internship",
      "recruit",
      "position",
    ])
  )
    return {
      topic: "availability",
      text: `Yes! ${name} is open to work. ${c.contact.lede}`,
      links: contactLinks(c),
    };

  if (
    mentions(q, [
      "contact",
      "email",
      "reach",
      "message",
      "linkedin",
      "talk to",
      "get in touch",
      "social",
      "github",
      "code",
      "source",
    ])
  )
    return {
      topic: "contact",
      text: `The quickest way is the contact form on this page, or email ${c.email}.`,
      links: contactLinks(c),
    };

  if (mentions(q, ["learning", "learn", "exploring", "explore", "now", "currently", "interested", "interest"])) {
    return {
      topic: "now",
      text: `Through my MIT studies and on my own, I'm exploring: ${c.about.training.join(", ")}.`,
      links: [{ label: "About", href: "#about" }],
    };
  }

  if (
    mentions(q, [
      "study",
      "studies",
      "school",
      "degree",
      "university",
      "college",
      "mit",
      "master",
      "graduate",
      "wvsu",
      "bachelor",
      "magna",
      "education",
    ])
  ) {
    const edu = c.timeline.filter(t => t.kind === "Education");
    return {
      topic: "education",
      text: edu.map(t => `${t.title}, ${t.org} (${t.when}).`).join("\n"),
      links: [{ label: "Experience timeline", href: "#experience" }],
    };
  }

  if (
    mentions(q, [
      "experience",
      "work",
      "employ",
      "career",
      "intern",
      "company",
      "government",
      "city hall",
      "background",
    ])
  ) {
    const jobs = c.timeline.filter(t => t.kind !== "Education");
    return {
      topic: "experience",
      text: jobs
        .map(t => `${t.title} at ${t.org} (${t.when}). ${t.detail}`)
        .join("\n"),
      links: [{ label: "Experience timeline", href: "#experience" }],
    };
  }

  if (
    mentions(q, [
      "project",
      "built",
      "build",
      "made",
      "portfolio",
      "app",
      "apps",
      "case stud",
      "showcase",
    ])
  )
    return {
      topic: "projects",
      text: `${name} has ${c.projects.length} projects here:\n${c.projects
        .map(p => `• ${p.title}: ${p.type}`)
        .join("\n")}\nAsk me about any of them by name.`,
      links: [{ label: "See the projects", href: "#projects" }],
    };

  if (
    mentions(q, [
      "skill",
      "stack",
      "tech",
      "language",
      "framework",
      "tool",
      "know",
      "good at",
      "use",
    ])
  )
    return {
      topic: "skills",
      text: c.skills
        .map(g => `${g.name}: ${list(g.using)}.`)
        .concat(c.skillsNote)
        .join("\n"),
      links: [{ label: "All skills", href: "#skills" }],
    };

  if (
    mentions(q, [
      "where",
      "location",
      "based",
      "live",
      "from",
      "iloilo",
      "philippines",
      "remote",
    ])
  )
    return {
      topic: "location",
      text: `${name} is based in ${c.location}.`,
    };

  if (
    mentions(q, [
      "hobby",
      "hobbies",
      "free time",
      "fun",
      "gaming",
      "game",
      "games",
      "sport",
      "basketball",
      "music",
      "travel",
    ])
  )
    return {
      topic: "hobbies",
      text: c.hobbies
        .map(h => `${h.title}: ${h.text}`)
        .join("\n"),
      links: [{ label: "About", href: "#about" }],
    };

  if (mentions(q, ["who", "about", "yourself", "richie", "bio", "introduce", "tell me"]))
    return {
      topic: "about",
      text: `${c.name} is a ${c.role} based in ${c.location}. ${c.valueStatement}`,
      links: [{ label: "About", href: "#about" }],
    };

  if (mentions(q, ["hi", "hello", "hey", "yo", "sup", "good morning", "good afternoon", "good evening", "kumusta"]))
    return { topic: "greeting", text: c.haunt.greeting };

  if (mentions(q, ["thanks", "thank", "ty", "salamat"]))
    return { topic: "thanks", text: "Anytime! Boo. 👻" };

  return {
    topic: "unknown",
    text: `I don't know that one. I only answer from what's on this site, so it's best to ask ${name} directly.`,
    links: contactLinks(c),
  };
}

/**
 * ALL site content lives here. Edit this file to update the portfolio.
 *
 * Anything set to PLACEHOLDER ("[TODO]") is shown with a dashed [TODO] marker
 * in `pnpm dev` and is HIDDEN on the live site until you fill it in.
 * Never invent numbers or results: leave PLACEHOLDER until you have real ones.
 *
 * Keep this file pure data: no React, no import.meta, no asset imports
 * (the build plugin in scripts/ imports it directly).
 */
import { PLACEHOLDER, type Maybe } from "./lib/placeholder";

/** Page sections, in page order. Also used as URL anchors (#projects …). */
export type SectionId =
  | "home"
  | "projects"
  | "skills"
  | "experience"
  | "about"
  | "contact";

/** Project filter tags. */
export type Tag = "Web" | "Data" | "Security" | "Work" | "School";

export interface Project {
  id: string;
  number: string;
  type: string;
  title: string;
  tags: Tag[];
  /** Shown in the 3-card "featured" view. */
  featured?: boolean;
  description: string;
  stack: string[];
  /**
   * Public screenshot (PNG path; a .webp next to it is used when present).
   * Leave out for internal/government systems: they get a mock preview instead.
   */
  image?: string;
  /** Pixel size of the screenshot, used to reserve space and avoid layout shift. */
  imageSize?: { width: number; height: number };
  github?: string;
  live?: Maybe<string>;
  /** Internal system: no screenshots, URLs, names or data are shown. */
  private?: boolean;
  caseStudy: {
    problem: Maybe<string>;
    role: string;
    features: string[];
    result: Maybe<string>;
    /** Extra screenshots (public projects only). */
    media: Maybe<string[]>;
    video: Maybe<string>;
  };
}

export interface SkillGroup {
  name: "Web" | "Data / AI" | "Cloud / Security";
  /** What I use in real work or projects today. */
  using: string[];
  /** What I'm actively learning. */
  learning: Maybe<string[]>;
}

export interface TimelineEntry {
  when: string;
  kind: "Work" | "Internship" | "Education";
  title: string;
  org: string;
  detail: string;
  current?: boolean;
}

export interface NowItem {
  topic: string;
  note: Maybe<string>;
}

export interface Hobby {
  icon: "heart" | "gamepad" | "dumbbell" | "plane";
  title: string;
  text: string;
  link?: Maybe<string>;
  linkLabel?: string;
}

export interface Social {
  label: string;
  href: string;
  icon: "facebook" | "instagram" | "github" | "linkedin";
}

export interface SiteContent {
  name: string;
  shortName: string;
  role: string;
  location: string;
  valueStatement: string;
  /** Small chips under the hero. The first one gets the "live" dot. */
  status: string[];
  cv: Maybe<string>;
  email: string;
  /** `game` is only used by the hidden easter-egg world. */
  sections: { id: SectionId; plain: string; game: string; summary: string }[];
  about: { lede: string; body: string[]; training: string[] };
  now: { lede: string; updated: Maybe<string>; items: NowItem[] };
  hobbies: Hobby[];
  projects: Project[];
  skills: SkillGroup[];
  skillsNote: string;
  timeline: TimelineEntry[];
  contact: { lede: string; body: string };
  socials: Social[];
  /** Haunt, the chat mascot. */
  haunt: { greeting: string; suggestions: string[] };
}

const content: SiteContent = {
  name: "Richie Paul Aquiño",
  shortName: "Richie",
  role: "Junior Fullstack Developer",
  location: "Iloilo City, Philippines",
  valueStatement:
    "I build web systems that turn manual government processes into tools people can rely on.",
  status: [
    "Open to work",
    "Junior Fullstack Dev · Iloilo City Government",
    "MIT student · WVSU",
    "Iloilo City, PH",
  ],
  // Put your CV in public/ (e.g. public/cv.pdf) and set this to "/cv.pdf".
  cv: PLACEHOLDER,
  email: "richiepaul.aquino@gmail.com",

  sections: [
    {
      id: "home",
      plain: "Home",
      game: "START",
      summary: "Who I am and what I build.",
    },
    {
      id: "projects",
      plain: "Projects",
      game: "MISSIONS",
      summary: "Web, data and government work, with case studies.",
    },
    {
      id: "skills",
      plain: "Skills",
      game: "TECH TREE",
      summary: "What I use today and what I'm learning.",
    },
    {
      id: "experience",
      plain: "Experience",
      game: "QUEST LOG",
      summary: "Work at the Iloilo City Government, my internship, and WVSU.",
    },
    {
      id: "about",
      plain: "About",
      game: "PROFILE",
      summary: "My story and what I'm exploring now.",
    },
    {
      id: "contact",
      plain: "Contact",
      game: "TRANSMISSION",
      summary: "Send me a message. I'm open to work.",
    },
  ],

  about: {
    lede: "I'm drawn to new technology and the possibilities it creates — especially the thoughtful web experiences that connect people, ideas, and useful tools.",
    body: [
      "I'm growing toward full-stack web development, building confidence across the interface, the server, and the data behind a product. I enjoy learning how each layer fits together and turning new ideas into reliable, usable experiences.",
      "I'm especially interested in modern JavaScript, React, APIs, databases, AI-assisted tools, and the emerging technologies shaping how we build for the web. I learn by experimenting, asking good questions, and making practical projects.",
    ],
    training: [
      "Artificial intelligence",
      "Cloud computing",
      "Cybersecurity",
      "Data mining",
      "IT project management",
    ],
  },

  now: {
    lede: "What I'm exploring right now, through my MIT studies and on my own.",
    updated: PLACEHOLDER,
    items: [
      { topic: "Artificial intelligence", note: PLACEHOLDER },
      { topic: "Cloud computing", note: PLACEHOLDER },
      { topic: "Cybersecurity", note: PLACEHOLDER },
      { topic: "Data mining", note: PLACEHOLDER },
      { topic: "IT project management", note: PLACEHOLDER },
    ],
  },

  hobbies: [
    {
      icon: "heart",
      title: "Currently listening",
      text: "Add a Spotify embed now, or connect the API later to show what's playing in real time.",
      link: PLACEHOLDER,
      linkLabel: "Open playlist",
    },
    {
      icon: "gamepad",
      title: "Gaming",
      text: "PC and mobile, from competitive titles like Valorant, Wild Rift, and Teamfight Tactics to sports games and MMORPGs.",
    },
    {
      icon: "dumbbell",
      title: "Staying active",
      text: "Jogging and basketball keep me fit and give me a break from work and daily routines.",
    },
    {
      icon: "plane",
      title: "Exploring places",
      text: "Visiting new places to relax, unwind, and do things at my own pace.",
    },
  ],

  projects: [
    {
      id: "solid",
      number: "01",
      type: "Web app · Government",
      title: "SOLID",
      tags: ["Web", "Security", "Work"],
      featured: true,
      description:
        "A web application for the City Government of Iloilo for requesting supplies in the warehouse. I developed the RBAC, JWT authentication, and the database structure, and contributed to several frontend modules.",
      stack: [
        "React",
        "TypeScript",
        "NestJS",
        "NextJS",
        "TailwindCSS",
        "PostgreSQL",
      ],
      private: true,
      caseStudy: {
        problem: PLACEHOLDER,
        role: "Developed the RBAC, JWT authentication, and the database structure, and contributed to several frontend modules.",
        features: [
          "Warehouse supply requests",
          "Role-based access control (RBAC)",
          "JWT authentication",
        ],
        result: PLACEHOLDER,
        media: PLACEHOLDER,
        video: PLACEHOLDER,
      },
    },
    {
      id: "budget-tracker",
      number: "02",
      type: "Web app · Government",
      title: "Budget Tracker",
      tags: ["Web", "Work"],
      featured: true,
      description:
        "A web-based budget tracker that lets the City Budget office overview the budgets of all departments, with add, edit, and delete for Program, Project and Activity (PPA) entries.",
      stack: ["React", "TypeScript", "Express", "TailwindCSS", "MySQL"],
      private: true,
      caseStudy: {
        problem:
          "The City Budget office needed one place to overview the budgets of all the departments.",
        role: "Created the web-based budget tracker.",
        features: [
          "Overview of every department's budget",
          "Program Project and Activity (PPA) entries: add, edit, and delete",
        ],
        result: PLACEHOLDER,
        media: PLACEHOLDER,
        video: PLACEHOLDER,
      },
    },
    {
      id: "chordefine",
      number: "03",
      type: "Mobile app",
      title: "ChorDefine",
      tags: ["Data", "School"],
      featured: true,
      description:
        "A mobile app for learning and practicing guitar chords. I trained the model and configured the pitch detection package.",
      stack: ["Flutter", "Dart", "Google Colab", "Roboflow"],
      image: "/projects/chordefine.png",
      imageSize: { width: 1920, height: 1080 },
      github: "https://github.com/ronmagpantay1/ChorDefine",
      live: PLACEHOLDER,
      caseStudy: {
        problem: PLACEHOLDER,
        role: "Trained the model and configured the pitch detection package.",
        features: ["Learn and practice guitar chords", "Pitch detection"],
        result: PLACEHOLDER,
        media: PLACEHOLDER,
        video: PLACEHOLDER,
      },
    },
    {
      id: "ambatuhelp",
      number: "04",
      type: "Mobile app",
      title: "AmbatuHelp",
      tags: ["Data", "School"],
      description:
        "A chatbot mobile application that uses the ChatGPT API. I created the UI/UX of the app.",
      stack: ["Flutter", "Dart", "Tensorflow", "ChatGPT API"],
      image: "/projects/ambatuhelp.png",
      imageSize: { width: 1920, height: 1080 },
      github: "https://github.com/paullooll/cc206_chatbot_application",
      live: PLACEHOLDER,
      caseStudy: {
        problem: PLACEHOLDER,
        role: "Created the UI/UX of the mobile application.",
        features: ["Chatbot powered by the ChatGPT API"],
        result: PLACEHOLDER,
        media: PLACEHOLDER,
        video: PLACEHOLDER,
      },
    },
  ],

  skills: [
    {
      name: "Web",
      using: [
        "HTML",
        "CSS",
        "JavaScript",
        "TypeScript",
        "React",
        "TailwindCSS",
        "NodeJS",
        "PHP",
        "Flutter",
        "Dart",
      ],
      learning: ["NextJS", "NestJS", "Express", "Vite"],
    },
    {
      name: "Data / AI",
      using: ["Python", "MySQL", "Firebase", "Antigravity", "OpenCode", "Manus"],
      learning: ["PostgreSQL", "MongoDB", "Google Colab"],
    },
    {
      name: "Cloud / Security",
      using: ["Git and GitHub", "RBAC and JWT authentication"],
      learning: ["Docker"],
    },
  ],
  skillsNote:
    "Some tools I'm still learning (NestJS, NextJS, PostgreSQL) already power SOLID in production.",

  timeline: [
    {
      when: "Aug 2025 – Present",
      kind: "Work",
      title: "Junior Fullstack Developer",
      org: "Iloilo City Government",
      detail:
        "Building a web-based system to digitalize and streamline manual internal processes within the city government, while learning from experienced teammates and developing reliable, user-friendly features based on organizational requirements.",
      current: true,
    },
    {
      when: "Present",
      kind: "Education",
      title: "Master in Information Technology · Year 1",
      org: "West Visayas State University",
      detail:
        "Currently in my first year of graduate school, deepening my knowledge and preparing for thoughtful work in technology.",
      current: true,
    },
    {
      when: "Jan 2025 – Apr 2025",
      kind: "Internship",
      title: "Software Development Intern",
      org: "Warp Prometheus",
      detail:
        "Contributed to development work in a team environment while building confidence with code reviews, debugging, and shipping improvements.",
    },
    {
      when: "Completed",
      kind: "Education",
      title: "BS Information Technology · Magna Cum Laude",
      org: "West Visayas State University",
      detail: "Graduated Magna Cum Laude.",
    },
  ],

  contact: {
    lede: "I'm open to junior roles, internships, mentorship, and kind conversations about the web.",
    body: "Send a message straight to my inbox, or reach me through the links below.",
  },

  socials: [
    {
      label: "Facebook",
      href: "https://www.facebook.com/richiepaul.lagamonaquino",
      icon: "facebook",
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/ret.cheee/",
      icon: "instagram",
    },
    { label: "GitHub", href: "https://github.com/paullooll", icon: "github" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/richie-paul-aquiño-2bb196265",
      icon: "linkedin",
    },
  ],

  haunt: {
    greeting:
      "Hi! I'm Haunt. I can answer questions about Richie's projects, skills, experience, and how to reach him.",
    suggestions: [
      "What projects has Richie built?",
      "What's his tech stack?",
      "Is he open to work?",
      "Tell me about SOLID",
    ],
  },
};

export default content;

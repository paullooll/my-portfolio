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
export type Tag = "Web" | "Data" | "Security" | "Work" | "School" | "Personal";

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
   * Card image (PNG path; a .webp next to it is used when present), also the
   * video poster. Without it the card shows a mock preview.
   */
  image?: string;
  /** Pixel size of the screenshot, used to reserve space and avoid layout shift. */
  imageSize?: { width: number; height: number };
  /** The project's own colors, used to frame its card image. */
  palette?: { accent: string; bg: string };
  github?: string;
  live?: Maybe<string>;
  /** Internal system: no live link, real URLs, names or data are shown. */
  private?: boolean;
  caseStudy: {
    problem: Maybe<string>;
    role: string;
    features: string[];
    result: Maybe<string>;
    /** Extra screenshots. `[]` with a video = video only. */
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

export interface Hobby {
  icon: "music" | "gamepad";
  title: string;
  text: string;
  /** Show the live Spotify track (api/now-playing.ts); `text` is the fallback. */
  live?: "spotify";
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
  /** Hero typing effect cycles through these. Real titles only (add more as they become true). */
  roles: string[];
  location: string;
  valueStatement: string;
  /** Small chips under the hero. The first one gets the "live" dot. */
  status: string[];
  cv: Maybe<string>;
  email: string;
  /** `game` is only used by the hidden easter-egg world. */
  sections: { id: SectionId; plain: string; game: string; summary: string }[];
  about: { lede: string; body: string[]; training: string[] };
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
  roles: ["Junior Fullstack Developer", "MIT student · WVSU"],
  location: "Iloilo City, Philippines",
  valueStatement:
    "I build secure web systems that replace slow, manual work with tools teams can rely on.",
  status: [
    "Open to work",
    "Iloilo City Government",
    "MIT student · WVSU",
    "Iloilo City, PH",
  ],
  // Public file: public/cv.pdf (contains phone + email).
  cv: "/cv.pdf",
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
      summary: "Government systems, school apps and a personal project, each with a case study.",
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
      summary: "My story and what drives the way I build.",
    },
    {
      id: "contact",
      plain: "Contact",
      game: "TRANSMISSION",
      summary: "Have a role or project in mind? Send me a message.",
    },
  ],

  about: {
    lede: "I love what new technology makes possible, especially web tools that make people's everyday work simpler.",
    body: [
      "I'm a full-stack developer who works across the interface, the server and the data behind a product. I care about how each layer fits together, so what I ship is reliable, secure and easy to use.",
      "Right now I'm going deeper into modern JavaScript, React, APIs, databases and AI-assisted tools. I learn by building practical projects and asking good questions, and I bring what I learn straight into real work.",
    ],
    training: [
      "Artificial intelligence",
      "Cloud computing",
      "Cybersecurity",
      "Data mining",
      "IT project management",
    ],
  },

  hobbies: [
    {
      icon: "music",
      title: "Music",
      text: "What I'm listening to, live from Spotify.",
      live: "spotify",
    },
    {
      icon: "gamepad",
      title: "Gaming",
      text: "PC and mobile, from competitive titles like Valorant, Wild Rift, and Teamfight Tactics to sports games and MMORPGs.",
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
        "Turns the Iloilo City Government's manual warehouse process into one secure online system, where every supply is tracked from contract to issue. I connected it to the city's procurement system, secured it end to end, and built its core screens.",
      stack: [
        "React",
        "TypeScript",
        "NestJS",
        "NextJS",
        "TailwindCSS",
        "MySQL",
      ],
      // Cover (assets-src/covers); also the demo video's poster.
      image: "/projects/solid.png",
      imageSize: { width: 1920, height: 1080 },
      palette: { accent: "#3ddc84", bg: "#0b0b0b" },
      private: true,
      caseStudy: {
        problem:
          "Supplies were tracked by hand. The process was slow, there was no single masterlist, and it was hard to tell who requested what, so the city had little real control over its warehouse.",
        role: "I connected SOLID to the Iloilo City Procurement System's API so contracts flow in automatically, secured it with role-based access control, JWT authentication and other safeguards, and built the Contract Monitoring, Add RIS, Add Inventory and Issued Items tabs.",
        features: [
          "Contracts pulled in automatically from the city's procurement system",
          "One masterlist of every supply in the warehouse",
          "Every request on record: who asked, what was issued, and when",
          "Contract Monitoring that shows where every supply contract stands",
          "Role-based access and JWT sign-in, so people only reach what their role allows",
        ],
        result:
          "Live in staging and being tested. A UI/UX refresh comes next, before it goes live.",
        media: [],
        video: "/projects/solid-ris-flow.webm",
      },
    },
    {
      id: "chordefine",
      number: "02",
      type: "Mobile app",
      title: "ChorDefine",
      tags: ["Data", "School"],
      featured: true,
      description:
        "My thesis: an Android app that coaches you through guitar chords. It watches your hand through the camera and listens through the mic, all on the phone, and tells you right away if the chord is right. I trained the chord-detection model and set up the pitch detection.",
      stack: [
        "Flutter",
        "Dart",
        "TensorFlow Lite",
        "YOLOv8",
        "Google Colab",
        "Roboflow",
      ],
      image: "/projects/chordefine.png",
      imageSize: { width: 1920, height: 1080 },
      palette: { accent: "#c2410c", bg: "#fdf7f2" },
      github: "https://github.com/paullooll/ChorDefine",
      live: "https://drive.google.com/file/d/18RtMUydc3MUT07kaH0ouWyRk4P0o3NGk/view?usp=sharing",
      caseStudy: {
        problem:
          "Learning guitar on your own means nobody tells you when a chord is wrong. Beginners practise bad finger positions for weeks, and lessons cost money and time not everyone has.",
        role: "One of a five-person thesis team. I trained the chord-detection model on a Roboflow dataset in Google Colab and set up the pitch-detection package that checks what you play.",
        features: [
          "Recognizes the chord you hold (A to G) through the camera, right on the phone",
          "Checks your fret position and tells you right away if a finger is off",
          "Listens through the mic to check the notes you play",
          "Built-in tuner, ear trainer and sing-along with lyrics",
          "Lessons and progress tracking that work offline",
        ],
        result:
          "Completed as our BSIT thesis at West Visayas State University. Version 1.0 ships as an Android APK.",
        media: [],
        video: "/projects/chordefine-demo.webm",
      },
    },
    {
      id: "ambatuhelp",
      number: "03",
      type: "Mobile app",
      title: "AmbatuHelp",
      tags: ["Data", "School"],
      featured: true,
      description:
        "A Flutter AI chatbot for students. Ask anything and the answer streams in from OpenAI, with formatted code, saved chats and light and dark themes. I designed its UI/UX.",
      stack: ["Flutter", "Dart", "Material 3", "OpenAI API"],
      image: "/projects/ambatuhelp.png",
      imageSize: { width: 1920, height: 1080 },
      palette: { accent: "#c9a227", bg: "#1a160c" },
      github: "https://github.com/paullooll/AmbatuHelp",
      live: PLACEHOLDER,
      caseStudy: {
        problem:
          "Students get stuck on homework at night, when teachers and classmates are offline. They need clear answers right when the question comes up, in an app that feels simple to use.",
        role: "A team final project for CC 206 (Application Development and Emerging Technologies). I designed the app's UI/UX, from onboarding to the chat screen.",
        features: [
          "Replies stream in word by word from OpenAI's gpt-4o-mini, with a stop button",
          "Markdown replies with code blocks and one-tap copy, retry and delete",
          "Suggested prompts to get started",
          "Saved chat history you can search, rename and delete, with undo",
          "Light and dark themes, adjustable text size and a custom assistant name",
        ],
        result:
          "Submitted as our CC 206 final project, then rebuilt on current Flutter with Material 3 and streaming replies.",
        media: [],
        video: "/projects/ambatuhelp-demo.webm",
      },
    },
    {
      id: "kayaba",
      number: "04",
      type: "Mobile app · Personal",
      title: "KayaBa?",
      tags: ["Personal"],
      description:
        "“Kaya ba?” is Filipino for “Can I afford it?”. This Android app turns a price into the hours and days of work it costs you, and checks it against the wants share of your 50/30/20 budget. A solo personal project, still in development.",
      stack: [
        "Flutter",
        "Dart",
        "Riverpod",
        "Drift (SQLite)",
        "Supabase",
        "fl_chart",
      ],
      image: "/projects/kayaba.png",
      imageSize: { width: 1920, height: 1080 },
      palette: { accent: "#0038A8", bg: "#FAF8F3" },
      github: "https://github.com/paullooll/kayaba-mobile",
      caseStudy: {
        problem:
          "A price tag doesn't tell you what a purchase really costs. It's easy to buy something without noticing it took a full day of work, or that it ate most of this month's spending money.",
        role: "My own project: I'm designing and building it on my own, from the clay-style design system to the local database, sign-in and sync.",
        features: [
          "Enter a price and see how many hours and days of work it costs",
          "Each item checked against the wants share of the 50/30/20 rule",
          "Wishlist you can sort by price or hours, plus a 50/30/20 budget chart",
          "Works offline first, with Supabase sign-in, sync and row-level security",
          "Light and dark themes in Filipino-flag colors, tested at 200% text size",
        ],
        result:
          "In development: the MVP is being built, Android first.",
        media: [],
        video: "/projects/kayaba-demo.webm",
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
      using: [
        "Python",
        "MySQL",
        "Firebase",
        "Antigravity",
        "OpenCode",
        "Manus",
      ],
      learning: ["PostgreSQL", "MongoDB", "Google Colab"],
    },
    {
      name: "Cloud / Security",
      using: ["Git and GitHub", "RBAC and JWT authentication"],
      learning: ["Docker"],
    },
  ],
  skillsNote:
    "I learn on the job: NestJS and NextJS are still on my learning list, and they already power SOLID, now in staging.",

  timeline: [
    {
      when: "Aug 2025 – Present",
      kind: "Work",
      title: "Junior Fullstack Developer",
      org: "Iloilo City Government",
      detail:
        "Building web systems that replace slow, manual processes inside the city government. I turn what offices need into reliable, easy-to-use features, and learn from experienced teammates along the way.",
      current: true,
    },
    {
      when: "Present",
      kind: "Education",
      title: "Master in Information Technology · Year 1",
      org: "West Visayas State University",
      detail:
        "First year of graduate school, going deeper into the technology I build with every day.",
      current: true,
    },
    {
      when: "Jan 2025 – Apr 2025",
      kind: "Internship",
      title: "Software Development Intern",
      org: "Warp Prometheus",
      detail:
        "Worked on a development team, sharpening my skills in code reviews, debugging and shipping improvements.",
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
    lede: "I'm open to junior developer roles, internships and mentorship. If you need a reliable web system built, let's talk.",
    body: "Your message goes straight to my inbox, or you can reach me through the links below.",
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

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
   * Card image (PNG path; a .webp next to it is used when present), also the
   * video poster. Without it the card shows a mock preview.
   */
  image?: string;
  /** Pixel size of the screenshot, used to reserve space and avoid layout shift. */
  imageSize?: { width: number; height: number };
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
      summary: "Government systems and school apps, each with a case study.",
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
      // Name card; also the demo video's poster.
      image: "/projects/solid.png",
      imageSize: { width: 1600, height: 1000 },
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
      id: "budget-tracker",
      number: "02",
      type: "Web app · Government",
      title: "Budget Tracker",
      tags: ["Web", "Work"],
      featured: true,
      description:
        "Gives the City Budget Office one view of every department's budget, so nobody has to piece it together office by office. Staff add, edit and delete Program, Project and Activity (PPA) entries in one place.",
      stack: ["React", "TypeScript", "Express", "TailwindCSS", "MySQL"],
      private: true,
      caseStudy: {
        problem:
          "The City Budget office needed one place to overview the budgets of all the departments.",
        role: "I built the budget tracker as a web app, from the screens to the database behind them.",
        features: [
          "Every department's budget in one overview",
          "Add, edit and delete Program, Project and Activity (PPA) entries",
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
        "My thesis: a Flutter app that teaches guitar chords. It recognizes the chord you're holding through the camera, right on the phone, and checks your pitch through the mic. I trained the chord-detection model and set up the pitch detection.",
      stack: ["Flutter", "Dart", "Google Colab", "Roboflow"],
      image: "/projects/chordefine.png",
      imageSize: { width: 1920, height: 1080 },
      github: "https://github.com/ronmagpantay1/ChorDefine",
      live: PLACEHOLDER,
      caseStudy: {
        problem: PLACEHOLDER,
        role: "I trained the chord-detection model and set up the pitch-detection package.",
        features: [
          "Learn and practice guitar chords",
          "Chord detection from the camera, on the device",
          "Pitch detection from the microphone",
        ],
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
        "A Flutter chatbot app that answers questions through the ChatGPT API, with onboarding, profile and FAQ screens. I designed its UI/UX.",
      stack: ["Flutter", "Dart", "Tensorflow", "ChatGPT API"],
      image: "/projects/ambatuhelp.png",
      imageSize: { width: 1920, height: 1080 },
      github: "https://github.com/paullooll/cc206_chatbot_application",
      live: PLACEHOLDER,
      caseStudy: {
        problem: PLACEHOLDER,
        role: "I designed the app's UI/UX, from onboarding to the chat screen.",
        features: [
          "Chatbot powered by the ChatGPT API",
          "Onboarding, profile and FAQ screens",
        ],
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

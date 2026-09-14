import { FormEvent, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Code2,
  Facebook,
  Github,
  Globe2,
  Dumbbell,
  Gamepad2,
  Heart,
  Instagram,
  Lock,
  Plane,
  Home as HomeIcon,
  Linkedin,
  Mail,
  Menu,
  Moon,
  MonitorSmartphone,
  Send,
  Sparkles,
  Sun,
  UserRound,
  X,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

type Section = "home" | "about" | "experience" | "skills" | "projects" | "contact";

type IconComponent = typeof HomeIcon;

const navItems: { id: Section; label: string; icon: IconComponent }[] = [
  { id: "home", label: "Home", icon: HomeIcon },
  { id: "about", label: "About", icon: UserRound },
  { id: "experience", label: "Experience", icon: BriefcaseBusiness },
  { id: "skills", label: "Skills", icon: Code2 },
  { id: "projects", label: "Projects", icon: BriefcaseBusiness },
  { id: "contact", label: "Contact", icon: Mail },
];

const skillGroups = [
  {
    label: "Languages, Frameworks & Platforms",
    number: "01",
    skills: ["HTML", "CSS", "JavaScript", "TypeScript", "PHP", "Python", "Dart", "Flutter", "React", "TailwindCSS", "NodeJS"],
  },
  {
    label: "Databases & Tools",
    number: "02",
    skills: ["MySQL", "Firebase", "VS Code", "Antigravity", "OpenCode", "Manus", "Git and Github"],
  },
  {
    label: "Currently Learning",
    number: "03",
    skills: ["Vite", "NextJS", "NestJS", "Express", "Docker", "MongoDB", "PostgreSQL", "Google Colab"],
  },
];

const projects = [
  {
    number: "01",
    type: "Web app",
    group: "web" as const,
    title: "AmbatuHelp",
    description: "Confidential work project — details and code are private. Screenshot shown with permission; repo not public.",
    stack: ["React", "TailwindCSS", "Firebase"],
    color: "apricot",
    image: "/projects/ambatuhelp.png",
    private: true as const,
  },
  {
    number: "02",
    type: "Web app",
    group: "web" as const,
    title: "Budget Tracker",
    description: "Confidential work project — internal system. Code is private and not available for public viewing.",
    stack: ["JavaScript", "React", "MySQL"],
    color: "sage",
    image: "/projects/budget%20tracker.png",
    private: true as const,
  },
  {
    number: "03",
    type: "Mobile app",
    group: "mobile" as const,
    title: "ChorDefine",
    description: "Screenshot from ChorDefine — replace with a short description of what the app does and your contributions.",
    stack: ["Flutter", "Dart", "Firebase"],
    color: "lilac",
    image: "/projects/chordefine.png",
  },
  {
    number: "04",
    type: "Mobile app",
    group: "mobile" as const,
    title: "Solid",
    description: "Screenshot from Solid — add your overview, tech used, and link to code or live demo.",
    stack: ["Flutter", "Dart", "MySQL"],
    color: "apricot",
    image: "/projects/solid.png",
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

function ArrowLink({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button className="text-link" onClick={onClick} type="button">
      {children}
      <ArrowUpRight size={15} strokeWidth={2.25} />
    </button>
  );
}

function HomeSection({ goTo }: { goTo: (section: Section) => void }) {
  return (
    <section className="section-stack home-section" aria-labelledby="home-heading">
      <div className="hero-grid">
        <div className="hero-copy">
          <Eyebrow>Software & web developer · learning in public</Eyebrow>
          <h1 id="home-heading">
            Building my first <span>useful things</span> for the web.
          </h1>
          <p className="hero-intro">
            Hi, I&apos;m Richie — an early-career developer who enjoys turning curious questions into small, clear, and helpful digital experiences.
          </p>
          <div className="button-row">
            <button className="button button-primary" type="button" onClick={() => goTo("projects")}>
              View my work <ArrowUpRight size={17} />
            </button>
            <button className="button button-quiet" type="button" onClick={() => goTo("contact")}>
              Say hello <Mail size={16} />
            </button>
          </div>
        </div>

        <div className="hero-note" aria-label="A short note about Richie">
          <div className="note-topline">
            <span className="note-dot" />
            <span>Currently exploring</span>
            <span className="note-index">01 / 05</span>
          </div>
          <div className="note-illustration has-photo">
            <img className="note-photo" src="/light.png" alt="Richie Paul Aquino" onError={(e) => ((e.currentTarget.style.display = "none"))} />
            <div className="sun-shape" />
            <div className="note-card note-card-back" />
            <div className="note-card note-card-front">
              <span className="scribble scribble-one" />
              <span className="scribble scribble-two" />
              <span className="scribble scribble-three" />
              <Sparkles className="sparkle" size={23} />
            </div>
          </div>
          <p className="note-caption">Making the web a little more thoughtful, one project at a time.</p>
        </div>
      </div>

      <div className="home-lower">
        <div className="signal-line">
          <span className="signal-number">01</span>
          <span className="signal-rule" />
          <span className="signal-copy">A work in progress, by design.</span>
        </div>
        <p className="home-lower-copy">
          I&apos;m looking for opportunities to learn from a team, contribute with care, and keep growing through real work.
        </p>
      </div>
    </section>
  );
}

function AboutSection({ goTo }: { goTo: (section: Section) => void }) {
  return (
    <section className="section-stack" aria-labelledby="about-heading">
      <div className="section-heading-row">
        <div>
          <Eyebrow>About me</Eyebrow>
          <h2 id="about-heading">Always building forward.</h2>
        </div>
        <span className="section-count">02 / 06</span>
      </div>
      <div className="about-layout">
        <div className="about-lede">
          <p className="large-copy">
            I&apos;m drawn to new technology and the possibilities it creates — especially the thoughtful web experiences that connect people, ideas, and useful tools.
          </p>
          <div className="quote-mark">“</div>
        </div>
        <div className="about-body">
          <p>
            I&apos;m growing toward full-stack web development, building confidence across the interface, the server, and the data behind a product. I enjoy learning how each layer fits together and turning new ideas into reliable, usable experiences.
          </p>
          <p>
            I&apos;m especially interested in modern JavaScript, React, APIs, databases, AI-assisted tools, and the emerging technologies shaping how we build for the web. I learn by experimenting, asking good questions, and making practical projects.
          </p>
          <ArrowLink onClick={() => goTo("experience")}>See my background</ArrowLink>
        </div>
      </div>
      <div className="about-hobbies">
        <div className="about-hobbies-heading"><Eyebrow>Outside the browser</Eyebrow><h3>The things that keep me curious.</h3></div>
        <div className="about-hobbies-grid">
          <article className="about-hobby-card about-hobby-listening"><div className="about-hobby-top"><span className="hobby-icon"><Heart size={16} fill="currentColor" /></span><span>Spotify-ready</span></div><div><p className="hobby-label">Currently listening</p><strong>Your favorite playlist</strong><p>Add a Spotify embed now, or connect the API later to show what&apos;s playing in real time.</p></div><button className="hobby-link" type="button">Add playlist <ArrowUpRight size={15} /></button></article>
          <article className="about-hobby-card"><div className="about-hobby-top"><span className="hobby-icon"><Gamepad2 size={16} /></span><span>Gaming</span></div><div><p className="hobby-label">What I play</p><strong>Favorite games</strong><p>I enjoy playing games across both PC and mobile, from competitive titles like Valorant, Wild Rift, and Teamfight Tactics to sports games and MMORPGs.</p></div></article>
          <article className="about-hobby-card"><div className="about-hobby-top"><span className="hobby-icon"><Dumbbell size={16} /></span><span>Physical activities</span></div><div><p className="hobby-label">Staying active</p><strong>Movement & discipline</strong><p>I enjoy going for a jog and playing basketball in my free time, keeping physical activity as part of my routine. Both give me a way to stay active, maintain my fitness, and take a break from work and other daily activities.</p></div></article>
          <article className="about-hobby-card"><div className="about-hobby-top"><span className="hobby-icon"><Plane size={16} /></span><span>Unwind & travel</span></div><div><p className="hobby-label">Break & explore</p><strong>Places & escapes</strong><p>I enjoy visiting different places in my free time, taking the opportunity to relax, unwind, and step away from my usual routine. Exploring new places gives me a chance to enjoy different surroundings and spend time doing things at my own pace.</p></div></article>
        </div>
      </div>
    </section>
  );
}

function ExperienceSection() {
  return (
    <section className="section-stack" aria-labelledby="experience-heading">
      <div className="section-heading-row">
        <div>
          <Eyebrow>Experience & education</Eyebrow>
          <h2 id="experience-heading">Learning by doing.</h2>
        </div>
      </div>
      <div className="experience-intro">
        <p className="large-copy">A foundation built through real work, steady practice, and a bachelor&apos;s degree.</p>
        <p className="muted-copy">I&apos;m growing from hands-on experience into a thoughtful junior developer, bringing curiosity, care, and a willingness to learn to every team I join.</p>
      </div>
      <div className="experience-timeline">
        <article className="experience-item current">
          <div className="experience-marker"><span /></div>
          <div className="experience-date">Present</div>
          <div className="experience-detail">
            <div className="experience-meta"><span>Current role</span></div>
            <h3>Junior Fullstack Developer</h3>
            <p className="experience-company">Iloilo City Government · August 2025 - Present</p>
            <p>Building a web-based system to digitalize and streamline manual internal processes within the city government, while learning from experienced teammates and developing reliable, user-friendly features based on organizational requirements.</p>
          </div>
        </article>
        <article className="experience-item">
          <div className="experience-marker"><span /></div>
          <div className="experience-date">Previous</div>
          <div className="experience-detail">
            <div className="experience-meta"><span>Internship</span></div>
            <h3>Software Development Intern</h3>
            <p className="experience-company">Warp Prometheus · Jan 2025 - April 2025</p>
            <p>Contributed to development work in a team environment while building confidence with code reviews, debugging, and shipping improvements.</p>
          </div>
        </article>
      </div>
      <div className="education-card">
        <div>
          <div className="experience-meta"><span>Education</span></div>
          <h3>Graduate School · Year 1</h3>
          <p className="experience-company">Master in Information Technology / West Visayas State University <span style={{ whiteSpace: "nowrap" }}>· Currently enrolled</span></p>
          <p>Currently pursuing the first year of graduate school and continuing to deepen my knowledge and prepare for thoughtful work in technology.</p>
          <div className="undergraduate-entry">
            <strong>Bachelor&apos;s Degree</strong>
            <span>Bachelor of Science in Information Technology - Magna Cum Laude / West Visayas State University · Completed </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillsSection() {
  return (
    <section className="section-stack" aria-labelledby="skills-heading">
      <div className="section-heading-row">
        <div>
          <Eyebrow>Tools & topics</Eyebrow>
          <h2 id="skills-heading">Learning out loud.</h2>
        </div>
        <span className="section-count">03 / 06</span>
      </div>
      <div className="skills-intro-row">
        <p className="large-copy">A growing toolkit, not a list of claimed mastery.</p>
        <p className="muted-copy">These are the technologies I&apos;m comfortable practicing with today, plus the areas I&apos;m excited to deepen next.</p>
      </div>
      <div className="skills-grid">
        {skillGroups.map((group) => (
          <article className="skill-group" key={group.label}>
            <div className="skill-group-top"><span>{group.number}</span><span>{group.label}</span></div>
            <div className="tag-list">
              {group.skills.map((skill) => <span className="skill-tag" key={skill}>{skill}</span>)}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProjectsSection() {
  const [filter, setFilter] = useState<"All" | "Web" | "Mobile">("All");
  const filtered = filter === "All" ? projects : projects.filter((p) => p.group === filter.toLowerCase());

  return (
    <section className="section-stack" aria-labelledby="projects-heading">
      <div className="section-heading-row">
        <div>
          <Eyebrow>Selected builds</Eyebrow>
          <h2 id="projects-heading">Small projects, real practice.</h2>
        </div>
        <span className="section-count">04 / 06</span>
      </div>
      <div className="project-filters" role="tablist" aria-label="Filter projects">
        {(["All", "Web", "Mobile"] as const).map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={filter === cat}
            className={`filter-pill ${filter === cat ? "active" : ""}`}
            onClick={() => setFilter(cat)}
            type="button"
          >
            {cat === "All" ? "All" : cat === "Web" ? "Web System" : "Mobile App"}
          </button>
        ))}
      </div>
      <div className="projects-list">
        {filtered.map((project) => (
          <article className={`project-card ${project.color}`} key={project.title}>
            <div className="project-art" aria-hidden="true">
              {(project as { image?: string }).image ? (
                <img className="project-image" src={(project as { image: string }).image} alt={project.title} loading="lazy" />
              ) : (
                <span className="project-art-shape" />
              )}
            </div>
            <div className="project-content">
              <div className="project-meta"><span>{project.type}</span><span>{project.number}</span></div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-footer">
                <div className="stack-list">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
                {(project as { private?: boolean }).private ? (
                  <span className="project-link private" aria-label={`${project.title} is private`} title="Private / confidential — not public">
                    <Lock size={14} /> Private
                  </span>
                ) : (
                  <a className="project-link" href={`https://github.com/richiepaulaquino/${project.title.toLowerCase().replaceAll(" ", "-")}`} target="_blank" rel="noreferrer" aria-label={`View ${project.title} on GitHub`}>
                    <Github size={16} /> View code
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="section-stack" aria-labelledby="contact-heading">
      <div className="section-heading-row">
        <div>
          <Eyebrow>Start a conversation</Eyebrow>
          <h2 id="contact-heading">Let&apos;s make something useful.</h2>
        </div>
        <span className="section-count">06 / 06</span>
      </div>
      <div className="contact-layout">
        <div className="contact-copy">
          <p className="large-copy">I&apos;m open to internships, junior roles, mentorship, and kind conversations about the web.</p>
          <p className="muted-copy">The form is front-end only for now. For a direct hello, use one of the links below.</p>
          <div className="contact-links">
            <a href="mailto:hello@richiepaulaquino.dev"><Mail size={17} /> hello@richiepaulaquino.dev <ArrowUpRight size={15} /></a>
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer"><Linkedin size={17} /> LinkedIn <ArrowUpRight size={15} /></a>
            <a href="https://github.com/richiepaulaquino" target="_blank" rel="noreferrer"><Github size={17} /> GitHub <ArrowUpRight size={15} /></a>
          </div>
        </div>
        <form className="contact-form" onSubmit={submitForm}>
          <label htmlFor="name">Your name<input id="name" name="name" placeholder="Jane Smith" required /></label>
          <label htmlFor="email">Email address<input id="email" name="email" type="email" placeholder="jane@company.com" required /></label>
          <label htmlFor="message">A little note<textarea id="message" name="message" rows={4} placeholder="What would you like to talk about?" required /></label>
          <button className="button button-primary" type="submit">{submitted ? <>Message noted <Check size={17} /></> : <>Send a note <Send size={16} /></>}</button>
          {submitted && <p className="form-success" role="status">Thanks — this demo form is ready to connect to a backend when you are.</p>}
        </form>
      </div>
    </section>
  );
}

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const pageRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useRef(false);

  useLayoutEffect(() => {
    reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!pageRef.current || reduceMotion.current) return;

    const context = gsap.context(() => {
      const section = pageRef.current?.querySelector(".section-stack");
      if (!section) return;
      const elements = section.querySelectorAll(
        ".eyebrow, h1, h2, .hero-intro, .button-row, .hero-note, .section-count, .about-layout, .experience-intro, .experience-timeline, .education-card, .skills-intro-row, .skills-grid, .learning-banner, .projects-list, .about-hobbies, .about-hobbies-grid, .contact-layout, .home-lower"
      );

      gsap.fromTo(
        elements,
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.62, stagger: 0.055, ease: "power3.out", clearProps: "all" }
      );

      gsap.fromTo(
        ".hero-note .note-card-front",
        { rotation: 3, y: 12 },
        { rotation: 7, y: 0, duration: 0.85, ease: "back.out(1.7)" }
      );
      gsap.to(".hero-note .sun-shape", {
        x: 7,
        y: -5,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, pageRef);

    return () => context.revert();
  }, [activeSection]);

  useLayoutEffect(() => {
    if (reduceMotion.current || !pageRef.current) return;
    const cards = pageRef.current.querySelectorAll<HTMLElement>(".project-card, .value-card, .skill-group");
    const cleanups: (() => void)[] = [];

    cards.forEach((card) => {
      const onEnter = () => gsap.to(card, { y: -5, rotateZ: 0.35, duration: 0.24, ease: "power2.out", overwrite: true });
      const onLeave = () => gsap.to(card, { y: 0, rotateZ: 0, duration: 0.35, ease: "power3.out", overwrite: true });
      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        card.removeEventListener("mouseenter", onEnter);
        card.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [activeSection]);

  const goTo = (section: Section) => {
    if (section === activeSection || reduceMotion.current || !pageRef.current) {
      setActiveSection(section);
      setMobileOpen(false);
      window.scrollTo({ top: 0, behavior: reduceMotion.current ? "auto" : "smooth" });
      return;
    }

    gsap.to(pageRef.current.querySelector(".section-stack"), {
      autoAlpha: 0,
      y: -8,
      duration: 0.16,
      ease: "power2.in",
      onComplete: () => setActiveSection(section),
    });
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="portfolio-shell" ref={pageRef}>
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <div><strong>Richie Paul Aquiño</strong><span>Developer in progress</span></div>
        </div>
        <div className="sidebar-label">Explore</div>
        <nav className="sidebar-nav" aria-label="Primary navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return <button className={`nav-item ${activeSection === item.id ? "active" : ""}`} key={item.id} onClick={() => goTo(item.id)} type="button" aria-current={activeSection === item.id ? "page" : undefined}><Icon size={17} strokeWidth={1.8} /><span>{item.label}</span>{activeSection === item.id && <span className="nav-indicator" />}</button>;
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="availability"><span className="pulse-dot" /><span>Open to opportunities</span></div>
          <div className="sidebar-socials"><a href="https://www.facebook.com/richiepaul.lagamonaquino" target="_blank" rel="noreferrer" aria-label="Richie on Facebook"><Facebook size={17} /></a><a href="https://www.instagram.com/ret.cheee/" target="_blank" rel="noreferrer" aria-label="Richie on Instagram"><Instagram size={17} /></a><a href="https://github.com/paullooll" target="_blank" rel="noreferrer" aria-label="Richie on GitHub"><Github size={17} /></a><a href="https://www.linkedin.com/in/richie-paul-aquiño-2bb196265" target="_blank" rel="noreferrer" aria-label="Richie on LinkedIn"><Linkedin size={17} /></a></div>
          <p className="sidebar-footnote">© 2026 | All Rights Reserved</p>
        </div>
      </aside>

      <div className="mobile-bar"><button className="mobile-logo" onClick={() => goTo("home")} type="button">RP</button><span>{navItems.find((item) => item.id === activeSection)?.label}</span><div className="mobile-actions"><button className="theme-toggle" onClick={toggleTheme} type="button" aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>{theme === "light" ? <Moon size={17} /> : <Sun size={17} />}</button><button className="mobile-toggle" onClick={() => setMobileOpen((open) => !open)} type="button" aria-label={mobileOpen ? "Close menu" : "Open menu"}>{mobileOpen ? <X size={22} /> : <Menu size={22} />}</button></div></div>
      {mobileOpen && <button className="mobile-backdrop" aria-label="Close menu" onClick={() => setMobileOpen(false)} type="button" />}

      <main className="main-panel">
        <div className="topline"><span>PORTFOLIO / 2026</span><div className="topline-right"><span className="availability-copy"><Globe2 size={14} /> Available for a good challenge</span><button className="theme-toggle" onClick={toggleTheme} type="button" aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`} title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>{theme === "light" ? <Moon size={15} /> : <Sun size={15} />}<span>{theme === "light" ? "Dark mode" : "Light mode"}</span></button></div></div>
        <div className="content-wrap">
          {activeSection === "home" && <HomeSection goTo={goTo} />}
          {activeSection === "about" && <AboutSection goTo={goTo} />}
          {activeSection === "experience" && <ExperienceSection />}
          {activeSection === "skills" && <SkillsSection />}
          {activeSection === "projects" && <ProjectsSection />}
          {activeSection === "contact" && <ContactSection />}
        </div>
        <footer className="mobile-footer"><Heart size={14} fill="currentColor" /> Built with curiosity.</footer>
      </main>
    </div>
  );
}

export { HomeIcon };

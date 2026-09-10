import { FormEvent, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Code2,
  Github,
  Globe2,
  Heart,
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
    label: "Languages",
    number: "01",
    skills: ["HTML", "CSS", "JavaScript", "TypeScript"],
  },
  {
    label: "Tools",
    number: "02",
    skills: ["Git & GitHub", "VS Code", "Figma", "Chrome DevTools"],
  },
  {
    label: "Currently learning",
    number: "03",
    skills: ["React", "Tailwind CSS", "REST APIs", "Accessibility"],
  },
];

const projects = [
  {
    number: "01",
    type: "Learning project",
    title: "Daylight Notes",
    description:
      "A calm, browser-based notes space with simple tags and a focused writing flow.",
    stack: ["HTML", "CSS", "JavaScript"],
    color: "apricot",
  },
  {
    number: "02",
    type: "Practice build",
    title: "Plant Parent",
    description:
      "A small responsive dashboard for keeping track of watering reminders and light needs.",
    stack: ["React", "CSS", "Local storage"],
    color: "sage",
  },
  {
    number: "03",
    type: "Exploration",
    title: "City Bites",
    description:
      "A mobile-first restaurant list exploring filters, cards, and thoughtful empty states.",
    stack: ["JavaScript", "API basics", "Figma"],
    color: "lilac",
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
          <div className="note-illustration">
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
      <div className="values-grid">
        <div className="value-card"><span>01</span><strong>Stay curious</strong><p>Keep asking “why?” until the problem is clearer.</p></div>
        <div className="value-card"><span>02</span><strong>Make it useful</strong><p>Prefer thoughtful, understandable solutions over noise.</p></div>
        <div className="value-card"><span>03</span><strong>Keep showing up</strong><p>Small, consistent practice adds up over time.</p></div>
      </div>
      <div className="about-hobbies">
        <div className="about-hobbies-heading"><Eyebrow>Outside the browser</Eyebrow><h3>The things that keep me curious.</h3></div>
        <div className="about-hobbies-grid">
          <article className="about-hobby-card about-hobby-listening"><div className="about-hobby-top"><span className="hobby-icon"><Heart size={16} fill="currentColor" /></span><span>Spotify-ready</span></div><div><p className="hobby-label">Currently listening</p><strong>Your favorite playlist</strong><p>Add a Spotify embed now, or connect the API later to show what&apos;s playing in real time.</p></div><button className="hobby-link" type="button">Add playlist <ArrowUpRight size={15} /></button></article>
          <article className="about-hobby-card"><div className="about-hobby-top"><span className="hobby-icon"><Sparkles size={16} /></span><span>Personal interests</span></div><div><p className="hobby-label">Beyond code</p><strong>Music, making, and new ideas</strong><p>A compact space for the creative activities, books, games, or rituals that are part of your story.</p></div></article>
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
      <div className="learning-banner">
        <div className="learning-icon"><MonitorSmartphone size={22} /></div>
        <div><strong>Next on the desk</strong><p>Building a small React project with an accessible component system.</p></div>
        <ChevronRight className="banner-arrow" size={20} />
      </div>
    </section>
  );
}

function ProjectsSection() {
  return (
    <section className="section-stack" aria-labelledby="projects-heading">
      <div className="section-heading-row">
        <div>
          <Eyebrow>Selected builds</Eyebrow>
          <h2 id="projects-heading">Small projects, real practice.</h2>
        </div>
        <span className="section-count">04 / 06</span>
      </div>
      <div className="projects-list">
        {projects.map((project) => (
          <article className={`project-card ${project.color}`} key={project.title}>
            <div className="project-art" aria-hidden="true"><span className="project-art-label">{project.number}</span><span className="project-art-shape" /></div>
            <div className="project-content">
              <div className="project-meta"><span>{project.type}</span><span>{project.number}</span></div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-footer">
                <div className="stack-list">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
                <a className="project-link" href={`https://github.com/richiepaulaquino/${project.title.toLowerCase().replaceAll(" ", "-")}`} target="_blank" rel="noreferrer" aria-label={`View ${project.title} on GitHub`}>
                  <Github size={16} /> View code
                </a>
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
          <button className="monogram" aria-label="Go to home" onClick={() => goTo("home")} type="button">RP</button>
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
          <div className="sidebar-socials"><a href="https://github.com/richiepaulaquino" target="_blank" rel="noreferrer" aria-label="Richie on GitHub"><Github size={17} /></a><a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="Richie on LinkedIn"><Linkedin size={17} /></a><a href="mailto:hello@richiepaulaquino.dev" aria-label="Email Richie"><Mail size={17} /></a></div>
          <p className="sidebar-footnote">© 2026 · Made with patience<br />and a lot of browser tabs.</p>
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

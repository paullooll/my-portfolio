import { ArrowRight } from "lucide-react";
import content from "@/content";
import { Portrait } from "@/components/fx/Portrait";
import { useTypewriter } from "@/motion/useTypewriter";

/** Home: name, one-line role, two calls to action, status chips. */
export function Hero() {
  const [live, ...rest] = content.status;
  const typed = useTypewriter(content.roles);
  return (
    <section id="home" className="hero" aria-labelledby="home-heading">
      <div className="container hero-inner">
        <Portrait />
        <div className="hero-copy">
        <p className="eyebrow typed">
          <span className="sr-only">{content.role}</span>
          <span aria-hidden="true">
            {typed}
            <span className="caret" />
          </span>
        </p>
        <h1 id="home-heading" className="hero-name">
          {content.name}
        </h1>
        <p className="hero-lede">{content.valueStatement}</p>
        <div className="hero-actions">
          <a className="button button-primary" href="#projects">
            View Projects <ArrowRight size={16} aria-hidden="true" />
          </a>
          <a className="button" href="#contact">
            Contact
          </a>
        </div>
        <ul className="chip-list hero-status" aria-label="Status">
          <li className="chip chip-accent">
            <span className="live-dot" aria-hidden="true" />
            {live}
          </li>
          {rest.map(s => (
            <li key={s} className="chip chip-outline">
              {s}
            </li>
          ))}
        </ul>
        </div>
      </div>
    </section>
  );
}

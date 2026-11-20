import { ArrowRight } from "lucide-react";
import content from "@/content";

/** Home: name, one-line role, two calls to action, status chips. */
export function Hero() {
  const [live, ...rest] = content.status;
  return (
    <section id="home" className="hero" aria-labelledby="home-heading">
      <div className="container hero-inner">
        <p className="eyebrow">{content.role}</p>
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
    </section>
  );
}

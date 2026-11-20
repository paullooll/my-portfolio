import { ArrowUpRight, Dumbbell, Gamepad2, Heart, Plane } from "lucide-react";
import content, { type Hobby } from "@/content";
import { Gate } from "@/components/Gate";
import { SectionFrame } from "@/components/SectionFrame";

const icons: Record<Hobby["icon"], typeof Heart> = {
  heart: Heart,
  gamepad: Gamepad2,
  dumbbell: Dumbbell,
  plane: Plane,
};

/** About: photo + story, the Now/Learning card, and a few things outside work. */
export function About() {
  const { about, now, hobbies } = content;
  return (
    <SectionFrame id="about" title={`Hi, I'm ${content.shortName}`}>
      <div className="about-grid">
        <figure className="about-photo" data-reveal>
          <picture>
            <source srcSet="/light.webp" type="image/webp" />
            <img
              src="/light.png"
              alt={`Portrait of ${content.name}`}
              width={1200}
              height={900}
              loading="lazy"
              decoding="async"
            />
          </picture>
        </figure>
        <div className="about-copy">
          <p className="lede" data-reveal>
            {about.lede}
          </p>
          {about.body.map(p => (
            <p key={p.slice(0, 24)} className="muted" data-reveal>
              {p}
            </p>
          ))}

          <section
            className="card card-pad now"
            aria-labelledby="now-heading"
            data-reveal
          >
            <div className="now-head">
              <h3 id="now-heading">
                <span className="live-dot" aria-hidden="true" /> Now / Learning
              </h3>
              <Gate value={now.updated} as="span">
                <span className="mono muted">Updated {now.updated}</span>
              </Gate>
            </div>
            <p className="muted">{now.lede}</p>
            <ul className="now-list">
              {now.items.map(i => (
                <li key={i.topic}>
                  <span className="now-topic">{i.topic}</span>
                  <Gate value={i.note} as="span">
                    <span className="muted"> — {i.note}</span>
                  </Gate>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <h3 className="eyebrow outside-head" data-reveal>
        Outside work
      </h3>
      <ul className="hobby-grid">
        {hobbies.map(h => {
          const Icon = icons[h.icon];
          const inner = (
            <>
              <Icon size={18} className="accent" aria-hidden="true" />
              <h4>{h.title}</h4>
              <p className="muted">{h.text}</p>
              {h.link !== undefined && (
                <a
                  className="text-link"
                  href={h.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {h.linkLabel} <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              )}
            </>
          );
          // A card that only exists to hold a link waits for that link.
          return h.link !== undefined ? (
            <Gate
              key={h.title}
              value={h.link}
              as="li"
              className="card card-pad hobby"
            >
              {inner}
            </Gate>
          ) : (
            <li key={h.title} className="card card-pad hobby" data-reveal>
              {inner}
            </li>
          );
        })}
      </ul>
    </SectionFrame>
  );
}

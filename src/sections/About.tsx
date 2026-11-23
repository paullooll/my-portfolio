import { Gamepad2, Music } from "lucide-react";
import content, { type Hobby } from "@/content";
import { NowPlaying } from "@/components/NowPlaying";
import { SectionFrame } from "@/components/SectionFrame";

const icons: Record<Hobby["icon"], typeof Music> = {
  music: Music,
  gamepad: Gamepad2,
};

/** About: photo + story and a few things outside work. */
export function About() {
  const { about, hobbies } = content;
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
        </div>
      </div>

      <h3 className="eyebrow outside-head" data-reveal>
        Outside work
      </h3>
      <ul className="hobby-grid">
        {hobbies.map(h => {
          const Icon = icons[h.icon];
          return (
            <li key={h.title} className="card card-pad hobby" data-reveal>
              <Icon size={18} className="accent" aria-hidden="true" />
              <h4>{h.title}</h4>
              {h.live === "spotify" ? (
                <NowPlaying fallback={h.text} />
              ) : (
                <p className="muted">{h.text}</p>
              )}
            </li>
          );
        })}
      </ul>
    </SectionFrame>
  );
}

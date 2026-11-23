import content from "@/content";
import { SectionFrame } from "@/components/SectionFrame";

/** Experience: one timeline for work, internship and studies, newest first. */
export function Experience() {
  return (
    <SectionFrame
      id="experience"
      title="Work & studies"
      intro="Real work in government, an internship, and graduate school alongside it."
    >
      <ol className="timeline">
        {content.timeline.map(t => (
          <li
            key={t.title}
            className={`timeline-item ${t.current ? "is-current" : ""}`}
            data-reveal
          >
            <span className="timeline-dot" aria-hidden="true" />
            <div className="timeline-meta">
              <p className="mono muted">{t.when}</p>
              <p className="mono">
                <span className={t.current ? "chip chip-accent" : "chip"}>
                  {t.kind}
                  {t.current && <span className="sr-only"> (current)</span>}
                </span>
              </p>
            </div>
            <div className="timeline-body">
              <h3>{t.title}</h3>
              <p className="timeline-org">{t.org}</p>
              <p className="muted">{t.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </SectionFrame>
  );
}

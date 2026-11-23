import type { ReactNode } from "react";
import content, { type SectionId } from "@/content";

/**
 * One page section: a numbered mono eyebrow, an h2 and an optional intro line.
 * The h2 id (`<id>-heading`) labels the section for screen readers.
 */
export function SectionFrame({
  id,
  title,
  intro,
  children,
}: {
  id: SectionId;
  /** Heading text; defaults to the section's plain name. */
  title?: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  const index = content.sections.findIndex(s => s.id === id);
  const meta = content.sections[index];
  return (
    <section id={id} className="section" aria-labelledby={`${id}-heading`}>
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="eyebrow">
            <span className="accent">{String(index).padStart(2, "0")}</span>{" "}
            / {meta.plain}
          </p>
          <h2 id={`${id}-heading`}>{title ?? meta.plain}</h2>
          {intro && <p>{intro}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}

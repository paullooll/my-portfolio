import { useEffect, useRef } from "react";
import { ExternalLink, Github, Lock, X } from "lucide-react";
import type { Project } from "@/content";
import { useIsDev } from "@/hooks/useIsDev";
import { visibleItems } from "@/lib/placeholder";
import { Gate } from "./Gate";
import { Picture } from "./Picture";
import { ProjectMedia } from "./ProjectMedia";

/**
 * Case study: Problem, My role, Tech stack, Key features, Result, Screenshots.
 * Native <dialog>: showModal() traps focus and Esc closes. The parent restores
 * focus to the card that opened it.
 */
export function CaseStudyDialog({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const isDev = useIsDev();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (project && !d.open) d.showModal();
    if (!project && d.open) d.close();
  }, [project]);

  const cs = project?.caseStudy;
  return (
    <dialog
      ref={ref}
      className="case-dialog"
      aria-labelledby="case-title"
      onClose={onClose}
      onCancel={onClose}
      onClick={e => e.target === ref.current && onClose()}
    >
      {project && cs && (
        <article>
          <header className="case-head">
            <div>
              <p className="eyebrow">
                Case study · {project.number} · {project.type}
              </p>
              <h2 id="case-title">{project.title}</h2>
            </div>
            <button type="button" className="icon-button" onClick={onClose}>
              <X size={18} aria-hidden="true" />
              <span className="sr-only">Close case study</span>
            </button>
          </header>

          <div className="case-content">
            <dl className="case-grid">
              <Gate value={cs.problem}>
                <div className="span-2">
                  <dt className="eyebrow">Problem</dt>
                  <dd>{cs.problem}</dd>
                </div>
              </Gate>
              <div>
                <dt className="eyebrow">My role</dt>
                <dd>{cs.role}</dd>
              </div>
              <div>
                <dt className="eyebrow">Tech stack</dt>
                <dd>
                  <ul className="chip-list">
                    {project.stack.map(s => (
                      <li key={s} className="chip">
                        {s}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div className="span-2">
                <dt className="eyebrow">Key features</dt>
                <dd>
                  <ul className="bullets">
                    {cs.features.map(f => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <Gate value={cs.result}>
                <div className="span-2">
                  <dt className="eyebrow">Result</dt>
                  <dd>{cs.result}</dd>
                </div>
              </Gate>
            </dl>

            <section aria-labelledby="case-shots-title" className="case-shots">
              <h3 id="case-shots-title" className="eyebrow">
                Screenshots
              </h3>
              <ProjectMedia
                project={project}
                alt={`${project.title} screenshot`}
              />
              {!project.private && (
                <Gate value={cs.media}>
                  {visibleItems(cs.media, isDev).map(src => (
                    <Picture
                      key={src}
                      src={src}
                      alt={`${project.title} screenshot`}
                      width={1920}
                      height={1080}
                    />
                  ))}
                </Gate>
              )}
              {project.private && (
                <p className="mono muted">
                  Internal government system: real screenshots, URLs, names
                  and data are not shown.
                </p>
              )}
              <Gate value={cs.video}>
                <video
                  src={cs.video}
                  controls
                  muted
                  playsInline
                  preload="none"
                />
              </Gate>
            </section>

            <footer className="case-links">
              {project.github && (
                <a
                  className="button"
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github size={16} aria-hidden="true" /> View code
                </a>
              )}
              {!project.private && (
                <Gate value={project.live} as="span">
                  <a
                    className="button button-primary"
                    href={project.live}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink size={16} aria-hidden="true" /> Live site
                  </a>
                </Gate>
              )}
              {project.private && (
                <span className="chip">
                  <Lock size={12} aria-hidden="true" /> Private · Iloilo City
                  Government
                </span>
              )}
            </footer>
          </div>
        </article>
      )}
    </dialog>
  );
}

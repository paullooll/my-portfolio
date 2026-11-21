import { useRef } from "react";
import { ArrowUpRight, Github, Lock } from "lucide-react";
import { useTilt } from "@/motion/useTilt";
import type { Project } from "@/content";
import { ProjectMedia } from "./ProjectMedia";

/**
 * One project card. The title is a real <button> (keyboard + screen reader),
 * and the whole card is clickable through a stretched pseudo-element.
 */
export function ProjectCard({
  project: p,
  onOpen,
}: {
  project: Project;
  onOpen: (id: string, el: HTMLElement) => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  useTilt(ref);
  return (
    <li ref={ref} className="project card" data-reveal>
      <div className="project-media">
        <ProjectMedia project={p} />
        <span className="project-peek mono" aria-hidden="true">
          View case study <ArrowUpRight size={14} />
        </span>
      </div>
      <span className="project-glare" aria-hidden="true" />
      <div className="project-body">
        <p className="mono muted">
          {p.number} · {p.type}
        </p>
        <h3>
          <button
            type="button"
            className="project-open"
            data-project={p.id}
            onClick={e => onOpen(p.id, e.currentTarget)}
          >
            {p.title}
          </button>
        </h3>
        <p className="muted project-desc">{p.description}</p>
        <ul className="chip-list" aria-label="Tags">
          {p.tags.map(t => (
            <li key={t} className="chip">
              {t}
            </li>
          ))}
        </ul>
        <div className="project-foot">
          <span className="text-link" aria-hidden="true">
            Case study <ArrowUpRight size={15} />
          </span>
          {p.private ? (
            <span className="mono muted project-private">
              <Lock size={13} aria-hidden="true" /> Internal · gov
            </span>
          ) : (
            p.github && (
              <a
                className="project-gh mono muted"
                href={p.github}
                target="_blank"
                rel="noreferrer"
              >
                <Github size={14} aria-hidden="true" /> Code
                <span className="sr-only"> for {p.title} (opens GitHub)</span>
              </a>
            )
          )}
        </div>
      </div>
    </li>
  );
}

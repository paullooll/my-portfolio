import { useCallback, useEffect, useRef, useState } from "react";
import content from "@/content";
import { CaseStudyDialog } from "@/components/CaseStudyDialog";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionFrame } from "@/components/SectionFrame";
import {
  FILTERS,
  closeFocusTarget,
  filterProjects,
  projectIdFromHash,
  type Filter,
} from "@/lib/projects";

/**
 * Projects: filter buttons + cards. "All" starts with the featured three and
 * a "Show all" button. Each card opens a case study at #project-<id>.
 */
export function Projects() {
  const [filter, setFilter] = useState<Filter>("All");
  const [showAll, setShowAll] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const shown = filterProjects(content.projects, filter, showAll);
  const hiddenCount =
    filter === "All" ? content.projects.length - shown.length : 0;
  const project = content.projects.find(p => p.id === openId) ?? null;

  // Deep links: open from the URL hash on load and whenever it changes
  // (Haunt's chat links use these too).
  useEffect(() => {
    const sync = () => {
      const id = projectIdFromHash(window.location.hash, content.projects);
      if (id) setOpenId(id);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const open = (id: string, el: HTMLElement) => {
    opener.current = el;
    setOpenId(id);
    history.replaceState(null, "", `#project-${id}`);
  };

  // Idempotent: called by ✕, backdrop click, Esc ("cancel") and "close".
  const lastOpen = useRef<string | null>(null);
  const close = useCallback(() => {
    setOpenId(current => {
      if (current) lastOpen.current = current;
      return null;
    });
    if (window.location.hash.startsWith("#project-"))
      history.replaceState(null, "", "#projects");
  }, []);

  // Restore focus after the dialog has actually closed.
  useEffect(() => {
    if (openId !== null || lastOpen.current === null) return;
    const target = closeFocusTarget(lastOpen.current, opener.current, sel =>
      document.querySelector<HTMLElement>(sel)
    );
    opener.current = null;
    lastOpen.current = null;
    if (target?.id === "projects-heading")
      target.setAttribute("tabindex", "-1");
    target?.focus();
  }, [openId]);

  return (
    <SectionFrame
      id="projects"
      title="Selected projects"
      intro="Government systems, data work, school and personal projects. Open any card for the case study."
    >
      <div className="filters" role="group" aria-label="Filter projects">
        {FILTERS.map(f => (
          <button
            key={f}
            type="button"
            className="filter"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {shown.length} projects shown
      </p>
      {shown.length === 0 ? (
        <p className="muted">No projects in this category yet.</p>
      ) : (
        <ul className="project-grid">
          {shown.map(p => (
            <ProjectCard key={p.id} project={p} onOpen={open} />
          ))}
        </ul>
      )}
      {hiddenCount > 0 && (
        <div className="projects-more">
          <button
            type="button"
            className="button"
            onClick={() => setShowAll(true)}
          >
            Show all {content.projects.length} projects
          </button>
        </div>
      )}
      <CaseStudyDialog project={project} onClose={close} />
    </SectionFrame>
  );
}

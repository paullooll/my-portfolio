import type { Project } from "@/content";
import { MockPreview } from "./MockPreview";
import { Picture } from "./Picture";

/**
 * A project's preview image: the real screenshot for public projects, a
 * data-free mock for internal ones (never a real government screenshot).
 */
export function ProjectMedia({
  project,
  alt = "",
}: {
  project: Project;
  /** Empty by default: on cards the title right below already names it. */
  alt?: string;
}) {
  if (project.private || !project.image || !project.imageSize)
    return <MockPreview title={project.title} />;
  return (
    <Picture
      src={project.image}
      alt={alt}
      width={project.imageSize.width}
      height={project.imageSize.height}
      className="shot"
    />
  );
}

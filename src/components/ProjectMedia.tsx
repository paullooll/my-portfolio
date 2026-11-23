import type { Project } from "@/content";
import { MockPreview } from "./MockPreview";
import { Picture } from "./Picture";

/**
 * A project's preview image, or a data-free mock when there is none.
 */
export function ProjectMedia({
  project,
  alt = "",
}: {
  project: Project;
  /** Empty by default: on cards the title right below already names it. */
  alt?: string;
}) {
  if (!project.image || !project.imageSize)
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

import type { ReactNode } from "react";
import { isFilled, shouldRender } from "@/lib/placeholder";
import { useIsDev } from "@/hooks/useIsDev";

/**
 * Renders children only when `value` is filled in.
 * Dev: unfilled content is still shown, wrapped in a dashed [TODO] marker.
 * Production: unfilled content is not rendered at all.
 */
export function Gate({
  value,
  children,
  as: Tag = "div",
  className,
}: {
  value: unknown;
  children: ReactNode;
  as?: "div" | "span" | "li";
  className?: string;
}) {
  const isDev = useIsDev();
  if (!shouldRender(value, isDev)) return null;
  if (isFilled(value))
    return className ? (
      <Tag className={className}>{children}</Tag>
    ) : (
      <>{children}</>
    );
  return <Tag className={`todo-marker ${className ?? ""}`}>{children}</Tag>;
}

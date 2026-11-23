import { Lock } from "lucide-react";

/**
 * Generic, data-free dashboard wireframe used instead of real screenshots for
 * internal government systems. Nothing in it comes from the real system: it is
 * the same abstract layout for every private project, tinted with the accent.
 */
export function MockPreview({ title }: { title: string }) {
  return (
    <figure className="mock" role="img" aria-label={`${title}: illustration. The real system is internal, so screenshots are private.`}>
      <svg viewBox="0 0 320 180" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
        {/* sidebar */}
        <rect x="0" y="0" width="64" height="180" fill="var(--surface)" />
        {[24, 40, 52, 64, 76].map(y => (
          <rect key={y} x="12" y={y} width={y === 24 ? 28 : 40} height="5" rx="2.5" fill="var(--line)" />
        ))}
        {/* top bar */}
        <rect x="64" y="0" width="256" height="22" fill="var(--surface)" />
        <rect x="76" y="8" width="60" height="6" rx="3" fill="var(--line)" />
        <circle cx="304" cy="11" r="5" fill="var(--line)" />
        {/* stat cards */}
        {[76, 158, 240].map((x, i) => (
          <g key={x}>
            <rect x={x} y="32" width="72" height="36" rx="6" fill="var(--surface)" stroke="var(--line)" />
            <rect x={x + 8} y="40" width="30" height="4" rx="2" fill="var(--line)" />
            <rect x={x + 8} y="50" width={i === 0 ? 40 : 28} height="8" rx="3" fill={i === 0 ? "var(--accent)" : "var(--ink-muted)"} opacity={i === 0 ? 0.85 : 0.35} />
          </g>
        ))}
        {/* table */}
        <rect x="76" y="78" width="236" height="94" rx="6" fill="var(--surface)" stroke="var(--line)" />
        {[92, 108, 124, 140, 156].map((y, i) => (
          <g key={y} opacity={i === 0 ? 1 : 0.8}>
            <rect x="86" y={y} width="56" height="5" rx="2.5" fill={i === 0 ? "var(--ink-muted)" : "var(--line)"} opacity={i === 0 ? 0.5 : 1} />
            <rect x="156" y={y} width="70" height="5" rx="2.5" fill="var(--line)" />
            <rect x="240" y={y} width="28" height="5" rx="2.5" fill={i % 2 ? "var(--accent)" : "var(--line)"} opacity={i % 2 ? 0.6 : 1} />
          </g>
        ))}
      </svg>
      <figcaption className="mock-label mono">
        <Lock size={12} aria-hidden="true" /> Screenshots private
      </figcaption>
    </figure>
  );
}

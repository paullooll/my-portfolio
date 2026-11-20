import { Cloud, Code2, Database } from "lucide-react";
import content, { type SkillGroup } from "@/content";
import { Gate } from "@/components/Gate";
import { SectionFrame } from "@/components/SectionFrame";
import { useIsDev } from "@/hooks/useIsDev";
import { visibleItems } from "@/lib/placeholder";

const icons: Record<SkillGroup["name"], typeof Code2> = {
  Web: Code2,
  "Data / AI": Database,
  "Cloud / Security": Cloud,
};

/** Skills in three groups. Plain chips, no percentage bars; "learning" is labeled in text. */
export function Skills() {
  const isDev = useIsDev();
  return (
    <SectionFrame
      id="skills"
      title="Tools I work with"
      intro="A growing toolkit, not a list of claimed mastery."
    >
      <ul className="skills-grid">
        {content.skills.map(g => {
          const Icon = icons[g.name];
          return (
            <li key={g.name} className="card card-pad skill-group" data-reveal>
              <h3>
                <Icon size={18} className="accent" aria-hidden="true" />
                {g.name}
              </h3>
              <p className="eyebrow">Using</p>
              <ul className="chip-list" aria-label={`${g.name}: using`}>
                {g.using.map(s => (
                  <li key={s} className="chip">
                    {s}
                  </li>
                ))}
              </ul>
              <Gate value={g.learning}>
                <p className="eyebrow">Learning</p>
                <ul className="chip-list" aria-label={`${g.name}: learning`}>
                  {visibleItems(g.learning, isDev).map(s => (
                    <li key={s} className="chip chip-outline">
                      {s}
                    </li>
                  ))}
                </ul>
              </Gate>
            </li>
          );
        })}
      </ul>
      <p className="muted skills-note" data-reveal>
        {content.skillsNote}
      </p>
    </SectionFrame>
  );
}

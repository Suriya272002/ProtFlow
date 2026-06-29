import { Icon } from "../components/Icon";
import { COLOR_STYLES } from "../lib/constants";
import type { SkillItem } from "../lib/types";

const FALLBACK_SKILLS = [
  { icon: "code",            title: "Frontend",  desc: "React, Next.js, Tailwind CSS",  color: "primary",           w: "95%" },
  { icon: "database",        title: "Backend",   desc: "Node.js, Express, PostgreSQL",  color: "secondary",         w: "85%" },
  { icon: "view_in_ar",      title: "3D Design", desc: "Three.js, Blender, WebGL",      color: "tertiary",          w: "75%" },
  { icon: "design_services", title: "UI / UX",   desc: "Figma, Prototyping",            color: "primary-container", w: "90%" },
];

interface SkillsSectionProps {
  skills: SkillItem[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <section id="skills" className="py-stack-xl bg-surface-container-low/30 px-margin-desktop">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <span className="text-primary font-label-sm text-label-sm tracking-widest uppercase">
            Expertise
          </span>
          <h2 className="font-headline-xl text-headline-xl glow-text">Technical Skills</h2>
        </div>

        {skills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((s, i) => {
              const color = COLOR_STYLES[i % COLOR_STYLES.length];
              return (
                <div
                  key={s.id}
                  className="glass-card p-8 rounded-2xl space-y-4 border border-white/5 hover:translate-y-[-8px] transition-all duration-300 group reveal tilt-card"
                >
                  <div className={`w-14 h-14 rounded-xl ${color.bg} flex items-center justify-center ${color.text}`}>
                    <Icon name={s.icon} className="text-headline-lg" />
                  </div>
                  <h3 className="font-headline-md text-headline-md">{s.name}</h3>
                  <p className="text-body-md text-on-surface-variant">{s.category}</p>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full ${color.bar}`} style={{ width: `${s.level}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FALLBACK_SKILLS.map((s) => (
              <div
                key={s.title}
                className="glass-card p-8 rounded-2xl space-y-4 border border-white/5 hover:translate-y-[-8px] transition-all duration-300 group reveal tilt-card"
              >
                <div className={`w-14 h-14 rounded-xl bg-${s.color}/10 flex items-center justify-center text-${s.color} group-hover:scale-110 transition-transform`}>
                  <Icon name={s.icon} className="text-headline-lg" />
                </div>
                <h3 className="font-headline-md text-headline-md">{s.title}</h3>
                <p className="text-body-md text-on-surface-variant">{s.desc}</p>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full bg-${s.color}`} style={{ width: s.w }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

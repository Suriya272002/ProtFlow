import { Icon } from "./Icon";

const SECTION_ICONS = [
  { href: "about",     icon: "person", label: "About"     },
  { href: "education", icon: "school", label: "Education" },
  { href: "skills",    icon: "bolt",   label: "Skills"    },
  { href: "projects",  icon: "work",   label: "Projects"  },
];

export function SectionNavIcons() {
  return (
    <div className="w-full flex justify-center py-12 gap-12 border-y border-white/5 bg-surface-container-lowest/50 flex-wrap">
      {SECTION_ICONS.map((n) => (
        <a
          key={n.label}
          href={`#${n.href}`}
          className="flex flex-col items-center gap-2 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl glass-card flex items-center justify-center group-hover:scale-110 group-hover:text-primary transition-all">
            <Icon name={n.icon} />
          </div>
          <span className="text-label-sm font-label-sm uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
            {n.label}
          </span>
        </a>
      ))}
    </div>
  );
}

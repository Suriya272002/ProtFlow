import { Icon } from "../components/Icon";
import type { ServiceItem } from "../lib/types";

const FALLBACK_SERVICES: ServiceItem[] = [
  { id: 1, icon: "code",       title: "Web Development", desc: "Full-stack apps with React, Node.js and TypeScript.", price: "from $2,500" },
  { id: 2, icon: "view_in_ar", title: "3D Experiences",  desc: "Immersive Three.js and WebGL experiences.",           price: "from $4,000" },
  { id: 3, icon: "palette",    title: "UI / UX Design",  desc: "Modern and beautiful interfaces.",                    price: "from $1,800" },
];

const SERVICE_STYLES = [
  { bg: "bg-primary/10",   text: "text-primary",   border: "hover:border-primary/40"   },
  { bg: "bg-secondary/10", text: "text-secondary", border: "hover:border-secondary/40" },
  { bg: "bg-tertiary/10",  text: "text-tertiary",  border: "hover:border-tertiary/40"  },
];

interface ServicesSectionProps {
  services: ServiceItem[];
}

export function ServicesSection({ services }: ServicesSectionProps) {
  const list = services.length > 0 ? services : FALLBACK_SERVICES;

  return (
    <section id="services" className="py-stack-xl px-margin-desktop">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <span className="text-primary font-label-sm text-label-sm tracking-widest uppercase">
            What I Offer
          </span>
          <h2 className="font-headline-xl text-headline-xl glow-text">Services</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((s, i) => {
            const style = SERVICE_STYLES[i % SERVICE_STYLES.length];
            return (
              <div
                key={s.id}
                className={`glass-card p-8 rounded-2xl border border-white/10 ${style.border} hover:translate-y-[-8px] transition-all duration-300 space-y-5`}
              >
                <div className={`w-16 h-16 rounded-2xl ${style.bg} ${style.text} flex items-center justify-center`}>
                  <Icon name={s.icon} className="text-[32px]" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-white">{s.title}</h3>
                  <p className="text-on-surface-variant leading-relaxed">{s.desc}</p>
                  <div className="pt-2">
                    <span className="text-primary font-bold text-lg">{s.price}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

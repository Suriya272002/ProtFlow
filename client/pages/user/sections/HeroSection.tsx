import { Icon } from "../components/Icon";
import { getTechIcon } from "../lib/constants";
import { resolveCvUrl, downloadCv } from "../lib/cv";
import type { HeroData } from "../lib/types";

interface HeroSectionProps {
  hero: HeroData | null;
  loading: boolean;
}

const ORBIT_ICONS = ["javascript", "view_in_ar", "code", "deployed_code", "bolt", "rocket_launch"];

export function HeroSection({ hero, loading }: HeroSectionProps) {
  const techIcons = hero?.techStack
    ? hero.techStack.split(",").map((s) => s.trim()).slice(0, 12)
    : ["JavaScript", "React", "Three.js"];

  return (
    <section
      id="home"
      className="min-h-screen pt-32 px-margin-desktop flex flex-col md:flex-row items-center justify-between relative overflow-hidden max-w-[1440px] mx-auto"
    >
      {loading ? (
        <div className="w-full flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
        </div>
      ) : (
        <>
          {/* Left: text content */}
          <div className="w-full md:w-1/2 z-10 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary font-label-sm text-label-sm uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {hero?.tag ?? "Hello, It's Me"}
            </div>

            <h1 className="font-display-lg text-display-lg">
              I'm{" "}
              <span className="shimmer-text glow-text">{hero?.name ?? "Alex Morgan"}</span>
              <br />
              <span className="text-headline-xl font-headline-xl opacity-80">
                {hero?.role ?? "Full Stack Developer"}
              </span>
            </h1>

            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              {hero?.desc ?? "I create immersive digital experiences with modern technologies."}
            </p>

            {/* Tech stack icons */}
            <div className="flex gap-4 items-center">
              <div className="flex -space-x-3">
                {techIcons.map((ic, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-full border-2 border-background glass-card flex items-center justify-center floating"
                    style={{ animationDelay: `${i}s` }}
                    title={ic}
                  >
                    <Icon name={getTechIcon(ic)} className="text-primary" />
                  </div>
                ))}
              </div>
              <span className="text-on-surface-variant text-label-sm">Tech Stack</span>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              {[
                [hero?.years    ?? "3+",  "Years Exp."],
                [hero?.projects ?? "30+", "Projects"  ],
                [hero?.clients  ?? "20+", "Clients"   ],
              ].map(([n, l]) => (
                <div
                  key={l}
                  className="glass-card p-6 rounded-xl border border-white/5 flex flex-col items-center"
                >
                  <span className="text-headline-lg font-headline-lg text-primary">{n}</span>
                  <span className="text-label-sm text-on-surface-variant">{l}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex gap-4 pt-2">
              <a
                href={hero?.cvUrl ?? "#"}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold hover:scale-105 transition-all"
              >
                {hero?.cta1 ?? "Hire Me"}
              </a>
              <button
                type="button"
                onClick={() =>
                  downloadCv(
                    resolveCvUrl(hero?.cvUrl),
                    `${hero?.name ?? "resume"}.pdf`
                  )
                }
                className="px-8 py-4 rounded-xl border border-white/10 glass-card font-bold hover:bg-white/10 transition-all"
              >
                {hero?.cta2 ?? "Download CV"}
              </button>
            </div>
          </div>

          {/* Right: 3D scene */}
          <div className="w-full md:w-1/2 h-[600px] relative z-10 flex items-center justify-center scene-3d">
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="ring-3d ring-a" />
              <div className="ring-3d ring-b" />
              <div className="ring-3d ring-c" />

              <div className="orbit-3d">
                {ORBIT_ICONS.map((ic, i) => (
                  <div
                    key={ic}
                    className="orbit-item"
                    style={{ transform: `rotateY(${i * 30}deg) translateZ(220px)` }}
                  >
                    <div className="cube-3d">
                      <Icon name={ic} className="text-primary" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Avatar */}
              <div className="relative w-72 h-72 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center z-20">
                <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-primary" />
                <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-primary/30 via-transparent to-secondary-fixed/20 blur-2xl" />
                <img
                  alt={hero?.name ?? "Avatar"}
                  className="w-60 h-60 rounded-3xl object-cover relative z-10"
                  src={
                    hero?.avatar ??
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuDTV4dOlVZZQ6R1MeCj_bizBDfUqKVytS9-WED8VuXrLBKOcduycsryW53f1SehopltWRY8jGQqOojVFk0cL29D_-PmscGoE8N_bdFc3KGRaihHE_8DlQx2bnPZuGZ8bAUB-HGfUbTKg9n62VBAfPlTkFn2o647bWlNFvoHmrqQeC-XJS7_5n4G1PLy4IGmdpOV2-dX5Ao_4_f1Z270qpktAnCedLvZmpGHzoh7v83-I4RKxAgX7DBcLJGEnyHsHVIWbHvzCVmBWSfv"
                  }
                />
              </div>

              {/* Floating badges */}
              <div className="absolute top-1/4 left-1/4 glass-card p-4 rounded-2xl floating" style={{ animationDuration: "4s" }}>
                <Icon name="deployed_code" className="text-primary text-headline-md" />
              </div>
              <div className="absolute bottom-1/4 right-1/4 glass-card p-4 rounded-2xl floating" style={{ animationDuration: "5s" }}>
                <Icon name="token" className="text-secondary text-headline-md" />
              </div>
              <div className="absolute top-1/2 right-0 glass-card p-4 rounded-2xl floating" style={{ animationDuration: "7s" }}>
                <Icon name="rocket_launch" className="text-tertiary text-headline-md" />
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

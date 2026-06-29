import type { AboutData, HeroData } from "../lib/types";

interface AboutSectionProps {
  about: AboutData | null;
  heroName?: string;
}

export function AboutSection({ about, heroName }: AboutSectionProps) {
  return (
    <section id="about" className="py-stack-xl px-margin-desktop">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-20 items-center">
        {/* Image */}
        <div className="w-full md:w-1/2 relative">
          <div className="aspect-square rounded-3xl overflow-hidden glass-card p-1 relative">
            <img
              alt="About"
              className="w-full h-full object-cover rounded-[22px] opacity-60"
              src={
                about?.image ??
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDCBBu6aAzqIOEjOyaMYW7sjIp1xZIoCSqSwiWwIB9pFWvooquI87zmyDT2-GXoIMwl1xFv-8IVc17eKnOWivK51xf7KKcGaX3NLGqIJA"
              }
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent rounded-[22px]" />
          </div>
          <div className="absolute -bottom-8 -right-8 w-48 h-48 glass-card rounded-2xl p-6 flex flex-col justify-center items-center text-center">
            <span className="text-primary font-bold text-headline-xl">
              {about?.statValue ?? "30+"}
            </span>
            <span className="text-label-sm text-on-surface-variant font-medium">
              {about?.statLabel ?? "Projects Successfully Delivered"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="w-full md:w-1/2 space-y-6">
          <span className="text-primary font-label-sm text-label-sm tracking-widest uppercase">
            {about?.tag ?? "Get To Know Me"}
          </span>
          <h2 className="font-headline-xl text-headline-xl glow-text">
            {about?.title ?? "About Me"}
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            {about?.bio ?? "I'm a passionate Full Stack Developer & 3D Designer."}
          </p>
          {about?.longBio && (
            <p className="font-body-md text-body-md text-on-surface-variant/80">
              {about.longBio}
            </p>
          )}
          {about?.email && (
            <div className="flex flex-col gap-2 pt-2 text-body-md text-on-surface-variant">
              <span>📧 {about.email}</span>
              {about.phone    && <span>📞 {about.phone}</span>}
              {about.location && <span>📍 {about.location}</span>}
            </div>
          )}
          <div className="pt-4">
            <div className="font-headline-md text-headline-md text-primary italic font-serif">
              {heroName ?? "Alex Morgan"}
            </div>
            <div className="h-px w-24 bg-primary mt-2" />
          </div>
        </div>
      </div>
    </section>
  );
}

import { Icon } from "./Icon";
import type { FooterData, HeroData } from "../lib/types";

interface PageFooterProps {
  footer: FooterData | null;
  hero: HeroData | null;
  logoText: string;
}

export function PageFooter({ footer, hero, logoText }: PageFooterProps) {
  const copyrightName =
    footer?.copyrightName && footer.copyrightName !== "Alex Morgan"
      ? footer.copyrightName
      : (hero?.name ?? footer?.copyrightName ?? "Alex Morgan");

  return (
    <>
      <footer className="relative z-10 py-12 px-margin-desktop border-t border-white/5 max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="font-headline-md text-headline-md text-on-surface">{logoText}</div>

        <div className="text-on-surface-variant font-body-md text-center">
          © {footer?.copyrightYear ?? new Date().getFullYear()} {copyrightName}.{" "}
          {footer?.tagline ?? "Engineered with Precision."}
        </div>

        <div className="flex flex-col items-center gap-4">
          {footer?.showLinks !== false && (
            <div className="flex gap-6 flex-wrap justify-center">
              {(footer?.links?.length
                ? footer.links
                : [
                    { label: "Privacy Policy", url: "#" },
                    { label: "Terms of Service", url: "#" },
                    { label: "GitHub", url: "#" },
                    { label: "LinkedIn", url: "#" },
                  ]
              ).map((l) => (
                <a
                  key={l.label}
                  href={l.url}
                  className="text-on-surface-variant hover:text-primary transition-colors text-label-sm font-label-sm uppercase tracking-widest"
                >
                  {l.label}
                </a>
              ))}
            </div>
          )}

          {footer?.showSocial !== false && (footer?.socialLinks?.length ?? 0) > 0 && (
            <div className="flex gap-3">
              {footer!.socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                  className="w-9 h-9 rounded-full glass-card flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all duration-300"
                >
                  <Icon name={s.icon} className="text-[18px]" />
                </a>
              ))}
            </div>
          )}
        </div>
      </footer>

      {footer?.showBackToTop !== false && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-primary text-on-primary shadow-[0_0_30px_rgba(214,186,255,0.4)] flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-40"
        >
          <Icon name="arrow_upward" className="text-headline-lg" />
        </button>
      )}
    </>
  );
}

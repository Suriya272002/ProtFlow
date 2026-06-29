import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "./Icon";
import { NAV_LINKS } from "../lib/constants";
import { ROUTES } from "../../../lib/routes";

interface TopNavProps {
  logoText: string;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  activeSection: string;
  scrolled: boolean;
  hireMeLabel?: string;
  hireMeHref?: string;
}

export function TopNav({
  logoText,
  theme,
  onToggleTheme,
  activeSection,
  scrolled,
  hireMeLabel = "Hire Me",
  hireMeHref = "#",
}: TopNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: "1rem",
          left: 0,
          right: 0,
          marginLeft: "auto",
          marginRight: "auto",
          maxWidth: "1280px",
          width: "calc(100% - 2rem)",
          zIndex: 50,
        }}
        className={`rounded-full border border-white/10 backdrop-blur-3xl flex items-center justify-between gap-4 px-4 md:px-6 py-3 transition-all duration-300 ${
          scrolled
            ? "bg-black/60 shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
            : "bg-white/5 shadow-[0_0_20px_rgba(214,186,255,0.15)]"
        }`}
      >
        <div className="font-headline-md text-headline-md font-bold tracking-tighter text-on-surface shrink-0">
          {logoText}
        </div>

        <div className="hidden lg:flex items-center gap-6 xl:gap-8 min-w-0">
          {NAV_LINKS.map((n) => (
            <a
              key={n.href}
              href={`#${n.href}`}
              className={`font-medium transition-all duration-300 hover:scale-105 whitespace-nowrap ${
                activeSection === n.href
                  ? "text-primary font-bold"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              {n.label}
            </a>
          ))}
        </div>

        <div className="flex gap-2 md:gap-3 shrink-0 items-center">
          <button
            onClick={onToggleTheme}
            title="Toggle theme"
            className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-on-surface hover:bg-white/5 transition-all"
          >
            <Icon
              name={theme === "dark" ? "light_mode" : "dark_mode"}
              className="text-[18px]"
            />
          </button>
          <Link
            to={ROUTES.ADMIN}
            className="px-4 py-2 rounded-full border border-white/10 text-on-surface text-sm font-medium hover:bg-white/5 transition-all hidden sm:inline-block whitespace-nowrap"
          >
            Admin
          </Link>
          <a
            href={hireMeHref}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary text-sm font-bold shadow-[0_0_20px_rgba(214,186,255,0.3)] hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
          >
            {hireMeLabel}
          </a>
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="lg:hidden w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-on-surface hover:bg-white/5"
          >
            <Icon name={mobileOpen ? "close" : "menu"} className="text-[18px]" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div className="absolute top-20 left-4 right-4 glass-panel rounded-2xl border border-white/10 p-4 flex flex-col gap-1">
            {NAV_LINKS.map((n) => (
              <a
                key={n.href}
                href={`#${n.href}`}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  activeSection === n.href
                    ? "bg-primary/15 text-primary font-bold"
                    : "text-on-surface-variant hover:bg-white/5 hover:text-on-surface"
                }`}
              >
                {n.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
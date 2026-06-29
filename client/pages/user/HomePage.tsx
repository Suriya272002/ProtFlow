import { useEffect, useState } from "react";
import { SplashCursor } from "../../components/SplashCursor";
import { publicApi } from "../../lib/admin-api";

// Layout components
import { AnimatedBackground }     from "./components/AnimatedBackground";
import { TopNav }                  from "./components/TopNav";
import { SectionNavIcons }         from "./components/SectionNavIcons";
import { PageFooter }              from "./components/PageFooter";

// Section pages
import { HeroSection }                  from "./sections/HeroSection";
import { AboutSection }                 from "./sections/AboutSection";
import { SkillsSection }                from "./sections/SkillsSection";
import { ProjectsSection }              from "./sections/ProjectsSection";
import { EducationExperienceSection }   from "./sections/EducationExperienceSection";
import { ServicesSection }              from "./sections/ServicesSection";
import { ContactSection }               from "./sections/ContactSection";

// Hooks & utils
import {
  useTheme,
  useScrollReveal,
  useActiveSection,
  useScrolled,
} from "./hooks/usePortfolio";
import { applyAppearance } from "./lib/appearance";
import { SECTION_IDS }     from "./lib/constants";
import type { PortfolioData } from "./lib/types";

export function HomePage() {
  const { theme, toggle, setTheme } = useTheme();

  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading]     = useState(true);
  useScrollReveal(!loading);

  useEffect(() => {
    publicApi
      .getPortfolio()
      .then((d) => {
        const data = d as unknown as PortfolioData;
        setPortfolio(data);
        applyAppearance(data.appearance);
        if (data.appearance?.mode && data.appearance.mode !== "system") {
          setTheme(data.appearance.mode);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeSection = useActiveSection(SECTION_IDS);
  const scrolled      = useScrolled();

  const hero          = portfolio?.hero          ?? null;
  const about         = portfolio?.about         ?? null;
  const footer        = portfolio?.footer        ?? null;
  const customization = portfolio?.customization ?? null;
  const logoText      = customization?.logoText  ?? "PORTFOLIO.";

  return (
    <div className="font-body-md text-on-surface relative">
      <SplashCursor />
      <AnimatedBackground />

      <TopNav
        logoText={logoText}
        theme={theme}
        onToggleTheme={toggle}
        activeSection={activeSection}
        scrolled={scrolled}
        hireMeLabel={hero?.cta1}
        hireMeHref={hero?.cvUrl}
      />

      <main className="relative z-10">
        <HeroSection hero={hero} loading={loading} />
        <SectionNavIcons />
        <AboutSection about={about} heroName={hero?.name} />
        <SkillsSection skills={portfolio?.skills ?? []} />
        <ProjectsSection projects={portfolio?.projects ?? []} />
        <EducationExperienceSection
          education={portfolio?.education ?? []}
          experience={portfolio?.experience ?? []}
        />
        <ServicesSection services={portfolio?.services ?? []} />
        <ContactSection about={about} customization={customization} />
      </main>

      <PageFooter footer={footer} hero={hero} logoText={logoText} />
    </div>
  );
}
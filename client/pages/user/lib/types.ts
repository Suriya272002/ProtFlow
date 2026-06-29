/* ── Shared portfolio types ── */

export interface HeroData {
  tag: string; name: string; role: string; desc: string;
  years: string; projects: string; clients: string;
  avatar: string; cta1: string; cta2: string; cvUrl: string;
  techStack: string; accent: string;
}
export interface AboutData {
  title: string; tag: string; bio: string; longBio: string;
  location: string; email: string; phone: string;
  image: string; statValue: string; statLabel: string;
}
export interface EducationItem  { id: number; a: string; b: string; c: string; d: string; }
export interface ExperienceItem { id: number; a: string; b: string; c: string; d: string; }
export interface SkillItem      { id: number; name: string; level: number; category: string; icon: string; }
export interface ProjectItem    { id: number; title: string; tag: string; img: string; desc: string; live: string; repo: string; tech: string; featured: boolean; }
export interface ServiceItem    { id: number; icon: string; title: string; desc: string; price: string; }
export interface CustomizationData {
  logoText: string;
  tagline: string;
  socialLinks: { icon: string; label: string; url: string }[];
}
export interface FooterData {
  tagline: string;
  copyrightName: string;
  copyrightYear: string;
  links: { label: string; url: string }[];
  socialLinks: { icon: string; label: string; url: string }[];
  showSocial: boolean;
  showLinks: boolean;
  showBackToTop: boolean;
}
export interface AppearanceData {
  mode: "dark" | "light" | "system";
  palette: number;
  radius: number;
  density: string;
  bgAnim: string;
  animSpeed: number;
  animIntensity: number;
  parallax: boolean;
  reducedMotion: boolean;
  scrollReveal: boolean;
  hover3d: boolean;
}

export interface PortfolioData {
  hero: HeroData | null;
  about: AboutData | null;
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  services: ServiceItem[];
  customization: CustomizationData | null;
  appearance: AppearanceData | null;
  footer: FooterData | null;
}

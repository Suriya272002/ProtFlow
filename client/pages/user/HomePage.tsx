import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { SplashCursor } from "../../components/SplashCursor";
import { ROUTES } from "../../lib/routes";
import { publicApi } from "../../lib/admin-api";

/* ── Types matching the API response ── */
interface HeroData {
  tag: string; name: string; role: string; desc: string;
  years: string; projects: string; clients: string;
  avatar: string; cta1: string; cta2: string; cvUrl: string;
  techStack: string; accent: string;
}
interface AboutData {
  title: string; tag: string; bio: string; longBio: string;
  location: string; email: string; phone: string;
  image: string; statValue: string; statLabel: string;
}
interface EducationItem  { id: number; a: string; b: string; c: string; d: string; }
interface ExperienceItem { id: number; a: string; b: string; c: string; d: string; }
interface SkillItem      { id: number; name: string; level: number; category: string; icon: string; }
interface ProjectItem    { id: number; title: string; tag: string; img: string; desc: string; live: string; repo: string; tech: string; featured: boolean; }
interface ServiceItem    { id: number; icon: string; title: string; desc: string; price: string; }
interface CustomizationData { logoText: string; tagline: string; socialLinks: { icon: string; label: string; url: string }[]; }

interface PortfolioData {
  hero: HeroData | null;
  about: AboutData | null;
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  services: ServiceItem[];
  customization: CustomizationData | null;
}

/* ── Theme ── */
function getInitialTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  return (localStorage.getItem("theme") as "dark" | "light") || "dark";
}
function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">(getInitialTheme);
  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
  }, [theme]);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    setTheme(next);
  };
  return { theme, toggle };
}

/* ── Scroll reveal ── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ── Active section tracker ── */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

/* ── Scroll position tracker (for nav shadow) ── */
function useScrolled(threshold = 20) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [threshold]);
  return scrolled;
}

const Icon = ({ name, className = "" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

const NAV_LINKS = [
  { href: "home",      label: "Home"      },
  { href: "about",     label: "About"     },
  { href: "education", label: "Education" },
  { href: "skills",    label: "Skills"    },
  { href: "projects",  label: "Projects"  },
  { href: "contact",   label: "Contact"   },
];
const SECTION_IDS = NAV_LINKS.map((n) => n.href);

export function HomePage() {
  const { theme, toggle } = useTheme();
  useScrollReveal();

  /* ── API data ── */
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi
      .getPortfolio()
      .then((d) => setPortfolio(d as unknown as PortfolioData))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* ── Contact form ── */
  const [form, setForm] = useState({ name: "", email: "", subject: "", body: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const submitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.body) return;
    setSending(true);
    try {
      await publicApi.sendContact(form);
      setSent(true);
      setForm({ name: "", email: "", subject: "", body: "" });
    } catch {}
    setSending(false);
  };

  /* ── Nav ── */
  const activeSection = useActiveSection(SECTION_IDS);
  const scrolled = useScrolled();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sparkles = Array.from({ length: 18 }, (_, i) => ({
    top: `${(i * 53) % 100}%`,
    left: `${(i * 37) % 100}%`,
    delay: `${(i % 6) * 0.8}s`,
  }));

  /* ── Derived data with fallbacks ── */
  const hero = portfolio?.hero;
  const about = portfolio?.about;
  const education = portfolio?.education ?? [];
  const experience = portfolio?.experience ?? [];
  const skills = portfolio?.skills ?? [];
  const projects = portfolio?.projects ?? [];
  const services = portfolio?.services ?? [];
  const customization = portfolio?.customization;
  const logoText = customization?.logoText ?? "PORTFOLIO.";

  const techIcons = hero?.techStack
    ? hero.techStack.split(",").map((s) => s.trim()).slice(0, 6)
    : ["JavaScript", "React", "Three.js"];

  return (
    <div className="font-body-md text-on-surface relative">
      <SplashCursor />

      {/* Animated background */}
      <div className="animated-bg" aria-hidden="true">
        <div className="orb o1" /><div className="orb o2" /><div className="orb o3" /><div className="orb o4" />
        <div className="grid-overlay" />
        <div className="sparkles">
          {sparkles.map((s, i) => (
            <span key={i} style={{ top: s.top, left: s.left, animationDelay: s.delay }} />
          ))}
        </div>
      </div>

      {/* ── Top Nav ── */}
      <nav
        style={{ position: "fixed", top: "1rem", left: 0, right: 0, marginLeft: "auto", marginRight: "auto", maxWidth: "1280px", width: "calc(100% - 2rem)", zIndex: 50 }}
        className={`rounded-full border border-white/10 backdrop-blur-3xl flex items-center justify-between gap-4 px-4 md:px-6 py-3 transition-all duration-300 ${
          scrolled
            ? "bg-black/60 shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
            : "bg-white/5 shadow-[0_0_20px_rgba(214,186,255,0.15)]"
        }`}
      >
        {/* Logo */}
        <div className="font-headline-md text-headline-md font-bold tracking-tighter text-on-surface shrink-0">
          {logoText}
        </div>

        {/* Desktop links */}
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

        {/* Right controls */}
        <div className="flex gap-2 md:gap-3 shrink-0 items-center">
          <button
            onClick={toggle}
            title="Toggle theme"
            className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-on-surface hover:bg-white/5 transition-all"
          >
            <Icon name={theme === "dark" ? "light_mode" : "dark_mode"} className="text-[18px]" />
          </button>
          <Link
            to={ROUTES.ADMIN}
            className="px-4 py-2 rounded-full border border-white/10 text-on-surface text-sm font-medium hover:bg-white/5 transition-all hidden sm:inline-block whitespace-nowrap"
          >
            Admin
          </Link>
          <a
            href={hero?.cvUrl ?? "#"}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary text-sm font-bold shadow-[0_0_20px_rgba(214,186,255,0.3)] hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
          >
            {hero?.cta1 ?? "Hire Me"}
          </a>
          {/* Mobile hamburger */}
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

      <main className="relative z-10">
        {/* ── Hero ── */}
        <section id="home" className="min-h-screen pt-32 px-margin-desktop flex flex-col md:flex-row items-center justify-between relative overflow-hidden max-w-[1440px] mx-auto">
          {loading ? (
            <div className="w-full flex items-center justify-center min-h-[60vh]">
              <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
            </div>
          ) : (
            <>
              <div className="w-full md:w-1/2 z-10 space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary font-label-sm text-label-sm uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  {hero?.tag ?? "Hello, It's Me"}
                </div>
                <h1 className="font-display-lg text-display-lg">
                  I'm <span className="shimmer-text glow-text">{hero?.name ?? "Alex Morgan"}</span>
                  <br />
                  <span className="text-headline-xl font-headline-xl opacity-80">{hero?.role ?? "Full Stack Developer"}</span>
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                  {hero?.desc ?? "I create immersive digital experiences with modern technologies."}
                </p>
                <div className="flex gap-4 items-center">
                  <div className="flex -space-x-3">
                    {techIcons.slice(0, 3).map((ic, i) => (
                      <div key={i} className="w-12 h-12 rounded-full border-2 border-background glass-card flex items-center justify-center floating" style={{ animationDelay: `${i}s` }}>
                        <Icon name="code" className="text-primary" />
                      </div>
                    ))}
                  </div>
                  <span className="text-on-surface-variant text-label-sm">Tech Stack</span>
                </div>
                <div className="flex gap-6">
                  {[
                    [hero?.years ?? "3+", "Years Exp."],
                    [hero?.projects ?? "30+", "Projects"],
                    [hero?.clients ?? "20+", "Clients"],
                  ].map(([n, l]) => (
                    <div key={l} className="glass-card p-6 rounded-xl border border-white/5 flex flex-col items-center">
                      <span className="text-headline-lg font-headline-lg text-primary">{n}</span>
                      <span className="text-label-sm text-on-surface-variant">{l}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 pt-2">
                  <a href={hero?.cvUrl ?? "#"} className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold hover:scale-105 transition-all">
                    {hero?.cta1 ?? "Hire Me"}
                  </a>
                  <a href="#contact" className="px-8 py-4 rounded-xl border border-white/10 glass-card font-bold hover:bg-white/10 transition-all">
                    {hero?.cta2 ?? "Contact Me"}
                  </a>
                </div>
              </div>
              <div className="w-full md:w-1/2 h-[600px] relative z-10 flex items-center justify-center scene-3d">
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="ring-3d ring-a" /><div className="ring-3d ring-b" /><div className="ring-3d ring-c" />
                  <div className="orbit-3d">
                    {["javascript", "view_in_ar", "code", "deployed_code", "bolt", "rocket_launch"].map((ic, i) => (
                      <div key={ic} className="orbit-item" style={{ transform: `rotateY(${i * 60}deg) translateZ(220px)` }}>
                        <div className="cube-3d"><Icon name={ic} className="text-primary" /></div>
                      </div>
                    ))}
                  </div>
                  <div className="relative w-72 h-72 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center z-20">
                    <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-primary" />
                    <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-primary/30 via-transparent to-secondary-fixed/20 blur-2xl" />
                    <img alt={hero?.name ?? "Avatar"} className="w-60 h-60 rounded-3xl object-cover relative z-10"
                      src={hero?.avatar ?? "https://lh3.googleusercontent.com/aida-public/AB6AXuDTV4dOlVZZQ6R1MeCj_bizBDfUqKVytS9-WED8VuXrLBKOcduycsryW53f1SehopltWRY8jGQqOojVFk0cL29D_-PmscGoE8N_bdFc3KGRaihHE_8DlQx2bnPZuGZ8bAUB-HGfUbTKg9n62VBAfPlTkFn2o647bWlNFvoHmrqQeC-XJS7_5n4G1PLy4IGmdpOV2-dX5Ao_4_f1Z270qpktAnCedLvZmpGHzoh7v83-I4RKxAgX7DBcLJGEnyHsHVIWbHvzCVmBWSfv"} />
                  </div>
                  <div className="absolute top-1/4 left-1/4 glass-card p-4 rounded-2xl floating" style={{ animationDuration: "4s" }}><Icon name="deployed_code" className="text-primary text-headline-md" /></div>
                  <div className="absolute bottom-1/4 right-1/4 glass-card p-4 rounded-2xl floating" style={{ animationDuration: "5s" }}><Icon name="token" className="text-secondary text-headline-md" /></div>
                  <div className="absolute top-1/2 right-0 glass-card p-4 rounded-2xl floating" style={{ animationDuration: "7s" }}><Icon name="rocket_launch" className="text-tertiary text-headline-md" /></div>
                </div>
              </div>
            </>
          )}
        </section>

        {/* Section nav icons */}
        <div className="w-full flex justify-center py-12 gap-12 border-y border-white/5 bg-surface-container-lowest/50 flex-wrap">
          {[
            { href: "about",     icon: "person", label: "About"     },
            { href: "education", icon: "school", label: "Education" },
            { href: "skills",    icon: "bolt",   label: "Skills"    },
            { href: "projects",  icon: "work",   label: "Projects"  },
          ].map((n) => (
            <a key={n.label} href={`#${n.href}`} className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-12 h-12 rounded-xl glass-card flex items-center justify-center group-hover:scale-110 group-hover:text-primary transition-all">
                <Icon name={n.icon} />
              </div>
              <span className="text-label-sm font-label-sm uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">{n.label}</span>
            </a>
          ))}
        </div>

        {/* ── About ── */}
        <section id="about" className="py-stack-xl px-margin-desktop">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-20 items-center">
            <div className="w-full md:w-1/2 relative">
              <div className="aspect-square rounded-3xl overflow-hidden glass-card p-1 relative">
                <img alt="About" className="w-full h-full object-cover rounded-[22px] opacity-60"
                  src={about?.image ?? "https://lh3.googleusercontent.com/aida-public/AB6AXuDCBBu6aAzqIOEjOyaMYW7sjIp1xZIoCSqSwiWwIB9pFWvooquI87zmyDT2-GXoIMwl1xFv-8IVc17eKnOWivK51xf7KKcGaX3NLGqIJA"} />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent rounded-[22px]" />
              </div>
              <div className="absolute -bottom-8 -right-8 w-48 h-48 glass-card rounded-2xl p-6 flex flex-col justify-center items-center text-center">
                <span className="text-primary font-bold text-headline-xl">{about?.statValue ?? "30+"}</span>
                <span className="text-label-sm text-on-surface-variant font-medium">{about?.statLabel ?? "Projects Successfully Delivered"}</span>
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-6">
              <span className="text-primary font-label-sm text-label-sm tracking-widest uppercase">{about?.tag ?? "Get To Know Me"}</span>
              <h2 className="font-headline-xl text-headline-xl glow-text">{about?.title ?? "About Me"}</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">{about?.bio ?? "I'm a passionate Full Stack Developer & 3D Designer."}</p>
              <p className="font-body-md text-body-md text-on-surface-variant/80">{about?.longBio ?? ""}</p>
              {about?.email && (
                <div className="flex flex-col gap-2 pt-2 text-body-md text-on-surface-variant">
                  <span>📧 {about.email}</span>
                  {about.phone && <span>📞 {about.phone}</span>}
                  {about.location && <span>📍 {about.location}</span>}
                </div>
              )}
              <div className="pt-4">
                <div className="font-headline-md text-headline-md text-primary italic font-serif">{hero?.name ?? "Alex Morgan"}</div>
                <div className="h-px w-24 bg-primary mt-2" />
              </div>
            </div>
          </div>
        </section>

        {/* ── Skills ── */}
        <section id="skills" className="py-stack-xl bg-surface-container-low/30 px-margin-desktop">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <span className="text-primary font-label-sm text-label-sm tracking-widest uppercase">Expertise</span>
              <h2 className="font-headline-xl text-headline-xl glow-text">Technical Skills</h2>
            </div>
            {skills.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {skills.map((s, i) => {
                  const colors = ["primary", "secondary", "tertiary", "primary-container"];
                  const color = colors[i % colors.length];
                  return (
                    <div key={s.id} className="glass-card p-8 rounded-2xl space-y-4 border border-white/5 hover:translate-y-[-8px] transition-all duration-300 group reveal tilt-card">
                      <div className={`w-14 h-14 rounded-xl bg-${color}/10 flex items-center justify-center text-${color} group-hover:scale-110 transition-transform`}>
                        <Icon name={s.icon} className="text-headline-lg" />
                      </div>
                      <h3 className="font-headline-md text-headline-md">{s.name}</h3>
                      <p className="text-body-md text-on-surface-variant">{s.category}</p>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full bg-${color}`} style={{ width: `${s.level}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: "code",           title: "Frontend",  desc: "React, Next.js, Tailwind CSS",   color: "primary",           w: "95%" },
                  { icon: "database",        title: "Backend",   desc: "Node.js, Express, PostgreSQL",   color: "secondary",         w: "85%" },
                  { icon: "view_in_ar",      title: "3D Design", desc: "Three.js, Blender, WebGL",       color: "tertiary",          w: "75%" },
                  { icon: "design_services", title: "UI / UX",   desc: "Figma, Prototyping",             color: "primary-container", w: "90%" },
                ].map((s) => (
                  <div key={s.title} className="glass-card p-8 rounded-2xl space-y-4 border border-white/5 hover:translate-y-[-8px] transition-all duration-300 group reveal tilt-card">
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

        {/* ── Projects ── */}
        <section id="projects" className="py-stack-xl px-margin-desktop">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div className="space-y-4">
                <span className="text-primary font-label-sm text-label-sm tracking-widest uppercase">Portfolio</span>
                <h2 className="font-headline-xl text-headline-xl glow-text">Featured Projects</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(projects.length > 0 ? projects : [
                { id: 1, title: "Neural Network Viz", tag: "Three.js", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuArqctNa1Hi8EAk5zwyy2-OA_zIft0kgVR_FrmxRE-l6wHiB5pIhmxWa1Glxk8XOGGX1ODfg5FcSbIXAfxst5lXD6yZl7fgFMZMFvueAnKJiBqF8trGTFrqT_aP_aT01SjaOvqDFfp4jNRwDcQfboJBf8MKFH4rB1cqaDfR1qGm11IrstH9P3TnDN-ICofjwvsBJUMMvFNevjckvdmfTm--P_fQIe1TBIK-GD3xJ8d-xaQ8jvuZoCGIt_KcFd7P-etPFB8pw2tXLVay", desc: "An interactive 3D visualization tool for complex neural network architectures.", live: "#", repo: "#", tech: "React, D3, Three.js", featured: true },
                { id: 2, title: "Crypto Pulse", tag: "React Native", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkjPmMBJQGpmrucuM8dRjBNAxrzKwIqInqz3mh-Gsd9MbhtoVad28zrk4v1172zQ8RnLLTZ2tJBxqrvHUkVRaMCfJ1KEMtnW4QPs_xcexmzezVPbwW9BaXeyUWeqeZIDOVnvk0CH9mxdEqxKF1b20fy9RnfZ_gPk0xceIHJ4wfysW2Q35WOPTidkR0yCgQ8LBHZWhSrKK00j3lNOMxaa7vM49js7RJU-_B9EuRPMtcenYCycCW7gXM-HbZeWJ6KTZhyv0opyDKMDLT", desc: "Real-time cryptocurrency tracking with personalized alerts.", live: "#", repo: "#", tech: "React Native, Redux", featured: true },
                { id: 3, title: "Luxe Furniture", tag: "Next.js", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDP3a_JCKLJm1NhMCem4ci7SEyuDf5aovgIjrwRzAm6z3HXWl95ZUhgZUESP2gh0vsNlPwqfGXnNtcxXWnhIYSiXLvLF3XTR9aZ7YBNj2tU8QjhQKcn26ei-UQLd3ZOqop9-QfBeFCxZbVGyeStzGiKS4a3DXFHoTz9iT5u7dhpcM6-ZqIYllnVYjONSmWG2dcgvl7w76_MXkijjm2Qun5XB-0vySqbFc4zBycAWDa9-4ga1dquqD3kVCKgr_iuTcaxlCTwXBhKgmeH", desc: "High-performance e-commerce platform with 3D product previews.", live: "#", repo: "#", tech: "Next.js, Three.js", featured: false },
              ] as ProjectItem[]).map((p, i) => {
                const tagColors = ["primary", "secondary", "tertiary"];
                const tc = tagColors[i % tagColors.length];
                return (
                  <div key={p.id} className="group relative rounded-3xl overflow-hidden glass-card border border-white/5 hover:border-primary/40 transition-all duration-500 tilt-card reveal">
                    <div className="aspect-video w-full overflow-hidden relative">
                      <img alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={p.img} />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        {p.live && <a href={p.live} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center"><Icon name="link" /></a>}
                        {p.repo && <a href={p.repo} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl text-white flex items-center justify-center"><Icon name="code" /></a>}
                      </div>
                    </div>
                    <div className="p-8 space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-headline-md text-headline-md group-hover:text-primary transition-colors">{p.title}</h3>
                        <span className={`px-3 py-1 rounded-full bg-${tc}/10 text-${tc} text-label-sm`}>{p.tag}</span>
                      </div>
                      <p className="text-on-surface-variant text-body-md line-clamp-2">{p.desc}</p>
                      <p className="text-label-sm text-on-surface-variant/50">{p.tech}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Education & Experience ── */}
        <section id="education" className="py-stack-xl px-margin-desktop bg-surface-container-lowest/80 relative">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-10">
            <div className="space-y-12">
              <div className="space-y-4">
                <span className="text-primary font-label-sm text-label-sm tracking-widest uppercase">Qualifications</span>
                <h2 className="font-headline-xl text-headline-xl glow-text">Education</h2>
              </div>
              <div className="space-y-8 border-l-2 border-white/10 ml-4 pl-12 relative">
                {(education.length > 0 ? education : [
                  { id: 0, a: "B.Sc Computer Science", b: "Stanford University", c: "2018 - 2022", d: "Focused on software engineering and computer graphics." },
                ] as EducationItem[]).map((e) => (
                  <div key={e.id} className="relative group">
                    <div className="absolute -left-[61px] top-0 w-6 h-6 rounded-full bg-background border-4 border-primary group-hover:scale-125 transition-transform" />
                    <span className="text-label-sm font-label-sm text-primary uppercase">{e.c}</span>
                    <h3 className="font-headline-md text-headline-md mt-2">{e.a}</h3>
                    <p className="text-on-surface-variant font-medium">{e.b}</p>
                    {e.d && <p className="text-body-md text-on-surface-variant/70 mt-3">{e.d}</p>}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-12">
              <div className="space-y-4">
                <span className="text-secondary font-label-sm text-label-sm tracking-widest uppercase">Professional Journey</span>
                <h2 className="font-headline-xl text-headline-xl glow-text">Experience</h2>
              </div>
              <div className="space-y-8 border-l-2 border-white/10 ml-4 pl-12 relative">
                {(experience.length > 0 ? experience : [
                  { id: 0, a: "Senior 3D Developer", b: "TechnoVerse Solutions", c: "2023 - Present", d: "Leading frontend team in building high-fidelity 3D dashboards." },
                ] as ExperienceItem[]).map((e) => (
                  <div key={e.id} className="relative group">
                    <div className="absolute -left-[61px] top-0 w-6 h-6 rounded-full bg-background border-4 border-secondary group-hover:scale-125 transition-transform" />
                    <span className="text-label-sm font-label-sm text-secondary uppercase">{e.c}</span>
                    <h3 className="font-headline-md text-headline-md mt-2">{e.a}</h3>
                    <p className="text-on-surface-variant font-medium">{e.b}</p>
                    {e.d && <p className="text-body-md text-on-surface-variant/70 mt-3">{e.d}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Services ── */}
        {services.length > 0 && (
          <section id="services" className="py-stack-xl px-margin-desktop">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <span className="text-primary font-label-sm text-label-sm tracking-widest uppercase">What I Offer</span>
                <h2 className="font-headline-xl text-headline-xl glow-text">Services</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((s) => (
                  <div key={s.id} className="glass-card p-8 rounded-2xl space-y-4 border border-white/5 hover:border-primary/30 hover:translate-y-[-6px] transition-all duration-300 reveal">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Icon name={s.icon} className="text-headline-lg" />
                    </div>
                    <h3 className="font-headline-md text-headline-md">{s.title}</h3>
                    <p className="text-body-md text-on-surface-variant">{s.desc}</p>
                    <p className="text-primary font-bold">{s.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Contact ── */}
        <section id="contact" className="py-stack-xl px-margin-desktop bg-surface">
          <div className="max-w-5xl mx-auto glass-card rounded-[40px] p-12 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-secondary/20 rounded-full blur-[120px]" />
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="space-y-8">
                <div className="space-y-4">
                  <span className="text-primary font-label-sm text-label-sm tracking-widest uppercase">Contact</span>
                  <h2 className="font-headline-xl text-headline-xl glow-text">Let's Work Together</h2>
                </div>
                <p className="text-on-surface-variant text-body-lg">Have a vision for a project? I'm currently available for freelance work and collaborations.</p>
                <div className="space-y-6">
                  {about?.email && (
                    <div className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-xl glass-card flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><Icon name="mail" /></div>
                      <div><p className="text-label-sm text-on-surface-variant/60 uppercase">Email Me</p><p className="text-body-lg font-medium">{about.email}</p></div>
                    </div>
                  )}
                  {about?.phone && (
                    <div className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-xl glass-card flex items-center justify-center text-secondary group-hover:scale-110 transition-transform"><Icon name="call" /></div>
                      <div><p className="text-label-sm text-on-surface-variant/60 uppercase">Call Me</p><p className="text-body-lg font-medium">{about.phone}</p></div>
                    </div>
                  )}
                </div>
                {customization?.socialLinks && customization.socialLinks.length > 0 && (
                  <div className="flex gap-4 pt-6">
                    {customization.socialLinks.map((s) => (
                      <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" title={s.label}
                        className="w-12 h-12 rounded-full glass-card flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all duration-300">
                        <Icon name={s.icon} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <form className="space-y-4" onSubmit={submitContact}>
                {sent && (
                  <div className="px-4 py-3 rounded-xl bg-primary/15 text-primary text-sm font-medium">
                    ✓ Message sent! I'll get back to you soon.
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-label-sm font-label-sm uppercase opacity-60 ml-2 block">Name</label>
                    <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full bg-background/50 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-primary transition-colors text-body-md" placeholder="John Doe" type="text" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-label-sm font-label-sm uppercase opacity-60 ml-2 block">Email</label>
                    <input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className="w-full bg-background/50 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-primary transition-colors text-body-md" placeholder="john@example.com" type="email" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-label-sm font-label-sm uppercase opacity-60 ml-2 block">Subject</label>
                  <input value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                    className="w-full bg-background/50 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-primary transition-colors text-body-md" placeholder="Project Inquiry" type="text" />
                </div>
                <div className="space-y-2">
                  <label className="text-label-sm font-label-sm uppercase opacity-60 ml-2 block">Message</label>
                  <textarea value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                    className="w-full bg-background/50 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-primary transition-colors text-body-md resize-none" placeholder="How can I help you?" rows={4} />
                </div>
                <button type="submit" disabled={sending}
                  className="w-full py-5 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold shadow-[0_0_20px_rgba(214,186,255,0.3)] hover:scale-[1.02] active:scale-95 transition-all text-body-lg disabled:opacity-60 disabled:scale-100">
                  {sending ? "Sending…" : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 px-margin-desktop border-t border-white/5 max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="font-headline-md text-headline-md text-on-surface">{logoText}</div>
        <div className="text-on-surface-variant font-body-md text-center">© 2024 {hero?.name ?? "Alex Morgan"}. Engineered with Precision.</div>
        <div className="flex gap-8 flex-wrap justify-center">
          {["Privacy Policy", "Terms of Service", "Github", "LinkedIn"].map((l) => (
            <a key={l} href="#" className="text-on-surface-variant hover:text-primary transition-colors text-label-sm font-label-sm uppercase tracking-widest">{l}</a>
          ))}
        </div>
      </footer>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-primary text-on-primary shadow-[0_0_30px_rgba(214,186,255,0.4)] flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-40 group"
      >
        <Icon name="arrow_upward" className="text-headline-lg" />
      </button>
    </div>
  );
}

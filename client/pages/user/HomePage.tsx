import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { SplashCursor } from "../../components/SplashCursor";
import { ROUTES } from "../../lib/routes";

function getInitialTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  return (localStorage.getItem("theme") as "dark" | "light") || "dark";
}

function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">(getInitialTheme);

  // Sync the <html> class whenever theme changes (covers initial + toggle)
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

const Icon = ({ name, className = "" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

export function HomePage() {
  const { theme, toggle } = useTheme();
  useScrollReveal();
  const sparkleRef = useRef<HTMLDivElement>(null);
  const sparkles = Array.from({ length: 18 }, (_, i) => ({
    top: `${(i * 53) % 100}%`,
    left: `${(i * 37) % 100}%`,
    delay: `${(i % 6) * 0.8}s`,
  }));
  return (
    <div className="font-body-md text-on-surface relative">
      <SplashCursor />
      {/* Animated background */}
      <div className="animated-bg" aria-hidden="true">
        <div className="orb o1" />
        <div className="orb o2" />
        <div className="orb o3" />
        <div className="orb o4" />
        <div className="grid-overlay" />
        <div className="sparkles" ref={sparkleRef}>
          {sparkles.map((s, i) => (
            <span key={i} style={{ top: s.top, left: s.left, animationDelay: s.delay }} />
          ))}
        </div>
      </div>
      {/* Top Nav */}
      <nav style={{ position: "fixed", top: "1rem", left: 0, right: 0, marginLeft: "auto", marginRight: "auto", maxWidth: "1280px", width: "calc(100% - 2rem)", zIndex: 50 }} className="rounded-full border border-white/10 bg-white/5 backdrop-blur-3xl shadow-[0_0_20px_rgba(214,186,255,0.15)] flex items-center justify-between gap-4 px-4 md:px-6 py-3">
        <div className="font-headline-md text-headline-md font-bold tracking-tighter text-on-surface shrink-0">PORTFOLIO.</div>
        <div className="hidden lg:flex items-center gap-6 xl:gap-8 min-w-0">
          <a className="text-primary font-bold transition-all duration-300 hover:scale-105 whitespace-nowrap" href="#home">Home</a>
          <a className="text-on-surface-variant font-medium hover:text-primary transition-all duration-300 hover:scale-105 whitespace-nowrap" href="#about">About</a>
          <a className="text-on-surface-variant font-medium hover:text-primary transition-all duration-300 hover:scale-105 whitespace-nowrap" href="#education">Education</a>
          <a className="text-on-surface-variant font-medium hover:text-primary transition-all duration-300 hover:scale-105 whitespace-nowrap" href="#skills">Skills</a>
          <a className="text-on-surface-variant font-medium hover:text-primary transition-all duration-300 hover:scale-105 whitespace-nowrap" href="#projects">Projects</a>
          <a className="text-on-surface-variant font-medium hover:text-primary transition-all duration-300 hover:scale-105 whitespace-nowrap" href="#contact">Contact</a>
        </div>
        <div className="flex gap-2 md:gap-3 shrink-0 items-center">
          <button onClick={toggle} title="Toggle theme" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-on-surface hover:bg-white/5 transition-all">
            <Icon name={theme === "dark" ? "light_mode" : "dark_mode"} className="text-[18px]" />
          </button>
          <Link to={ROUTES.ADMIN} className="px-4 py-2 rounded-full border border-white/10 text-on-surface text-sm font-medium hover:bg-white/5 transition-all hidden sm:inline-block whitespace-nowrap">Admin</Link>
          <button className="px-5 py-2 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary text-sm font-bold shadow-[0_0_20px_rgba(214,186,255,0.3)] hover:scale-105 active:scale-95 transition-all whitespace-nowrap">Hire Me</button>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero */}
        <section id="home" className="min-h-screen pt-32 px-margin-desktop flex flex-col md:flex-row items-center justify-between relative overflow-hidden max-w-[1440px] mx-auto">
          <div className="w-full md:w-1/2 z-10 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary font-label-sm text-label-sm uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Hello, It's Me
            </div>
            <h1 className="font-display-lg text-display-lg">
              I'm <span className="shimmer-text glow-text">Alex Morgan</span>
              <br />
              <span className="text-headline-xl font-headline-xl opacity-80">Full Stack Developer & 3D Designer</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              I create immersive digital experiences with modern technologies and beautiful 3D animations. Specializing in the intersection of code and visual art.
            </p>
            <div className="flex gap-4 items-center">
              <div className="flex -space-x-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-background glass-card flex items-center justify-center floating" style={{ animationDelay: `${i}s` }}>
                    <Icon name={["code", "view_in_ar", "javascript"][i]} className="text-primary" />
                  </div>
                ))}
              </div>
              <span className="text-on-surface-variant text-label-sm">Tech Stack</span>
            </div>
            <div className="flex gap-6">
              {[["3+", "Years Exp."], ["30+", "Projects"], ["20+", "Clients"]].map(([n, l]) => (
                <div key={l} className="glass-card p-6 rounded-xl border border-white/5 flex flex-col items-center">
                  <span className="text-headline-lg font-headline-lg text-primary">{n}</span>
                  <span className="text-label-sm text-on-surface-variant">{l}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-1/2 h-[600px] relative z-10 flex items-center justify-center scene-3d">
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="ring-3d ring-a"></div>
              <div className="ring-3d ring-b"></div>
              <div className="ring-3d ring-c"></div>
              <div className="orbit-3d">
                {["javascript", "view_in_ar", "code", "deployed_code", "bolt", "rocket_launch"].map((ic, i) => (
                  <div key={ic} className="orbit-item" style={{ transform: `rotateY(${i * 60}deg) translateZ(220px)` }}>
                    <div className="cube-3d">
                      <Icon name={ic} className="text-primary" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="relative w-72 h-72 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center z-20">
                <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-primary"></div>
                <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-primary/30 via-transparent to-secondary-fixed/20 blur-2xl"></div>
                <img alt="Alex Morgan Avatar" className="w-60 h-60 rounded-3xl object-cover relative z-10" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTV4dOlVZZQ6R1MeCj_bizBDfUqKVytS9-WED8VuXrLBKOcduycsryW53f1SehopltWRY8jGQqOojVFk0cL29D_-PmscGoE8N_bdFc3KGRaihHE_8DlQx2bnPZuGZ8bAUB-HGfUbTKg9n62VBAfPlTkFn2o647bWlNFvoHmrqQeC-XJS7_5n4G1PLy4IGmdpOV2-dX5Ao_4_f1Z270qpktAnCedLvZmpGHzoh7v83-I4RKxAgX7DBcLJGEnyHsHVIWbHvzCVmBWSfv" />
              </div>
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
        </section>

        {/* Nav icons */}
        <div className="w-full flex justify-center py-12 gap-12 border-y border-white/5 bg-surface-container-lowest/50 flex-wrap">
          {[
            { href: "#about", icon: "person", label: "About" },
            { href: "#education", icon: "school", label: "Education" },
            { href: "#skills", icon: "bolt", label: "Skills" },
            { href: "#projects", icon: "work", label: "Projects" },
          ].map((n) => (
            <a key={n.label} href={n.href} className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-12 h-12 rounded-xl glass-card flex items-center justify-center group-hover:scale-110 group-hover:text-primary transition-all">
                <Icon name={n.icon} />
              </div>
              <span className="text-label-sm font-label-sm uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">{n.label}</span>
            </a>
          ))}
        </div>

        {/* About */}
        <section id="about" className="py-stack-xl px-margin-desktop">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-20 items-center">
            <div className="w-full md:w-1/2 relative">
              <div className="aspect-square rounded-3xl overflow-hidden glass-card p-1 relative">
                <img alt="Coding Environment" className="w-full h-full object-cover rounded-[22px] opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCBBu6aAzqIOEjOyaMYW7sjIp1xZIoCSqSwiWwIB9pFWvooquI87zmyDT2-GXoIMwl1xFv-8IVc17eKnOWivK51xf7KKcGaX3NLGqIJA-PWcJAnKVIYxaX3TXAqjj15FQ6xoJH5Yc0k-0dXXPi5Fg1LhMIjTg4E69jCmAZr4T3BpVA2Khd6Uf_gqKNpmO68pzcT6zR2hlbUwQ4RmOn-vw8TFeXUXMZV5fuLRSdqew5QY3rR5483sodLD5nxd9F1V0q3dPEvLwvl0Ow" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent rounded-[22px]"></div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-48 h-48 glass-card rounded-2xl p-6 flex flex-col justify-center items-center text-center">
                <span className="text-primary font-bold text-headline-xl">30+</span>
                <span className="text-label-sm text-on-surface-variant font-medium">Projects Successfully Delivered</span>
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-6">
              <span className="text-primary font-label-sm text-label-sm tracking-widest uppercase">Get To Know Me</span>
              <h2 className="font-headline-xl text-headline-xl glow-text">About Me</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                I'm a passionate Full Stack Developer & 3D Designer who loves building interactive, modern and beautiful web experiences. I specialize in React, Next.js, Three.js and Node.js.
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant/80">
                My journey began with a curiosity for how things work on the internet, which quickly evolved into a fascination with 3D graphics and spatial computing. Today, I bridge the gap between technical efficiency and artistic expression.
              </p>
              <div className="pt-4">
                <div className="font-headline-md text-headline-md text-primary italic font-serif">Alex Morgan</div>
                <div className="h-px w-24 bg-primary mt-2"></div>
              </div>
              <button className="mt-8 px-10 py-4 rounded-xl border border-white/10 glass-card font-bold text-on-surface hover:bg-white/10 transition-all flex items-center gap-2">
                Read More <Icon name="arrow_forward" />
              </button>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="py-stack-xl bg-surface-container-low/30 px-margin-desktop">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <span className="text-primary font-label-sm text-label-sm tracking-widest uppercase">Expertise</span>
              <h2 className="font-headline-xl text-headline-xl glow-text">Technical Skills</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: "code", title: "Frontend", desc: "React, Next.js, Tailwind CSS, TypeScript", color: "primary", w: "95%" },
                { icon: "database", title: "Backend", desc: "Node.js, Express, MongoDB, PostgreSQL", color: "secondary", w: "85%" },
                { icon: "view_in_ar", title: "3D Design", desc: "Three.js, Blender, Spline, WebGL", color: "tertiary", w: "75%" },
                { icon: "design_services", title: "UI / UX", desc: "Figma, Adobe Creative Suite, Prototyping", color: "primary-container", w: "90%" },
              ].map((s) => (
                <div key={s.title} className="glass-card p-8 rounded-2xl space-y-4 border border-white/5 hover:translate-y-[-8px] transition-all duration-300 group reveal tilt-card">
                  <div className={`w-14 h-14 rounded-xl bg-${s.color}/10 flex items-center justify-center text-${s.color} group-hover:scale-110 transition-transform`}>
                    <Icon name={s.icon} className="text-headline-lg" />
                  </div>
                  <h3 className="font-headline-md text-headline-md">{s.title}</h3>
                  <p className="text-body-md text-on-surface-variant">{s.desc}</p>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full bg-${s.color}`} style={{ width: s.w }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="py-stack-xl px-margin-desktop">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div className="space-y-4">
                <span className="text-primary font-label-sm text-label-sm tracking-widest uppercase">Portfolio</span>
                <h2 className="font-headline-xl text-headline-xl glow-text">Featured Projects</h2>
              </div>
              <button className="px-8 py-3 rounded-xl border border-white/10 glass-card font-bold hover:bg-primary hover:text-on-primary transition-all">View All Work</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "Neural Network Viz", tag: "Three.js", tagColor: "primary", desc: "An interactive 3D visualization tool for complex neural network architectures using WebGL and D3.js.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuArqctNa1Hi8EAk5zwyy2-OA_zIft0kgVR_FrmxRE-l6wHiB5pIhmxWa1Glxk8XOGGX1ODfg5FcSbIXAfxst5lXD6yZl7fgFMZMFvueAnKJiBqF8trGTFrqT_aP_aT01SjaOvqDFfp4jNRwDcQfboJBf8MKFH4rB1cqaDfR1qGm11IrstH9P3TnDN-ICofjwvsBJUMMvFNevjckvdmfTm--P_fQIe1TBIK-GD3xJ8d-xaQ8jvuZoCGIt_KcFd7P-etPFB8pw2tXLVay" },
                { title: "Crypto Pulse", tag: "React Native", tagColor: "secondary", desc: "Real-time cryptocurrency tracking app with personalized alerts and deep market analysis tools.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkjPmMBJQGpmrucuM8dRjBNAxrzKwIqInqz3mh-Gsd9MbhtoVad28zrk4v1172zQ8RnLLTZ2tJBxqrvHUkVRaMCfJ1KEMtnW4QPs_xcexmzezVPbwW9BaXeyUWeqeZIDOVnvk0CH9mxdEqxKF1b20fy9RnfZ_gPk0xceIHJ4wfysW2Q35WOPTidkR0yCgQ8LBHZWhSrKK00j3lNOMxaa7vM49js7RJU-_B9EuRPMtcenYCycCW7gXM-HbZeWJ6KTZhyv0opyDKMDLT" },
                { title: "Luxe Furniture", tag: "Next.js", tagColor: "tertiary", desc: "A high-performance e-commerce platform for luxury furniture with integrated 3D product previews.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDP3a_JCKLJm1NhMCem4ci7SEyuDf5aovgIjrwRzAm6z3HXWl95ZUhgZUESP2gh0vsNlPwqfGXnNtcxXWnhIYSiXLvLF3XTR9aZ7YBNj2tU8QjhQKcn26ei-UQLd3ZOqop9-QfBeFCxZbVGyeStzGiKS4a3DXFHoTz9iT5u7dhpcM6-ZqIYllnVYjONSmWG2dcgvl7w76_MXkijjm2Qun5XB-0vySqbFc4zBycAWDa9-4ga1dquqD3kVCKgr_iuTcaxlCTwXBhKgmeH" },
              ].map((p) => (
                <div key={p.title} className="group relative rounded-3xl overflow-hidden glass-card border border-white/5 hover:border-primary/40 transition-all duration-500 tilt-card reveal">
                  <div className="aspect-video w-full overflow-hidden relative">
                    <img alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={p.img} />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <button className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center"><Icon name="link" /></button>
                      <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl text-white flex items-center justify-center"><Icon name="code" /></button>
                    </div>
                  </div>
                  <div className="p-8 space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-headline-md text-headline-md group-hover:text-primary transition-colors">{p.title}</h3>
                      <span className={`px-3 py-1 rounded-full bg-${p.tagColor}/10 text-${p.tagColor} text-label-sm`}>{p.tag}</span>
                    </div>
                    <p className="text-on-surface-variant text-body-md line-clamp-2">{p.desc}</p>
                    <div className="flex gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      <span className="w-2 h-2 rounded-full bg-secondary"></span>
                      <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Education / Experience */}
        <section id="education" className="py-stack-xl px-margin-desktop bg-surface-container-lowest/80 relative">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-10">
            <div className="space-y-12">
              <div className="space-y-4">
                <span className="text-primary font-label-sm text-label-sm tracking-widest uppercase">Qualifications</span>
                <h2 className="font-headline-xl text-headline-xl glow-text">Education</h2>
              </div>
              <div className="space-y-8 border-l-2 border-white/10 ml-4 pl-12 relative">
                {[
                  { year: "2018 - 2022", title: "B.Sc Computer Science", org: "Stanford University", desc: "Focused on software engineering, computer graphics, and distributed systems. Graduated with honors." },
                  { year: "2022 - 2023", title: "Specialization in WebGL", org: "Online Academy of Digital Arts", desc: "Advanced courses in Three.js, shaders, and immersive web experiences." },
                ].map((e) => (
                  <div key={e.title} className="relative group">
                    <div className="absolute -left-[61px] top-0 w-6 h-6 rounded-full bg-background border-4 border-primary group-hover:scale-125 transition-transform"></div>
                    <span className="text-label-sm font-label-sm text-primary uppercase">{e.year}</span>
                    <h3 className="font-headline-md text-headline-md mt-2">{e.title}</h3>
                    <p className="text-on-surface-variant font-medium">{e.org}</p>
                    <p className="text-body-md text-on-surface-variant/70 mt-3">{e.desc}</p>
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
                {[
                  { year: "2023 - Present", title: "Senior 3D Developer", org: "TechnoVerse Solutions", desc: "Leading the frontend team in building high-fidelity 3D dashboards and interactive marketing platforms." },
                  { year: "2021 - 2023", title: "Full Stack Developer", org: "Digital Edge Agency", desc: "Developed and maintained over 15 client websites using the MERN stack with a focus on UI polish." },
                ].map((e) => (
                  <div key={e.title} className="relative group">
                    <div className="absolute -left-[61px] top-0 w-6 h-6 rounded-full bg-background border-4 border-secondary group-hover:scale-125 transition-transform"></div>
                    <span className="text-label-sm font-label-sm text-secondary uppercase">{e.year}</span>
                    <h3 className="font-headline-md text-headline-md mt-2">{e.title}</h3>
                    <p className="text-on-surface-variant font-medium">{e.org}</p>
                    <p className="text-body-md text-on-surface-variant/70 mt-3">{e.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-stack-xl px-margin-desktop bg-surface">
          <div className="max-w-5xl mx-auto glass-card rounded-[40px] p-12 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-secondary/20 rounded-full blur-[120px]"></div>
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="space-y-8">
                <div className="space-y-4">
                  <span className="text-primary font-label-sm text-label-sm tracking-widest uppercase">Contact</span>
                  <h2 className="font-headline-xl text-headline-xl glow-text">Let's Work Together</h2>
                </div>
                <p className="text-on-surface-variant text-body-lg">Have a vision for a project? I'm currently available for freelance work and collaborations.</p>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-xl glass-card flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Icon name="mail" />
                    </div>
                    <div>
                      <p className="text-label-sm text-on-surface-variant/60 uppercase">Email Me</p>
                      <p className="text-body-lg font-medium">alex@morgan.dev</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-xl glass-card flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                      <Icon name="call" />
                    </div>
                    <div>
                      <p className="text-label-sm text-on-surface-variant/60 uppercase">Call Me</p>
                      <p className="text-body-lg font-medium">+1 (555) 000-0000</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 pt-6">
                  {["public", "work", "share"].map((i) => (
                    <a key={i} href="#" className="w-12 h-12 rounded-full glass-card flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all duration-300">
                      <Icon name={i} />
                    </a>
                  ))}
                </div>
              </div>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-label-sm font-label-sm uppercase opacity-60 ml-2 block">Name</label>
                    <input className="w-full bg-background/50 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-primary transition-colors text-body-md" placeholder="John Doe" type="text" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-label-sm font-label-sm uppercase opacity-60 ml-2 block">Email</label>
                    <input className="w-full bg-background/50 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-primary transition-colors text-body-md" placeholder="john@example.com" type="email" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-label-sm font-label-sm uppercase opacity-60 ml-2 block">Subject</label>
                  <input className="w-full bg-background/50 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-primary transition-colors text-body-md" placeholder="Project Inquiry" type="text" />
                </div>
                <div className="space-y-2">
                  <label className="text-label-sm font-label-sm uppercase opacity-60 ml-2 block">Message</label>
                  <textarea className="w-full bg-background/50 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-primary transition-colors text-body-md resize-none" placeholder="How can I help you?" rows={4}></textarea>
                </div>
                <button className="w-full py-5 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold shadow-[0_0_20px_rgba(214,186,255,0.3)] hover:scale-[1.02] active:scale-95 transition-all text-body-lg" type="submit">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-margin-desktop border-t border-white/5 max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="font-headline-md text-headline-md text-on-surface">PORTFOLIO.</div>
        <div className="text-on-surface-variant font-body-md text-center">© 2024 Alex Morgan. Engineered with Precision.</div>
        <div className="flex gap-8 flex-wrap justify-center">
          {["Privacy Policy", "Terms of Service", "Github", "LinkedIn"].map((l) => (
            <a key={l} href="#" className="text-on-surface-variant hover:text-primary transition-colors text-label-sm font-label-sm uppercase tracking-widest">{l}</a>
          ))}
        </div>
      </footer>

      <button className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-primary text-on-primary shadow-[0_0_30px_rgba(214,186,255,0.4)] flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-40 group">
        <Icon name="add" className="text-headline-lg group-hover:rotate-45 transition-transform" />
      </button>
    </div>
  );
}
import { useState } from "react";
import { Icon, PageHeader, SaveBtn, Field, inputCls } from "../shared";

export function HeroSectionPage() {
  const [d, set] = useState({
    tag: "Hello, It's Me",
    name: "Alex Morgan",
    role: "Full Stack Developer & 3D Designer",
    desc: "I create immersive digital experiences with modern technologies and beautiful 3D animations. Specializing in the intersection of code and visual art.",
    years: "3+", projects: "30+", clients: "20+",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTV4dOlVZZQ6R1MeCj_bizBDfUqKVytS9-WED8VuXrLBKOcduycsryW53f1SehopltWRY8jGQqOojVFk0cL29D_-PmscGoE8N_bdFc3KGRaihHE_8DlQx2bnPZuGZ8bAUB-HGfUbTKg9n62VBAfPlTkFn2o647bWlNFvoHmrqQeC-XJS7_5n4G1PLy4IGmdpOV2-dX5Ao_4_f1Z270qpktAnCedLvZmpGHzoh7v83-I4RKxAgX7DBcLJGEnyHsHVIWbHvzCVmBWSfv",
    cta1: "Hire Me", cta2: "Download CV", cvUrl: "https://example.com/resume.pdf",
    showStats: true, showStack: true, typing: false, floatCards: true,
    accent: "Lavender", techStack: "JavaScript, React, Three.js, Node.js, TypeScript",
  });
  const upd = (k: keyof typeof d, v: any) => set((s) => ({ ...s, [k]: v }));

  return (
    <>
      <PageHeader title="Hero Section" subtitle="Edit every element shown in the user-side hero." action={<SaveBtn />} />
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel rounded-3xl p-8 space-y-5">
          <Field label="Greeting Tag"><input className={inputCls} value={d.tag} onChange={(e) => upd("tag", e.target.value)} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Name"><input className={inputCls} value={d.name} onChange={(e) => upd("name", e.target.value)} /></Field>
            <Field label="Accent Color"><input className={inputCls} value={d.accent} onChange={(e) => upd("accent", e.target.value)} /></Field>
          </div>
          <Field label="Role / Tagline"><input className={inputCls} value={d.role} onChange={(e) => upd("role", e.target.value)} /></Field>
          <Field label="Description"><textarea rows={4} className={inputCls} value={d.desc} onChange={(e) => upd("desc", e.target.value)} /></Field>
          <Field label="Tech Stack (comma separated icons)"><input className={inputCls} value={d.techStack} onChange={(e) => upd("techStack", e.target.value)} /></Field>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Years Exp."><input className={inputCls} value={d.years} onChange={(e) => upd("years", e.target.value)} /></Field>
            <Field label="Projects"><input className={inputCls} value={d.projects} onChange={(e) => upd("projects", e.target.value)} /></Field>
            <Field label="Clients"><input className={inputCls} value={d.clients} onChange={(e) => upd("clients", e.target.value)} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Primary CTA"><input className={inputCls} value={d.cta1} onChange={(e) => upd("cta1", e.target.value)} /></Field>
            <Field label="Secondary CTA"><input className={inputCls} value={d.cta2} onChange={(e) => upd("cta2", e.target.value)} /></Field>
          </div>
          <Field label="Resume / CV URL"><input className={inputCls} value={d.cvUrl} onChange={(e) => upd("cvUrl", e.target.value)} /></Field>
          <div className="grid sm:grid-cols-2 gap-3 pt-3 border-t border-outline-variant/20">
            {[
              { k: "showStats", l: "Show stats counters", i: "tag" },
              { k: "showStack", l: "Show tech stack", i: "deployed_code" },
              { k: "typing", l: "Typing animation", i: "keyboard" },
              { k: "floatCards", l: "Floating cards FX", i: "auto_awesome" },
            ].map((o) => (
              <label key={o.k} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.03] cursor-pointer">
                <span className="flex items-center gap-2 text-sm text-on-surface"><Icon name={o.i} className="text-primary text-[18px]" />{o.l}</span>
                <input type="checkbox" checked={(d as any)[o.k]} onChange={(e) => upd(o.k as any, e.target.checked)} className="accent-primary w-4 h-4" />
              </label>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 space-y-4">
          <h3 className="font-bold text-on-surface flex items-center gap-2"><Icon name="image" className="text-primary" /> Avatar</h3>
          <div className="aspect-square rounded-2xl overflow-hidden bg-surface-variant/40 border border-outline-variant/40">
            <img src={d.avatar} alt="" className="w-full h-full object-cover" />
          </div>
          <Field label="Avatar URL"><input className={inputCls} value={d.avatar} onChange={(e) => upd("avatar", e.target.value)} /></Field>
          <button className="w-full py-2.5 rounded-xl bg-primary/20 text-primary font-bold text-sm flex items-center justify-center gap-2">
            <Icon name="cloud_upload" className="text-[18px]" /> Upload Image
          </button>
        </div>
      </div>
    </>
  );
}
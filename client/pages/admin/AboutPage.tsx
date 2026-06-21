import { useState } from "react";
import { Icon, PageHeader, SaveBtn, Field, inputCls } from "../shared";

export function AboutPage() {
  const [d, set] = useState({
    title: "About Me",
    tag: "Get To Know Me",
    bio: "I'm a passionate Full Stack Developer & 3D Designer who loves building interactive, modern and beautiful web experiences.",
    longBio:
      "Over 3+ years I've delivered 30+ projects for clients across the globe — from startups to enterprises — focusing on performance, motion, and pixel-perfect detail.",
    location: "San Francisco, CA",
    availability: "Open to opportunities",
    email: "hello@alexmorgan.dev",
    phone: "+1 (555) 010-2025",
    resume: "https://example.com/resume.pdf",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDCBBu6aAzqIOEjOyaMYW7sjIp1xZIoCSqSwiWwIB9pFWvooquI87zmyDT2-GXoIMwl1xFv-8IVc17eKnOWivK51xf7KKcGaX3NLGqIJA",
    statValue: "30+",
    statLabel: "Projects Successfully Delivered",
    languages: "English, Spanish",
    interests: "Generative art, climbing, electronic music",
  });

  const upd = (k: keyof typeof d, v: string) => set((s) => ({ ...s, [k]: v }));

  return (
    <>
      <PageHeader
        title="About"
        subtitle="Every detail of the user-side About section."
        action={<SaveBtn />}
      />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel rounded-3xl p-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Section Title">
              <input className={inputCls} value={d.title} onChange={(e) => upd("title", e.target.value)} />
            </Field>
            <Field label="Eyebrow Tag">
              <input className={inputCls} value={d.tag} onChange={(e) => upd("tag", e.target.value)} />
            </Field>
          </div>
          <Field label="Short Bio">
            <textarea rows={3} className={inputCls} value={d.bio} onChange={(e) => upd("bio", e.target.value)} />
          </Field>
          <Field label="Long Bio">
            <textarea rows={5} className={inputCls} value={d.longBio} onChange={(e) => upd("longBio", e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Location">
              <input className={inputCls} value={d.location} onChange={(e) => upd("location", e.target.value)} />
            </Field>
            <Field label="Availability">
              <input className={inputCls} value={d.availability} onChange={(e) => upd("availability", e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Email">
              <input className={inputCls} value={d.email} onChange={(e) => upd("email", e.target.value)} />
            </Field>
            <Field label="Phone">
              <input className={inputCls} value={d.phone} onChange={(e) => upd("phone", e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Languages">
              <input className={inputCls} value={d.languages} onChange={(e) => upd("languages", e.target.value)} />
            </Field>
            <Field label="Interests">
              <input className={inputCls} value={d.interests} onChange={(e) => upd("interests", e.target.value)} />
            </Field>
          </div>
          <Field label="Resume URL">
            <input className={inputCls} value={d.resume} onChange={(e) => upd("resume", e.target.value)} />
          </Field>
        </div>

        <div className="glass-panel rounded-3xl p-6 space-y-4">
          <h3 className="font-bold text-on-surface flex items-center gap-2">
            <Icon name="badge" className="text-primary" /> Highlight Card
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Stat Value">
              <input className={inputCls} value={d.statValue} onChange={(e) => upd("statValue", e.target.value)} />
            </Field>
            <Field label="Stat Label">
              <input className={inputCls} value={d.statLabel} onChange={(e) => upd("statLabel", e.target.value)} />
            </Field>
          </div>
          <Field label="About Image URL">
            <input className={inputCls} value={d.image} onChange={(e) => upd("image", e.target.value)} />
          </Field>
          <div className="aspect-square rounded-2xl overflow-hidden bg-surface-variant/40 border border-outline-variant/40">
            <img src={d.image} alt="" className="w-full h-full object-cover" />
          </div>
          {/* Contact card preview */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-sm">
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60">Contact preview</p>
            <p className="text-on-surface">{d.email}</p>
            <p className="text-on-surface-variant opacity-70">{d.phone}</p>
            <p className="text-on-surface-variant opacity-70">{d.location}</p>
          </div>
        </div>
      </div>
    </>
  );
}
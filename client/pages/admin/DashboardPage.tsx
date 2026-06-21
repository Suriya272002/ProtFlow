import { useState } from "react";
import { Icon, PageHeader } from "../shared";

function SectionRow({
  icon,
  title,
  sub,
  published,
  color,
}: {
  icon: string;
  title: string;
  sub: string;
  published: boolean;
  color: string;
}) {
  const [on, setOn] = useState(published);
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 hover:bg-white/[0.08] transition-all flex-wrap gap-3">
      <div className="flex items-center gap-4">
        <Icon name="drag_indicator" className="text-on-surface-variant cursor-grab" />
        <div className={`w-12 h-12 rounded-xl bg-${color}/10 flex items-center justify-center text-${color}`}>
          <Icon name={icon} />
        </div>
        <div>
          <h4 className="font-bold text-on-surface">{title}</h4>
          <p className="text-xs text-on-surface-variant opacity-60">{sub}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <span className={`text-xs uppercase tracking-wider ${on ? "text-secondary-fixed" : "text-on-surface-variant/40"}`}>
          {on ? "Published" : "Draft"}
        </span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input checked={on} onChange={(e) => setOn(e.target.checked)} className="sr-only peer" type="checkbox" />
          <div className="w-11 h-6 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container" />
        </label>
      </div>
    </div>
  );
}

export function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard Overview"
        subtitle="Welcome back, Alex. Here's what's happening with your portfolio today."
        action={
          <button className="bg-primary text-on-primary font-bold px-6 py-3 rounded-full glow-primary hover:scale-105 transition-transform">
            Live Preview
          </button>
        }
      />

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Visitors", value: "12,540", icon: "group",       color: "primary",        delta: "+12.5%", sub: "vs last month" },
          { label: "Projects",       value: "28",     icon: "folder_open", color: "secondary-fixed", delta: "+8.2%",  sub: "new uploads" },
          { label: "Messages",       value: "146",    icon: "chat_bubble", color: "tertiary",        delta: "+18.7%", sub: "leads generated" },
          { label: "Conversion",     value: "3.8%",   icon: "ads_click",   color: "primary",        delta: "+2.4%",  sub: "hiring rate" },
        ].map((m) => (
          <div key={m.label} className="glass-panel p-6 rounded-3xl relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-widest opacity-60">
                  {m.label}
                </p>
                <h3 className="font-headline-lg text-headline-lg text-on-surface mt-1">{m.value}</h3>
              </div>
              <div className={`bg-${m.color}/10 p-3 rounded-2xl`}>
                <Icon name={m.icon} className={`text-${m.color}`} fill />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-secondary-fixed">
              <Icon name="trending_up" className="text-xs" />
              <span>{m.delta}</span>
              <span className="text-on-surface-variant opacity-40 ml-1">{m.sub}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Quick activity */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 glass-panel rounded-3xl p-8">
          <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-3 mb-6">
            <Icon name="layers" className="text-primary" /> Manage Sections
          </h2>
          <div className="space-y-3">
            {[
              { icon: "token",      title: "Hero Section",  sub: "Last updated 2 days ago",           published: true,  color: "primary" },
              { icon: "person",     title: "About Me",      sub: "Contains personal bio and skills",  published: true,  color: "secondary-fixed" },
              { icon: "work",       title: "Case Studies",  sub: "High-detail project views",         published: false, color: "tertiary" },
              { icon: "handshake",  title: "Services",      sub: "What I offer to clients",           published: true,  color: "primary" },
            ].map((s) => (
              <SectionRow key={s.title} {...s} />
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 space-y-4">
          <h3 className="font-bold text-on-surface flex items-center gap-2 mb-2">
            <Icon name="notifications" className="text-primary" /> Recent Activity
          </h3>
          {[
            { icon: "mail",        color: "primary",        text: "New message from Sarah W.",  time: "15m" },
            { icon: "edit",        color: "secondary-fixed", text: "Hero section updated",       time: "1h" },
            { icon: "group",       color: "tertiary",       text: "New user: David Chen",        time: "3h" },
            { icon: "analytics",   color: "primary",        text: "Monthly report ready",        time: "1d" },
            { icon: "star",        color: "secondary-fixed", text: "Project starred on GitHub",  time: "2d" },
          ].map((a, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-outline-variant/20 last:border-0">
              <div className={`w-8 h-8 rounded-lg bg-${a.color}/10 text-${a.color} flex items-center justify-center shrink-0`}>
                <Icon name={a.icon} className="text-[16px]" />
              </div>
              <p className="flex-1 text-sm text-on-surface">{a.text}</p>
              <span className="text-xs text-on-surface-variant opacity-50 shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "GitHub Stars",    value: "1.2k", icon: "star" },
          { label: "Open Issues",     value: "8",    icon: "bug_report" },
          { label: "Deploy Status",   value: "Live", icon: "rocket_launch" },
          { label: "Uptime",          value: "99.9%", icon: "speed" },
        ].map((s) => (
          <div key={s.label} className="glass-panel rounded-2xl p-4 flex items-center gap-3">
            <Icon name={s.icon} className="text-primary" />
            <div>
              <p className="text-xs text-on-surface-variant opacity-60">{s.label}</p>
              <p className="font-bold text-on-surface">{s.value}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
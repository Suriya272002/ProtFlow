import { Icon, PageHeader, inputCls } from "../shared";

export function AnalyticsPage() {
  return (
    <>
      <PageHeader
        title="Analytics"
        subtitle="Traffic and engagement across your portfolio."
        action={
          <select className={`${inputCls} w-auto py-2`}>
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last year</option>
          </select>
        }
      />

      {/* KPI row */}
      <section className="grid md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Page Views",       value: "48.2k",  delta: "+22%", icon: "pageview" },
          { label: "Unique Visitors",  value: "12,540", delta: "+12%", icon: "group" },
          { label: "Avg. Session",     value: "3m 42s", delta: "+8%",  icon: "timer" },
          { label: "Bounce Rate",      value: "32%",    delta: "-4%",  icon: "undo" },
        ].map((s) => (
          <div key={s.label} className="glass-panel rounded-3xl p-6">
            <div className="flex justify-between items-start mb-3">
              <p className="text-xs uppercase tracking-widest text-on-surface-variant opacity-60">{s.label}</p>
              <Icon name={s.icon} className="text-primary opacity-60 text-[18px]" />
            </div>
            <h3 className="font-headline-lg text-headline-lg text-on-surface">{s.value}</h3>
            <p className="text-secondary-fixed text-sm mt-1 flex items-center gap-1">
              <Icon name="trending_up" className="text-[14px]" />{s.delta}
            </p>
          </div>
        ))}
      </section>

      {/* Chart */}
      <div className="glass-panel rounded-3xl p-8 mb-6">
        <h3 className="font-bold text-on-surface mb-6 flex items-center gap-2">
          <Icon name="show_chart" className="text-primary" /> Traffic Trend — Last 30 Days
        </h3>
        <svg viewBox="0 0 600 200" className="w-full h-64">
          <defs>
            <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%"   stopColor="#d6baff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#d6baff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="g2" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%"   stopColor="#00dbe9" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00dbe9" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Visitors area */}
          <path d="M0,160 C60,140 90,80 150,100 C210,120 250,40 320,60 C390,80 430,30 500,50 C560,65 600,30 600,30 L600,200 L0,200 Z" fill="url(#g1)" />
          <path d="M0,160 C60,140 90,80 150,100 C210,120 250,40 320,60 C390,80 430,30 500,50 C560,65 600,30 600,30" stroke="#d6baff" strokeWidth="2" fill="none" />
          {/* Page views area */}
          <path d="M0,180 C60,170 90,130 150,140 C210,150 250,90 320,100 C390,110 430,70 500,80 C560,88 600,60 600,60 L600,200 L0,200 Z" fill="url(#g2)" />
          <path d="M0,180 C60,170 90,130 150,140 C210,150 250,90 320,100 C390,110 430,70 500,80 C560,88 600,60 600,60" stroke="#00dbe9" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
          {/* Dots */}
          {[[150,100],[320,60],[500,50],[600,30]].map(([x,y],i)=>(
            <circle key={i} cx={x} cy={y} r="4" fill="#d6baff" />
          ))}
          {/* X-axis labels */}
          {["Week 1","Week 2","Week 3","Week 4"].map((l,i)=>(
            <text key={l} x={75+i*150} y="198" fill="#94a3b8" fontSize="11" textAnchor="middle">{l}</text>
          ))}
        </svg>
        <div className="flex items-center gap-6 mt-4 text-xs text-on-surface-variant opacity-70">
          <span className="flex items-center gap-2"><span className="w-6 h-0.5 bg-primary inline-block"/>Unique Visitors</span>
          <span className="flex items-center gap-2"><span className="w-6 h-0.5 bg-secondary-fixed inline-block border-dashed"/>Page Views</span>
        </div>
      </div>

      {/* Top pages + sources */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-panel rounded-3xl p-6">
          <h3 className="font-bold text-on-surface mb-5 flex items-center gap-2">
            <Icon name="bar_chart" className="text-primary" /> Top Pages
          </h3>
          {[
            { page: "/",          views: "18.4k", pct: 88 },
            { page: "/projects",  views: "9.2k",  pct: 55 },
            { page: "/about",     views: "6.8k",  pct: 40 },
            { page: "/contact",   views: "4.1k",  pct: 25 },
            { page: "/services",  views: "2.9k",  pct: 18 },
          ].map((r) => (
            <div key={r.page} className="flex items-center gap-4 py-3 border-b border-outline-variant/20 last:border-0">
              <span className="text-on-surface font-mono text-sm w-28 truncate">{r.page}</span>
              <div className="flex-1 h-1.5 bg-surface-variant/40 rounded-full overflow-hidden">
                <div className="h-full bg-primary/60 rounded-full" style={{ width: `${r.pct}%` }} />
              </div>
              <span className="text-xs text-on-surface-variant opacity-70 w-12 text-right">{r.views}</span>
            </div>
          ))}
        </div>

        <div className="glass-panel rounded-3xl p-6">
          <h3 className="font-bold text-on-surface mb-5 flex items-center gap-2">
            <Icon name="link" className="text-primary" /> Traffic Sources
          </h3>
          {[
            { source: "Direct",       pct: 42, color: "primary" },
            { source: "GitHub",       pct: 28, color: "secondary-fixed" },
            { source: "LinkedIn",     pct: 18, color: "tertiary" },
            { source: "Twitter / X",  pct: 8,  color: "primary" },
            { source: "Other",        pct: 4,  color: "secondary-fixed" },
          ].map((r) => (
            <div key={r.source} className="flex items-center gap-4 py-3 border-b border-outline-variant/20 last:border-0">
              <span className="text-on-surface text-sm w-28 truncate">{r.source}</span>
              <div className="flex-1 h-1.5 bg-surface-variant/40 rounded-full overflow-hidden">
                <div className={`h-full bg-${r.color}/60 rounded-full`} style={{ width: `${r.pct * 2.4}%` }} />
              </div>
              <span className="text-xs text-on-surface-variant opacity-70 w-8 text-right">{r.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
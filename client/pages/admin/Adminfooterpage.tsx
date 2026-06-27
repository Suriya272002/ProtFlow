import { useEffect, useState } from "react";
import { adminApi } from "../../lib/admin-api";
import type { FooterConfig } from "@shared/api";

const Icon = ({ name, className = "" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

const DEFAULT: FooterConfig = {
  tagline: "Engineered with Precision.",
  copyrightName: "Alex Morgan",
  copyrightYear: new Date().getFullYear().toString(),
  links: [
    { label: "Privacy Policy", url: "#" },
    { label: "Terms of Service", url: "#" },
    { label: "GitHub", url: "#" },
    { label: "LinkedIn", url: "#" },
  ],
  socialLinks: [],
  showSocial: true,
  showLinks: true,
  showBackToTop: true,
};

export function AdminFooterPage() {
  const [data, setData] = useState<FooterConfig>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminApi.getFooter()
      .then((d) => d && setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const updated = await adminApi.saveFooter(data);
      setData(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {}
    setSaving(false);
  };

  const updateLink = (i: number, field: "label" | "url", value: string) => {
    const links = [...data.links];
    links[i] = { ...links[i], [field]: value };
    setData((d) => ({ ...d, links }));
  };

  const addLink = () =>
    setData((d) => ({ ...d, links: [...d.links, { label: "", url: "#" }] }));

  const removeLink = (i: number) =>
    setData((d) => ({ ...d, links: d.links.filter((_, idx) => idx !== i) }));

  const updateSocial = (i: number, field: "icon" | "label" | "url", value: string) => {
    const socialLinks = [...data.socialLinks];
    socialLinks[i] = { ...socialLinks[i], [field]: value };
    setData((d) => ({ ...d, socialLinks }));
  };

  const addSocial = () =>
    setData((d) => ({
      ...d,
      socialLinks: [...d.socialLinks, { icon: "link", label: "", url: "#" }],
    }));

  const removeSocial = (i: number) =>
    setData((d) => ({ ...d, socialLinks: d.socialLinks.filter((_, idx) => idx !== i) }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-headline-md text-on-surface">Footer</h1>
          <p className="text-on-surface-variant text-body-md mt-1">
            Control what appears in your portfolio footer
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-medium text-sm hover:opacity-90 transition-all disabled:opacity-60"
        >
          <Icon name={saved ? "check_circle" : "save"} className="text-[18px]" />
          {saving ? "Saving…" : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Basic Info */}
      <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-5">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">
          Basic Info
        </h2>

        <div className="space-y-2">
          <label className="text-label-sm text-on-surface-variant uppercase tracking-widest text-xs block">
            Tagline
          </label>
          <input
            value={data.tagline}
            onChange={(e) => setData((d) => ({ ...d, tagline: e.target.value }))}
            className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-body-md focus:outline-none focus:border-primary transition-colors"
            placeholder="Engineered with Precision."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-label-sm text-on-surface-variant uppercase tracking-widest text-xs block">
              Copyright Name
            </label>
            <input
              value={data.copyrightName}
              onChange={(e) => setData((d) => ({ ...d, copyrightName: e.target.value }))}
              className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-body-md focus:outline-none focus:border-primary transition-colors"
              placeholder="Alex Morgan"
            />
          </div>
          <div className="space-y-2">
            <label className="text-label-sm text-on-surface-variant uppercase tracking-widest text-xs block">
              Copyright Year
            </label>
            <input
              value={data.copyrightYear}
              onChange={(e) => setData((d) => ({ ...d, copyrightYear: e.target.value }))}
              className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-body-md focus:outline-none focus:border-primary transition-colors"
              placeholder="2024"
            />
          </div>
        </div>
      </div>

      {/* Visibility Toggles */}
      <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">
          Visibility
        </h2>
        {(
          [
            { key: "showLinks", label: "Show Footer Links", icon: "link" },
            { key: "showSocial", label: "Show Social Icons", icon: "share" },
            { key: "showBackToTop", label: "Show Back to Top Button", icon: "arrow_upward" },
          ] as { key: keyof FooterConfig; label: string; icon: string }[]
        ).map(({ key, label, icon }) => (
          <div key={key} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Icon name={icon} className="text-on-surface-variant text-[18px]" />
              <span className="text-body-md">{label}</span>
            </div>
            <button
              onClick={() => setData((d) => ({ ...d, [key]: !d[key] }))}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                data[key] ? "bg-primary" : "bg-white/10"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${
                  data[key] ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Footer Links */}
      <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">
            Footer Links
          </h2>
          <button
            onClick={addLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm hover:bg-primary/20 transition-colors"
          >
            <Icon name="add" className="text-[16px]" /> Add Link
          </button>
        </div>

        {data.links.length === 0 && (
          <p className="text-on-surface-variant text-sm text-center py-4">No links yet. Add one above.</p>
        )}

        <div className="space-y-3">
          {data.links.map((link, i) => (
            <div key={i} className="flex gap-3 items-center">
              <input
                value={link.label}
                onChange={(e) => updateLink(i, "label", e.target.value)}
                placeholder="Label (e.g. Privacy Policy)"
                className="flex-1 bg-background/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <input
                value={link.url}
                onChange={(e) => updateLink(i, "url", e.target.value)}
                placeholder="URL (e.g. /privacy)"
                className="flex-1 bg-background/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <button
                onClick={() => removeLink(i)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-400/10 transition-colors shrink-0"
              >
                <Icon name="delete" className="text-[18px]" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">
            Social Links
          </h2>
          <button
            onClick={addSocial}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm hover:bg-primary/20 transition-colors"
          >
            <Icon name="add" className="text-[16px]" /> Add Social
          </button>
        </div>
        <p className="text-xs text-on-surface-variant">
          Use Material Symbols icon names (e.g. <code className="bg-white/5 px-1 rounded">language</code>,{" "}
          <code className="bg-white/5 px-1 rounded">code</code>,{" "}
          <code className="bg-white/5 px-1 rounded">share</code>)
        </p>

        {data.socialLinks.length === 0 && (
          <p className="text-on-surface-variant text-sm text-center py-4">No social links yet.</p>
        )}

        <div className="space-y-3">
          {data.socialLinks.map((s, i) => (
            <div key={i} className="flex gap-3 items-center">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <Icon name={s.icon || "link"} className="text-primary text-[18px]" />
              </div>
              <input
                value={s.icon}
                onChange={(e) => updateSocial(i, "icon", e.target.value)}
                placeholder="Icon name"
                className="w-32 bg-background/50 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <input
                value={s.label}
                onChange={(e) => updateSocial(i, "label", e.target.value)}
                placeholder="Label"
                className="flex-1 bg-background/50 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <input
                value={s.url}
                onChange={(e) => updateSocial(i, "url", e.target.value)}
                placeholder="URL"
                className="flex-1 bg-background/50 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <button
                onClick={() => removeSocial(i)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-400/10 transition-colors shrink-0"
              >
                <Icon name="delete" className="text-[18px]" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Live Preview */}
      <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">
          Preview
        </h2>
        <div className="rounded-xl bg-background/60 border border-white/5 px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-bold text-lg text-on-surface">PORTFOLIO.</div>
          <div className="text-on-surface-variant text-sm text-center">
            © {data.copyrightYear} {data.copyrightName}. {data.tagline}
          </div>
          {data.showLinks && data.links.length > 0 && (
            <div className="flex gap-4 flex-wrap justify-center">
              {data.links.map((l, i) => (
                <span key={i} className="text-on-surface-variant text-xs uppercase tracking-widest hover:text-primary transition-colors cursor-pointer">
                  {l.label || "Link"}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
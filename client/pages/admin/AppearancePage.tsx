import { useState } from "react";
import { Icon, PageHeader, SaveBtn, Field } from "../shared";

const PALETTES = [
  {
    name: "Lavender Aurora",
    colors: ["#d6baff", "#7832d9", "#00dbe9", "#0e0e0f"],
  },
  {
    name: "Sunset Blaze",
    colors: ["#ff6b35", "#f7931e", "#e84393", "#1a1a1f"],
  },
  { name: "Ocean Deep", colors: ["#5cbdb9", "#2d8a9e", "#1a4a6e", "#0c2340"] },
  { name: "Forest Moss", colors: ["#a0c49d", "#5a8a5c", "#2d5a3d", "#1a3c2a"] },
  { name: "Noir Gold", colors: ["#f0d78c", "#c9a84c", "#1a1a1a", "#0d0d0d"] },
  { name: "Cherry Pop", colors: ["#ff6b6b", "#c44569", "#574b90", "#1b1530"] },
  { name: "Cyber Neon", colors: ["#00ffa3", "#00b4ff", "#ff00d4", "#06010f"] },
  { name: "Mono Slate", colors: ["#e2e8f0", "#94a3b8", "#475569", "#0f172a"] },
  {
    name: "Peach Sorbet",
    colors: ["#ffb4a2", "#e5989b", "#b5838d", "#6d6875"],
  },
  {
    name: "Emerald Mint",
    colors: ["#34d399", "#10b981", "#065f46", "#022c22"],
  },
  { name: "Royal Plum", colors: ["#c084fc", "#7e22ce", "#3b0764", "#1a0033"] },
  { name: "Solar Flare", colors: ["#fde047", "#f97316", "#dc2626", "#1c0a00"] },
];

const BG_ANIMATIONS = [
  { id: "orbs", name: "Animated Orbs", icon: "blur_on" },
  { id: "particles", name: "Particle Field", icon: "scatter_plot" },
  { id: "waves", name: "Wave Mesh", icon: "waves" },
  { id: "grid", name: "Grid Pulse", icon: "grid_4x4" },
  { id: "stars", name: "Starfield", icon: "auto_awesome" },
  { id: "none", name: "Static", icon: "block" },
];

export function AppearancePage() {
  const [mode, setMode] = useState<"dark" | "light" | "system">("dark");
  const [palette, setPalette] = useState(0);
  const [radius, setRadius] = useState(16);
  const [density, setDensity] = useState("Comfortable");
  const [bgAnim, setBgAnim] = useState("orbs");
  const [animSpeed, setAnimSpeed] = useState(60);
  const [animIntensity, setAnimIntensity] = useState(50);
  const [parallax, setParallax] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [scrollReveal, setScrollReveal] = useState(true);
  const [hover3d, setHover3d] = useState(true);

  return (
    <>
      <PageHeader
        title="Appearance & Theme"
        subtitle="Visual identity, palette, animations, and motion settings."
        action={<SaveBtn />}
      />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Color Mode */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-on-surface">
              <Icon name="contrast" className="text-primary" />
              Color Mode
            </h3>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {(["dark", "light", "system"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 sm:gap-3 ${mode === m ? "border-primary bg-primary/10" : "border-outline-variant/30 hover:border-primary/40"}`}
                >
                  <Icon
                    name={
                      m === "dark"
                        ? "dark_mode"
                        : m === "light"
                          ? "light_mode"
                          : "monitor"
                    }
                    className="text-2xl text-primary"
                  />
                  <span className="capitalize font-bold text-on-surface text-sm">
                    {m}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-on-surface">
              <Icon name="palette" className="text-primary" />
              Color Palette
              <span className="ml-auto text-xs text-on-surface-variant opacity-60">
                {PALETTES.length} themes
              </span>
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {PALETTES.map((p, i) => (
                <button
                  key={p.name}
                  onClick={() => setPalette(i)}
                  className={`p-3 sm:p-4 rounded-2xl border-2 transition-all text-left ${palette === i ? "border-primary bg-primary/10" : "border-outline-variant/30 hover:border-primary/40"}`}
                >
                  <div className="flex gap-1 mb-3">
                    {p.colors.map((c) => (
                      <div
                        key={c}
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg"
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                  <p className="font-bold text-on-surface text-xs sm:text-sm truncate">
                    {p.name}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Background Animation */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-5">
            <h3 className="font-bold flex items-center gap-2 text-on-surface">
              <Icon name="animation" className="text-primary" />
              Background Animation
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {BG_ANIMATIONS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setBgAnim(a.id)}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${bgAnim === a.id ? "border-primary bg-primary/10" : "border-outline-variant/30 hover:border-primary/40"}`}
                >
                  <Icon name={a.icon} className="text-primary" />
                  <span className="text-xs font-bold text-on-surface text-center">
                    {a.name}
                  </span>
                </button>
              ))}
            </div>
            <Field label={`Animation speed: ${animSpeed}%`}>
              <input
                type="range"
                min={0}
                max={100}
                value={animSpeed}
                onChange={(e) => setAnimSpeed(+e.target.value)}
                className="w-full accent-primary"
              />
            </Field>
            <Field label={`Effect intensity: ${animIntensity}%`}>
              <input
                type="range"
                min={0}
                max={100}
                value={animIntensity}
                onChange={(e) => setAnimIntensity(+e.target.value)}
                className="w-full accent-primary"
              />
            </Field>
            <div className="grid sm:grid-cols-2 gap-3 pt-2 border-t border-outline-variant/20">
              {[
                {
                  l: "Parallax on scroll",
                  v: parallax,
                  s: setParallax,
                  i: "swap_vert",
                },
                {
                  l: "Reveal on scroll",
                  v: scrollReveal,
                  s: setScrollReveal,
                  i: "visibility",
                },
                {
                  l: "3D hover tilt",
                  v: hover3d,
                  s: setHover3d,
                  i: "3d_rotation",
                },
                {
                  l: "Reduced motion",
                  v: reducedMotion,
                  s: setReducedMotion,
                  i: "accessibility",
                },
              ].map((o) => (
                <label
                  key={o.l}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.03] cursor-pointer"
                >
                  <span className="flex items-center gap-2 text-sm text-on-surface">
                    <Icon name={o.i} className="text-primary text-[18px]" />
                    {o.l}
                  </span>
                  <input
                    type="checkbox"
                    checked={o.v}
                    onChange={(e) => o.s(e.target.checked)}
                    className="accent-primary w-4 h-4"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Shape & Density */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-5">
            <h3 className="font-bold flex items-center gap-2 text-on-surface">
              <Icon name="rounded_corner" className="text-primary" />
              Shape & Density
            </h3>
            <Field label={`Corner radius: ${radius}px`}>
              <input
                type="range"
                min={0}
                max={32}
                value={radius}
                onChange={(e) => setRadius(+e.target.value)}
                className="w-full accent-primary"
              />
            </Field>
            <Field label="UI Density">
              <div className="grid grid-cols-3 gap-3">
                {["Compact", "Comfortable", "Spacious"].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDensity(d)}
                    className={`py-3 rounded-xl border text-sm ${density === d ? "border-primary bg-primary/10 text-primary" : "border-outline-variant/30 text-on-surface-variant"}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        </div>

        {/* Live Preview */}
        <div className="glass-panel rounded-3xl p-6 space-y-4 lg:sticky lg:top-6 h-fit">
          <h3 className="font-bold flex items-center gap-2 text-on-surface">
            <Icon name="visibility" className="text-primary" />
            Live Preview
          </h3>
          <div
            className="rounded-2xl p-5 space-y-3 relative overflow-hidden"
            style={{
              background: PALETTES[palette].colors[3],
              borderRadius: radius,
            }}
          >
            <div
              className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-50"
              style={{
                background: PALETTES[palette].colors[0],
                animation: `drift ${30 - animSpeed / 5}s ease-in-out infinite`,
              }}
            />
            <div className="relative">
              <div className="flex gap-2 mb-2">
                {PALETTES[palette].colors.slice(0, 3).map((c) => (
                  <span
                    key={c}
                    className="w-3 h-3 rounded-full"
                    style={{ background: c }}
                  />
                ))}
              </div>
              <h4 className="font-bold text-white">Portfolio Preview</h4>
              <p className="text-xs text-white/70 mb-3">
                Mode: {mode} · {bgAnim} · {density}
              </p>
              <button
                className="px-4 py-2 text-xs font-bold text-white"
                style={{
                  background: PALETTES[palette].colors[1],
                  borderRadius: radius,
                }}
              >
                Hire Me
              </button>
            </div>
          </div>
          <div className="text-xs text-on-surface-variant opacity-70 space-y-1 pt-2 border-t border-outline-variant/20">
            <p>
              Palette:{" "}
              <span className="text-on-surface font-bold">
                {PALETTES[palette].name}
              </span>
            </p>
            <p>
              Animation:{" "}
              <span className="text-on-surface font-bold capitalize">
                {bgAnim}
              </span>{" "}
              @ {animSpeed}%
            </p>
            <p>
              Radius:{" "}
              <span className="text-on-surface font-bold">{radius}px</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

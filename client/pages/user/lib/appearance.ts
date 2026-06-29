import { PALETTES } from "./constants";
import type { AppearanceData } from "./types";

export function applyAppearance(appearance: AppearanceData | null) {
  if (!appearance) return;
  const root = document.documentElement;

  const effectiveMode =
    appearance.mode === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : appearance.mode;
  root.classList.remove("dark", "light");
  root.classList.add(effectiveMode);
  localStorage.setItem("theme", effectiveMode);

  const pal = PALETTES[appearance.palette ?? 0] ?? PALETTES[0];
  root.style.setProperty("--palette-primary",    pal.colors[0]);
  root.style.setProperty("--palette-secondary",  pal.colors[1]);
  root.style.setProperty("--palette-accent",     pal.colors[2]);
  root.style.setProperty("--palette-background", pal.colors[3]);

  root.style.setProperty("--radius", `${appearance.radius ?? 16}px`);
  root.style.setProperty("--anim-speed", String((appearance.animSpeed ?? 60) / 100));
  root.style.setProperty("--anim-intensity", String((appearance.animIntensity ?? 50) / 100));

  if (appearance.reducedMotion) {
    root.style.setProperty("--motion-duration", "0s");
  } else {
    root.style.removeProperty("--motion-duration");
  }

  root.dataset.bgAnim       = appearance.bgAnim      ?? "orbs";
  root.dataset.parallax     = appearance.parallax     ? "1" : "0";
  root.dataset.scrollReveal = appearance.scrollReveal ? "1" : "0";
  root.dataset.hover3d      = appearance.hover3d      ? "1" : "0";
  root.dataset.density      = appearance.density      ?? "Comfortable";
}

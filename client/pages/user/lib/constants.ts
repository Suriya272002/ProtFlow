/* ── Palette definitions (must match admin PALETTES) ── */
export const PALETTES = [
  { name: "Lavender Aurora", colors: ["#d6baff", "#7832d9", "#00dbe9", "#0e0e0f"] },
  { name: "Sunset Blaze",    colors: ["#ff6b35", "#f7931e", "#e84393", "#1a1a1f"] },
  { name: "Ocean Deep",      colors: ["#5cbdb9", "#2d8a9e", "#1a4a6e", "#0c2340"] },
  { name: "Forest Moss",     colors: ["#a0c49d", "#5a8a5c", "#2d5a3d", "#1a3c2a"] },
  { name: "Noir Gold",       colors: ["#f0d78c", "#c9a84c", "#1a1a1a", "#0d0d0d"] },
  { name: "Cherry Pop",      colors: ["#ff6b6b", "#c44569", "#574b90", "#1b1530"] },
  { name: "Cyber Neon",      colors: ["#00ffa3", "#00b4ff", "#ff00d4", "#06010f"] },
  { name: "Mono Slate",      colors: ["#e2e8f0", "#94a3b8", "#475569", "#0f172a"] },
  { name: "Peach Sorbet",    colors: ["#ffb4a2", "#e5989b", "#b5838d", "#6d6875"] },
  { name: "Emerald Mint",    colors: ["#34d399", "#10b981", "#065f46", "#022c22"] },
  { name: "Royal Plum",      colors: ["#c084fc", "#7e22ce", "#3b0764", "#1a0033"] },
  { name: "Solar Flare",     colors: ["#fde047", "#f97316", "#dc2626", "#1c0a00"] },
];

export const NAV_LINKS = [
  { href: "home",      label: "Home"      },
  { href: "about",     label: "About"     },
  { href: "education", label: "Education" },
  { href: "skills",    label: "Skills"    },
  { href: "projects",  label: "Projects"  },
  { href: "services",  label: "Services"  },
  { href: "contact",   label: "Contact"   },
];

export const SECTION_IDS = NAV_LINKS.map((n) => n.href);

export const COLOR_STYLES = [
  { bg: "bg-primary/10",           text: "text-primary",           bar: "bg-primary" },
  { bg: "bg-secondary/10",         text: "text-secondary",         bar: "bg-secondary" },
  { bg: "bg-tertiary/10",          text: "text-tertiary",          bar: "bg-tertiary" },
  { bg: "bg-primary-container/20", text: "text-primary-container", bar: "bg-primary-container" },
];

export const TECH_ICON_MAP: Record<string, string> = {
  javascript: "javascript", js: "javascript",
  typescript: "code_blocks", ts: "code_blocks",
  react: "deployed_code", "react.js": "deployed_code", reactjs: "deployed_code",
  nextjs: "dns", "next.js": "dns",
  vue: "layers", angular: "change_history",
  node: "terminal", nodejs: "terminal", "node.js": "terminal",
  python: "code", django: "language", flask: "science",
  java: "coffee", kotlin: "phone_android",
  swift: "phone_iphone", ios: "phone_iphone",
  android: "phone_android", flutter: "flutter_dash",
  css: "style", tailwind: "design_services", sass: "palette",
  html: "html", figma: "design_services",
  "three.js": "view_in_ar", threejs: "view_in_ar", webgl: "view_in_ar",
  blender: "view_in_ar", unity: "videogame_asset",
  docker: "inventory_2", kubernetes: "hub", aws: "cloud",
  firebase: "local_fire_department", mongodb: "storage",
  postgresql: "database", mysql: "database", sql: "database",
  graphql: "share", rest: "api", git: "merge", github: "merge",
  linux: "computer",
};

export function getTechIcon(name: string): string {
  const key = name.toLowerCase().replace(/\s+/g, "");
  return TECH_ICON_MAP[key] ?? "code";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: { id: number; name: string; email: string; role: string };
}

export interface ApiError {
  error: string;
}

export interface HeroData {
  tag: string;
  name: string;
  role: string;
  desc: string;
  years: string;
  projects: string;
  clients: string;
  avatar: string;
  cta1: string;
  cta2: string;
  cvUrl: string;
  showStats: boolean;
  showStack: boolean;
  typing: boolean;
  floatCards: boolean;
  accent: string;
  techStack: string;
}

export interface AboutData {
  title: string;
  tag: string;
  bio: string;
  longBio: string;
  location: string;
  availability: string;
  email: string;
  phone: string;
  resume: string;
  image: string;
  statValue: string;
  statLabel: string;
  languages: string;
  interests: string;
}

export interface ListItem {
  id?: number;
  a: string;
  b: string;
  c: string;
  d?: string;
}

export interface Skill {
  id?: number;
  name: string;
  level: number;
  category: string;
  icon: string;
}

export interface Project {
  id?: number;
  title: string;
  tag: string;
  img: string;
  desc: string;
  live: string;
  repo: string;
  tech: string;
  featured: boolean;
}

export interface Service {
  id?: number;
  icon: string;
  title: string;
  desc: string;
  price: string;
  visible: boolean;
}

export interface Message {
  id?: number;
  name: string;
  email: string;
  subject: string;
  preview: string;
  body: string;
  time: string;
  unread: boolean;
}

export interface AdminUser {
  id?: number;
  name: string;
  email: string;
  role: string;
  status: string;
  last: string;
  avatar: string;
}

export interface SmtpConfig {
  provider: string;
  host: string;
  port: string;
  username: string;
  password: string;
  fromName: string;
  fromEmail: string;
  replyTo: string;
  secure: boolean;
}

export interface AppearanceConfig {
  mode: "dark" | "light" | "system";
  palette: number;
  radius: number;
  density: string;
  bgAnim: string;
  animSpeed: number;
  animIntensity: number;
  parallax: boolean;
  reducedMotion: boolean;
  scrollReveal: boolean;
  hover3d: boolean;
}

export interface SiteSettings {
  accountName: string;
  accountEmail: string;
  siteTitle: string;
  metaDescription: string;
  keywords: string;
  emailNotifications: boolean;
  showAnalyticsWidget: boolean;
  allowIndexing: boolean;
}

export interface CustomizationConfig {
  logoText: string;
  favicon: string;
  ogImageUrl: string;
  tagline: string;
  navigation: { label: string; visible: boolean }[];
  backgroundStyle: string;
  animationSpeed: number;
  floatingCards: boolean;
  typingAnimation: boolean;
  socialLinks: { icon: string; label: string; url: string }[];
  customCss: string;
  customHeadScripts: string;
}


export interface FooterConfig {
  tagline: string;
  copyrightName: string;
  copyrightYear: string;
  links: { label: string; url: string }[];
  socialLinks: { icon: string; label: string; url: string }[];
  showSocial: boolean;
  showLinks: boolean;
  showBackToTop: boolean;
}

export interface DashboardData {
  stats: { label: string; value: string; delta: string; icon: string }[];
  sections: { id: number; key: string; title: string; icon: string; subtitle: string; published: boolean }[];
  counts: { projects: number; messages: number; unread: number };
}

export interface AnalyticsData {
  stats: { label: string; value: string; delta: string }[];
}
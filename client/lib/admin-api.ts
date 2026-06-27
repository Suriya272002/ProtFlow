import type {
  AboutData,
  FooterConfig,
  AdminUser,
  AnalyticsData,
  AppearanceConfig,
  CustomizationConfig,
  DashboardData,
  HeroData,
  ListItem,
  LoginRequest,
  LoginResponse,
  Message,
  Project,
  Service,
  SiteSettings,
  Skill,
  SmtpConfig,
} from "@shared/api";

const TOKEN_KEY = "admin_token";

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function isAuthed(): boolean {
  return !!getToken();
}

async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`/api${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data as T;
}

export const adminApi = {
  login: (body: LoginRequest) =>
    api<LoginResponse>("/auth/login", { method: "POST", body: JSON.stringify(body) }),

  me: () => api<{ id: number; name: string; email: string; role: string }>("/auth/me"),

  getDashboard: () => api<DashboardData>("/dashboard"),

  updateSection: (id: number, published: boolean) =>
    api(`/dashboard/sections/${id}`, { method: "PUT", body: JSON.stringify({ published }) }),

  getHero: () => api<HeroData>("/hero"),
  saveHero: (data: HeroData) => api<HeroData>("/hero", { method: "PUT", body: JSON.stringify(data) }),

  getAbout: () => api<AboutData>("/about"),
  saveAbout: (data: AboutData) => api<AboutData>("/about", { method: "PUT", body: JSON.stringify(data) }),

  listEducation: () => api<ListItem[]>("/education"),
  createEducation: (data: ListItem) => api<ListItem>("/education", { method: "POST", body: JSON.stringify(data) }),
  updateEducation: (id: number, data: ListItem) => api<ListItem>(`/education/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteEducation: (id: number) => api(`/education/${id}`, { method: "DELETE" }),

  listExperience: () => api<ListItem[]>("/experience"),
  createExperience: (data: ListItem) => api<ListItem>("/experience", { method: "POST", body: JSON.stringify(data) }),
  updateExperience: (id: number, data: ListItem) => api<ListItem>(`/experience/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteExperience: (id: number) => api(`/experience/${id}`, { method: "DELETE" }),

  listSkills: () => api<Skill[]>("/skills"),
  createSkill: (data: Skill) => api<Skill>("/skills", { method: "POST", body: JSON.stringify(data) }),
  updateSkill: (id: number, data: Skill) => api<Skill>(`/skills/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteSkill: (id: number) => api(`/skills/${id}`, { method: "DELETE" }),

  listProjects: () => api<Project[]>("/projects"),
  createProject: (data: Project) => api<Project>("/projects", { method: "POST", body: JSON.stringify(data) }),
  updateProject: (id: number, data: Project) => api<Project>(`/projects/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteProject: (id: number) => api(`/projects/${id}`, { method: "DELETE" }),

  listServices: () => api<Service[]>("/services"),
  createService: (data: Service) => api<Service>("/services", { method: "POST", body: JSON.stringify(data) }),
  updateService: (id: number, data: Service) => api<Service>(`/services/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteService: (id: number) => api(`/services/${id}`, { method: "DELETE" }),

  listMessages: () => api<Message[]>("/messages"),
  createMessage: (data: Message) => api<Message>("/messages", { method: "POST", body: JSON.stringify(data) }),
  updateMessage: (id: number, data: Message) => api<Message>(`/messages/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteMessage: (id: number) => api(`/messages/${id}`, { method: "DELETE" }),

  listUsers: () => api<AdminUser[]>("/users"),
  createUser: (data: AdminUser) => api<AdminUser>("/users", { method: "POST", body: JSON.stringify(data) }),
  updateUser: (id: number, data: AdminUser) => api<AdminUser>(`/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteUser: (id: number) => api(`/users/${id}`, { method: "DELETE" }),

  getAnalytics: () => api<AnalyticsData>("/analytics"),

  getSmtp: () => api<SmtpConfig>("/smtp"),
  saveSmtp: (data: SmtpConfig) => api("/smtp", { method: "PUT", body: JSON.stringify(data) }),
  testSmtp: (to: string) => api("/smtp/test", { method: "POST", body: JSON.stringify({ to }) }),

  getAppearance: () => api<AppearanceConfig>("/appearance"),
  saveAppearance: (data: AppearanceConfig) => api("/appearance", { method: "PUT", body: JSON.stringify(data) }),

  getSettings: () => api<SiteSettings>("/settings"),
  saveSettings: (data: SiteSettings & { password?: string }) =>
    api("/settings", { method: "PUT", body: JSON.stringify(data) }),

  getCustomization: () => api<CustomizationConfig>("/customization"),
  saveCustomization: (data: CustomizationConfig) =>
    api("/customization", { method: "PUT", body: JSON.stringify(data) }),

  getFooter: () => api<FooterConfig>("/footer"),
  saveFooter: (data: FooterConfig) =>
    api("/footer", { method: "PUT", body: JSON.stringify(data) }),
};

export const publicApi = {
  getPortfolio: () => api<Record<string, unknown>>("/portfolio"),
  sendContact: (data: { name: string; email: string; subject?: string; body: string }) =>
    api("/contact", { method: "POST", body: JSON.stringify(data) }),
};
import { Router, type RequestHandler } from "express";
import bcrypt from "bcryptjs";
import { getDb } from "../db";
import { formatRelativeTime, requireAuth, signToken } from "../middleware/auth";
import {
  createCrudRoutes,
  getSingleton,
  parseJsonField,
  updateSingleton,
} from "./helpers";

const router = Router();

/* ── Auth ── */
const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password required" });
      return;
    }
    const user = await getDb()("admin_users").where({ email }).first();
    // if (!user) {
    //   res.status(401).json({ error: "Invalid credentials" });
    //   return;
    // }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    if (user.status === "Suspended") {
      res.status(403).json({ error: "Account suspended" });
      return;
    }
    await getDb()("admin_users").where({ id: user.id }).update({ last_active: getDb().fn.now() });
    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};

const me: RequestHandler = async (req, res) => {
  try {
    const user = await getDb()("admin_users").where({ id: req.auth!.userId }).first();
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};

router.post("/auth/login", login);
router.get("/auth/me", requireAuth, me);

/* ── Dashboard ── */
router.get("/dashboard", requireAuth, async (_req, res) => {
  try {
    const stats = await getDb()("analytics_stats")
      .whereIn("stat_key", ["dashboard_visitors", "dashboard_projects", "dashboard_messages", "dashboard_conversion"])
      .orderBy("id");
    const sections = await getDb()("section_visibility").orderBy("sort_order");
    const [projectCount, messageCount, unreadCount] = await Promise.all([
      getDb()("projects").count("* as c").first(),
      getDb()("messages").count("* as c").first(),
      getDb()("messages").where({ unread: true }).count("* as c").first(),
    ]);
    res.json({
      stats: stats.map((s) => ({ label: s.label, value: s.value, delta: s.delta, icon: s.stat_key.includes("visitor") ? "group" : s.stat_key.includes("project") ? "folder_open" : s.stat_key.includes("message") ? "chat_bubble" : "ads_click" })),
      sections: sections.map((s) => ({ id: s.id, key: s.section_key, title: s.title, icon: s.icon, subtitle: s.subtitle, published: !!s.published })),
      counts: { projects: Number(projectCount?.c || 0), messages: Number(messageCount?.c || 0), unread: Number(unreadCount?.c || 0) },
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.put("/dashboard/sections/:id", requireAuth, async (req, res) => {
  try {
    await getDb()("section_visibility").where({ id: req.params.id }).update({ published: !!req.body.published });
    const row = await getDb()("section_visibility").where({ id: req.params.id }).first();
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

/* ── Hero ── */
function mapHero(row: Record<string, unknown>) {
  return {
    tag: row.tag, name: row.name, role: row.role, desc: row.description,
    years: row.years, projects: row.projects, clients: row.clients,
    avatar: row.avatar_url, cta1: row.cta_primary, cta2: row.cta_secondary,
    cvUrl: row.cv_url, showStats: !!row.show_stats, showStack: !!row.show_stack,
    typing: !!row.typing_animation, floatCards: !!row.float_cards,
    accent: row.accent_color, techStack: row.tech_stack,
  };
}

router.get("/hero", requireAuth, async (_req, res) => {
  try {
    const row = await getSingleton("hero_section");
    res.json(row ? mapHero(row) : null);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.put("/hero", requireAuth, async (req, res) => {
  try {
    const b = req.body;
    await updateSingleton("hero_section", {
      tag: b.tag, name: b.name, role: b.role, description: b.desc,
      years: b.years, projects: b.projects, clients: b.clients,
      avatar_url: b.avatar, cta_primary: b.cta1, cta_secondary: b.cta2,
      cv_url: b.cvUrl, show_stats: b.showStats, show_stack: b.showStack,
      typing_animation: b.typing, float_cards: b.floatCards,
      accent_color: b.accent, tech_stack: b.techStack,
    });
    const row = await getSingleton("hero_section");
    res.json(mapHero(row!));
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

/* ── About ── */
function mapAbout(row: Record<string, unknown>) {
  return {
    title: row.title, tag: row.tag, bio: row.bio, longBio: row.long_bio,
    location: row.location, availability: row.availability, email: row.email,
    phone: row.phone, resume: row.resume_url, image: row.image_url,
    statValue: row.stat_value, statLabel: row.stat_label,
    languages: row.languages, interests: row.interests,
  };
}

router.get("/about", requireAuth, async (_req, res) => {
  try {
    const row = await getSingleton("about_section");
    res.json(row ? mapAbout(row) : null);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.put("/about", requireAuth, async (req, res) => {
  try {
    const b = req.body;
    await updateSingleton("about_section", {
      title: b.title, tag: b.tag, bio: b.bio, long_bio: b.longBio,
      location: b.location, availability: b.availability, email: b.email,
      phone: b.phone, resume_url: b.resume, image_url: b.image,
      stat_value: b.statValue, stat_label: b.statLabel,
      languages: b.languages, interests: b.interests,
    });
    const row = await getSingleton("about_section");
    res.json(mapAbout(row!));
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

/* ── CRUD tables ── */
router.use("/education", requireAuth, createCrudRoutes({
  table: "education",
  mapRow: (r) => ({ id: r.id, a: r.title, b: r.institution, c: r.year, d: r.description }),
  mapInput: (b) => ({ title: b.a, institution: b.b, year: b.c, description: b.d || "" }),
}));

router.use("/experience", requireAuth, createCrudRoutes({
  table: "experience",
  mapRow: (r) => ({ id: r.id, a: r.role, b: r.company, c: r.period, d: r.description }),
  mapInput: (b) => ({ role: b.a, company: b.b, period: b.c, description: b.d || "" }),
}));

router.use("/skills", requireAuth, createCrudRoutes({
  table: "skills",
  mapRow: (r) => ({ id: r.id, name: r.name, level: r.level, category: r.category, icon: r.icon }),
  mapInput: (b) => ({ name: b.name, level: b.level, category: b.category, icon: b.icon }),
}));

router.use("/projects", requireAuth, createCrudRoutes({
  table: "projects",
  mapRow: (r) => ({ id: r.id, title: r.title, tag: r.tag, img: r.image_url, desc: r.description, live: r.live_url || "", repo: r.repo_url || "", tech: r.tech, featured: !!r.featured }),
  mapInput: (b) => ({ title: b.title, tag: b.tag, image_url: b.img, description: b.desc, live_url: b.live || "", repo_url: b.repo || "", tech: b.tech, featured: !!b.featured }),
}));

router.use("/services", requireAuth, createCrudRoutes({
  table: "services",
  mapRow: (r) => ({ id: r.id, icon: r.icon, title: r.title, desc: r.description, price: r.price, visible: !!r.visible }),
  mapInput: (b) => ({ icon: b.icon, title: b.title, description: b.desc, price: b.price, visible: !!b.visible }),
}));

router.use("/messages", requireAuth, createCrudRoutes({
  table: "messages",
  orderBy: "created_at",
  mapRow: (r) => ({
    id: r.id, name: r.name, email: r.email, subject: r.subject,
    preview: r.preview, body: r.body, unread: !!r.unread,
    time: formatRelativeTime(r.created_at as string),
  }),
  mapInput: (b) => ({ name: b.name, email: b.email, subject: b.subject, body: b.body, preview: b.preview || (b.body as string)?.slice(0, 100) || "", unread: !!b.unread }),
}));

/* ── Users ── */
router.get("/users", requireAuth, async (_req, res) => {
  try {
    const rows = await getDb()("admin_users").orderBy("id");
    res.json(rows.map((u) => ({
      id: u.id, name: u.name, email: u.email, role: u.role, status: u.status,
      last: formatRelativeTime(u.last_active), avatar: u.avatar,
    })));
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.post("/users", requireAuth, async (req, res) => {
  try {
    const b = req.body;
    const hash = await bcrypt.hash("changeme", 10);
    const [id] = await getDb()("admin_users").insert({
      name: b.name, email: b.email, password_hash: hash,
      role: b.role || "Viewer", status: b.status || "Invited",
      avatar: b.avatar || (b.name?.[0] || "?").toUpperCase(),
    });
    const row = await getDb()("admin_users").where({ id }).first();
    res.status(201).json({ id: row.id, name: row.name, email: row.email, role: row.role, status: row.status, last: "—", avatar: row.avatar });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.put("/users/:id", requireAuth, async (req, res) => {
  try {
    const b = req.body;
    await getDb()("admin_users").where({ id: req.params.id }).update({
      name: b.name, email: b.email, role: b.role, status: b.status, avatar: b.avatar,
    });
    const row = await getDb()("admin_users").where({ id: req.params.id }).first();
    res.json({ id: row.id, name: row.name, email: row.email, role: row.role, status: row.status, last: formatRelativeTime(row.last_active), avatar: row.avatar });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.delete("/users/:id", requireAuth, async (req, res) => {
  try {
    if (Number(req.params.id) === req.auth!.userId) {
      res.status(400).json({ error: "Cannot delete yourself" });
      return;
    }
    await getDb()("admin_users").where({ id: req.params.id }).del();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

/* ── Analytics ── */
router.get("/analytics", requireAuth, async (_req, res) => {
  try {
    const stats = await getDb()("analytics_stats")
      .whereIn("stat_key", ["page_views", "unique_visitors", "avg_session", "bounce_rate"])
      .orderBy("id");
    res.json({ stats: stats.map((s) => ({ label: s.label, value: s.value, delta: s.delta })) });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

/* ── SMTP ── */
router.get("/smtp", requireAuth, async (_req, res) => {
  try {
    const row = await getSingleton("smtp_config");
    if (!row) { res.json(null); return; }
    res.json({
      provider: row.provider, host: row.host, port: row.port,
      username: row.username || "", password: row.password || "",
      fromName: row.from_name, fromEmail: row.from_email, replyTo: row.reply_to, secure: !!row.secure,
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.put("/smtp", requireAuth, async (req, res) => {
  try {
    const b = req.body;
    await updateSingleton("smtp_config", {
      provider: b.provider, host: b.host, port: b.port,
      username: b.username, password: b.password,
      from_name: b.fromName, from_email: b.fromEmail, reply_to: b.replyTo, secure: b.secure,
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.post("/smtp/test", requireAuth, async (req, res) => {
  res.json({ ok: true, message: `Test email queued to ${req.body.to || "test@example.com"}` });
});

/* ── Appearance ── */
router.get("/appearance", requireAuth, async (_req, res) => {
  try {
    const row = await getSingleton("appearance_config");
    if (!row) { res.json(null); return; }
    res.json({
      mode: row.color_mode, palette: row.palette_index, radius: row.corner_radius,
      density: row.density, bgAnim: row.bg_animation, animSpeed: row.anim_speed,
      animIntensity: row.anim_intensity, parallax: !!row.parallax,
      reducedMotion: !!row.reduced_motion, scrollReveal: !!row.scroll_reveal, hover3d: !!row.hover_3d,
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.put("/appearance", requireAuth, async (req, res) => {
  try {
    const b = req.body;
    await updateSingleton("appearance_config", {
      color_mode: b.mode, palette_index: b.palette, corner_radius: b.radius,
      density: b.density, bg_animation: b.bgAnim, anim_speed: b.animSpeed,
      anim_intensity: b.animIntensity, parallax: b.parallax,
      reduced_motion: b.reducedMotion, scroll_reveal: b.scrollReveal, hover_3d: b.hover3d,
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

/* ── Settings ── */
router.get("/settings", requireAuth, async (_req, res) => {
  try {
    const row = await getSingleton("site_settings");
    if (!row) { res.json(null); return; }
    res.json({
      accountName: row.account_name, accountEmail: row.account_email,
      siteTitle: row.site_title, metaDescription: row.meta_description, keywords: row.keywords,
      emailNotifications: !!row.email_notifications, showAnalyticsWidget: !!row.show_analytics_widget,
      allowIndexing: !!row.allow_indexing,
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.put("/settings", requireAuth, async (req, res) => {
  try {
    const b = req.body;
    const data: Record<string, unknown> = {
      account_name: b.accountName, account_email: b.accountEmail,
      site_title: b.siteTitle, meta_description: b.metaDescription, keywords: b.keywords,
      email_notifications: b.emailNotifications, show_analytics_widget: b.showAnalyticsWidget,
      allow_indexing: b.allowIndexing,
    };
    if (b.password && b.password !== "••••••••") {
      const hash = await bcrypt.hash(b.password, 10);
      await getDb()("admin_users").where({ id: req.auth!.userId }).update({ password_hash: hash });
    }
    await updateSingleton("site_settings", data);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

/* ── Customization ── */
router.get("/customization", requireAuth, async (_req, res) => {
  try {
    const row = await getSingleton("customization_config");
    if (!row) { res.json(null); return; }
    res.json({
      logoText: row.logo_text, favicon: row.favicon, ogImageUrl: row.og_image_url,
      tagline: row.tagline, navigation: parseJsonField(row.navigation, []),
      backgroundStyle: row.background_style, animationSpeed: row.animation_speed,
      floatingCards: !!row.floating_cards, typingAnimation: !!row.typing_animation,
      socialLinks: parseJsonField(row.social_links, []),
      customCss: row.custom_css || "", customHeadScripts: row.custom_head_scripts || "",
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.put("/customization", requireAuth, async (req, res) => {
  try {
    const b = req.body;
    await updateSingleton("customization_config", {
      logo_text: b.logoText, favicon: b.favicon, og_image_url: b.ogImageUrl,
      tagline: b.tagline, navigation: JSON.stringify(b.navigation),
      background_style: b.backgroundStyle, animation_speed: b.animationSpeed,
      floating_cards: b.floatingCards, typing_animation: b.typingAnimation,
      social_links: JSON.stringify(b.socialLinks),
      custom_css: b.customCss, custom_head_scripts: b.customHeadScripts,
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

/* ── Public portfolio (no auth) ── */
router.get("/portfolio", async (_req, res) => {
  try {
    const db = getDb();
    const [hero, about, education, experience, skills, projects, services, customization] = await Promise.all([
      getSingleton("hero_section"), getSingleton("about_section"),
      db("education").orderBy("sort_order"), db("experience").orderBy("sort_order"),
      db("skills").orderBy("sort_order"), db("projects").orderBy("sort_order"),
      db("services").where({ visible: true }).orderBy("sort_order"),
      getSingleton("customization_config"),
    ]);
    res.json({
      hero: hero ? mapHero(hero) : null,
      about: about ? mapAbout(about) : null,
      education: education.map((r) => ({ id: r.id, a: r.title, b: r.institution, c: r.year, d: r.description })),
      experience: experience.map((r) => ({ id: r.id, a: r.role, b: r.company, c: r.period, d: r.description })),
      skills: skills.map((r) => ({ id: r.id, name: r.name, level: r.level, category: r.category, icon: r.icon })),
      projects: projects.map((r) => ({ id: r.id, title: r.title, tag: r.tag, img: r.image_url, desc: r.description, live: r.live_url, repo: r.repo_url, tech: r.tech, featured: !!r.featured })),
      services: services.map((r) => ({ id: r.id, icon: r.icon, title: r.title, desc: r.description, price: r.price })),
      customization: customization ? {
        logoText: customization.logo_text, tagline: customization.tagline,
        socialLinks: parseJsonField(customization.social_links, []),
      } : null,
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.post("/contact", async (req, res) => {
  try {
    const { name, email, subject, body } = req.body;
    if (!name || !email || !body) {
      res.status(400).json({ error: "Name, email, and message required" });
      return;
    }
    const preview = body.slice(0, 100);
    await getDb()("messages").insert({
      name, email, subject: subject || "Contact form", body, preview, unread: true,
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export default router;

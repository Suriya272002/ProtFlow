import type { Knex } from "knex";
import bcrypt from "bcryptjs";

export async function seed(knex: Knex): Promise<void> {
  await knex("admin_users").del();
  await knex("hero_section").del();
  await knex("about_section").del();
  await knex("education").del();
  await knex("experience").del();
  await knex("skills").del();
  await knex("projects").del();
  await knex("services").del();
  await knex("messages").del();
  await knex("smtp_config").del();
  await knex("appearance_config").del();
  await knex("site_settings").del();
  await knex("customization_config").del();
  await knex("section_visibility").del();
  await knex("analytics_stats").del();

  const passwordHash = await bcrypt.hash("admin", 10);

  await knex("admin_users").insert([
    { name: "Alex Morgan", email: "admin@portfolio.dev", password_hash: passwordHash, role: "Owner", status: "Active", avatar: "A", last_active: knex.fn.now() },
    { name: "Sarah Williams", email: "sarah@studio.io", password_hash: passwordHash, role: "Editor", status: "Active", avatar: "S", last_active: knex.raw("DATE_SUB(NOW(), INTERVAL 2 HOUR)") },
    { name: "David Chen", email: "david@vrlabs.com", password_hash: passwordHash, role: "Viewer", status: "Active", avatar: "D", last_active: knex.raw("DATE_SUB(NOW(), INTERVAL 1 DAY)") },
    { name: "Elena Rodriguez", email: "elena@designweek.org", password_hash: passwordHash, role: "Editor", status: "Invited", avatar: "E", last_active: null },
    { name: "Marcus Kim", email: "marcus@startup.co", password_hash: passwordHash, role: "Viewer", status: "Suspended", avatar: "M", last_active: knex.raw("DATE_SUB(NOW(), INTERVAL 5 DAY)") },
  ]);

  await knex("hero_section").insert({
    tag: "Hello, It's Me",
    name: "Alex Morgan",
    role: "Full Stack Developer & 3D Designer",
    description: "I create immersive digital experiences with modern technologies and beautiful 3D animations. Specializing in the intersection of code and visual art.",
    years: "3+",
    projects: "30+",
    clients: "20+",
    avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTV4dOlVZZQ6R1MeCj_bizBDfUqKVytS9-WED8VuXrLBKOcduycsryW53f1SehopltWRY8jGQqOojVFk0cL29D_-PmscGoE8N_bdFc3KGRaihHE_8DlQx2bnPZuGZ8bAUB-HGfUbTKg9n62VBAfPlTkFn2o647bWlNFvoHmrqQeC-XJS7_5n4G1PLy4IGmdpOV2-dX5Ao_4_f1Z270qpktAnCedLvZmpGHzoh7v83-I4RKxAgX7DBcLJGEnyHsHVIWbHvzCVmBWSfv",
    cta_primary: "Hire Me",
    cta_secondary: "Download CV",
    cv_url: "https://example.com/resume.pdf",
    show_stats: true,
    show_stack: true,
    typing_animation: false,
    float_cards: true,
    accent_color: "Lavender",
    tech_stack: "JavaScript, React, Three.js, Node.js, TypeScript",
  });

  await knex("about_section").insert({
    title: "About Me",
    tag: "Get To Know Me",
    bio: "I'm a passionate Full Stack Developer & 3D Designer who loves building interactive, modern and beautiful web experiences. I specialize in React, Next.js, Three.js and Node.js.",
    long_bio: "Over 3+ years I've delivered 30+ projects for clients across the globe — from startups to enterprises — focusing on performance, motion, and pixel-perfect detail.",
    location: "San Francisco, CA",
    availability: "Open to opportunities",
    email: "hello@alexmorgan.dev",
    phone: "+1 (555) 010-2025",
    resume_url: "https://example.com/resume.pdf",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCBBu6aAzqIOEjOyaMYW7sjIp1xZIoCSqSwiWwIB9pFWvooquI87zmyDT2-GXoIMwl1xFv-8IVc17eKnOWivK51xf7KKcGaX3NLGqIJA",
    stat_value: "30+",
    stat_label: "Projects Successfully Delivered",
    languages: "English, Spanish",
    interests: "Generative art, climbing, electronic music",
  });

  await knex("education").insert([
    { title: "MSc Computer Science", institution: "Stanford University", year: "2020 — 2022", description: "Specialized in HCI and computer graphics. Graduated with honors.", sort_order: 0 },
    { title: "BSc Software Engineering", institution: "UC Berkeley", year: "2016 — 2020", description: "Top of class, Dean's List four years running.", sort_order: 1 },
  ]);

  await knex("experience").insert([
    { role: "Senior Frontend Engineer", company: "Vercel", period: "2023 — Present", description: "Leading the design-systems team across Next.js dashboards.", sort_order: 0 },
    { role: "UI Engineer", company: "Linear", period: "2021 — 2023", description: "Shipped the timeline and roadmap surfaces used by 30k+ teams.", sort_order: 1 },
    { role: "Junior Developer", company: "Airbnb", period: "2019 — 2021", description: "Worked on the host onboarding experience and growth funnels.", sort_order: 2 },
  ]);

  await knex("skills").insert([
    { name: "React / TanStack", level: 95, category: "Frontend", icon: "code", sort_order: 0 },
    { name: "TypeScript", level: 90, category: "Language", icon: "javascript", sort_order: 1 },
    { name: "Three.js / WebGL", level: 80, category: "3D / Graphics", icon: "view_in_ar", sort_order: 2 },
    { name: "Node.js", level: 85, category: "Backend", icon: "dns", sort_order: 3 },
    { name: "Figma", level: 75, category: "Design", icon: "palette", sort_order: 4 },
  ]);

  await knex("projects").insert([
    { title: "Nebula Dashboard", tag: "Web App", image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600", description: "Analytics dashboard with realtime charts and 3D data viz.", live_url: "https://nebula.app", repo_url: "https://github.com/alex/nebula", tech: "React, D3, Three.js", featured: true, sort_order: 0 },
    { title: "VR Configurator", tag: "3D / WebGL", image_url: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=600", description: "Immersive product configurator in WebXR.", live_url: "https://vr.demo", repo_url: "https://github.com/alex/vrc", tech: "Three.js, WebXR", featured: true, sort_order: 1 },
    { title: "Brand System", tag: "Design", image_url: "https://images.unsplash.com/photo-1561070791-2526d30994b8?w=600", description: "End-to-end identity and design tokens.", live_url: "", repo_url: "", tech: "Figma, Tokens Studio", featured: false, sort_order: 2 },
    { title: "AI Studio", tag: "SaaS", image_url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600", description: "Prompt-driven creative tools for marketers.", live_url: "https://ai.studio", repo_url: "", tech: "Next.js, OpenAI", featured: true, sort_order: 3 },
  ]);

  await knex("services").insert([
    { icon: "code", title: "Web Development", description: "Full-stack apps with React, TanStack, Node.", price: "from $2,500", visible: true, sort_order: 0 },
    { icon: "view_in_ar", title: "3D Experiences", description: "Immersive Three.js / WebGL worlds.", price: "from $4,000", visible: true, sort_order: 1 },
    { icon: "palette", title: "UI / UX Design", description: "Interfaces that feel as good as they look.", price: "from $1,800", visible: true, sort_order: 2 },
    { icon: "rocket_launch", title: "Performance", description: "Audits and optimization for fast sites.", price: "from $1,200", visible: false, sort_order: 3 },
  ]);

  await knex("messages").insert([
    { name: "Sarah Williams", email: "sarah@studio.io", subject: "Collaboration on 3D Tesla project", preview: "Hey Alex, I loved your 3D work on the Tesla project. Would love to chat about a collaboration.", body: "Hey Alex, I loved your 3D work on the Tesla project. Would love to chat about a collaboration — we're scoping a configurator for an EV brand and your aesthetic is exactly what we need.", unread: true, created_at: knex.raw("DATE_SUB(NOW(), INTERVAL 15 MINUTE)") },
    { name: "David Chen", email: "david@vrlabs.com", subject: "VR onboarding for SaaS", preview: "Looking for a developer to help build a VR onboarding experience for our SaaS product.", body: "Hi Alex — we're VR Labs and we're rebuilding our onboarding into a WebXR experience. Budget is flexible and timeline is Q4. Can we book a call?", unread: true, created_at: knex.raw("DATE_SUB(NOW(), INTERVAL 1 HOUR)") },
    { name: "Elena Rodriguez", email: "elena@designweek.org", subject: "Interview request", preview: "We'd love to interview you for our next issue on emerging 3D web designers.", body: "Hi Alex, Design Week Magazine here. Our next issue covers emerging 3D web designers — would you be open to a 30-minute interview?", unread: true, created_at: knex.raw("DATE_SUB(NOW(), INTERVAL 3 HOUR)") },
    { name: "Marcus Kim", email: "marcus@startup.co", subject: "Dashboard redesign follow-up", preview: "Following up on our discussion about the dashboard redesign.", body: "Quick follow up — are we still aligned on shipping the dashboard refresh by end of month?", unread: false, created_at: knex.raw("DATE_SUB(NOW(), INTERVAL 1 DAY)") },
    { name: "Priya Patel", email: "priya@agency.com", subject: "Thanks!", preview: "Thank you for the quick turnaround on the landing page!", body: "Just wanted to say thank you for the lightning-fast landing page delivery. The team is thrilled.", unread: false, created_at: knex.raw("DATE_SUB(NOW(), INTERVAL 2 DAY)") },
  ]);

  await knex("smtp_config").insert({
    provider: "Custom SMTP",
    host: "smtp.example.com",
    port: "587",
    username: "",
    password: "",
    from_name: "Alex Morgan",
    from_email: "hello@alexmorgan.dev",
    reply_to: "alex@morgan.dev",
    secure: true,
  });

  await knex("appearance_config").insert({
    color_mode: "dark",
    palette_index: 0,
    corner_radius: 16,
    density: "Comfortable",
    bg_animation: "orbs",
    anim_speed: 60,
    anim_intensity: 50,
    parallax: true,
    reduced_motion: false,
    scroll_reveal: true,
    hover_3d: true,
  });

  await knex("site_settings").insert({
    account_name: "Alex Morgan",
    account_email: "alex@morgan.dev",
    site_title: "Alex Morgan | Portfolio",
    meta_description: "Full Stack Developer & 3D Designer.",
    keywords: "react, three.js, web design",
    email_notifications: true,
    show_analytics_widget: false,
    allow_indexing: true,
  });

  await knex("customization_config").insert({
    logo_text: "PORTFOLIO.",
    favicon: "/favicon.ico",
    og_image_url: "https://example.com/og.png",
    tagline: "Crafting immersive 3D web.",
    navigation: JSON.stringify([
      { label: "Home", visible: true },
      { label: "About", visible: true },
      { label: "Education", visible: true },
      { label: "Skills", visible: true },
      { label: "Projects", visible: true },
      { label: "Contact", visible: true },
    ]),
    background_style: "Animated Orbs",
    animation_speed: 60,
    floating_cards: true,
    typing_animation: false,
    social_links: JSON.stringify([
      { icon: "code", label: "GitHub", url: "https://github.com/alexmorgan" },
      { icon: "alternate_email", label: "Twitter / X", url: "https://x.com/alex" },
      { icon: "business_center", label: "LinkedIn", url: "https://linkedin.com/in/alex" },
      { icon: "photo_camera", label: "Dribbble", url: "https://dribbble.com/alex" },
    ]),
    custom_css: "",
    custom_head_scripts: "",
  });

  await knex("section_visibility").insert([
    { section_key: "hero", title: "Hero Section", icon: "token", subtitle: "Last updated 2 days ago", published: true, sort_order: 0 },
    { section_key: "about", title: "About Me", icon: "person", subtitle: "Contains personal bio and skills", published: true, sort_order: 1 },
    { section_key: "projects", title: "Case Studies", icon: "work", subtitle: "High-detail project views", published: false, sort_order: 2 },
    { section_key: "services", title: "Services", icon: "handshake", subtitle: "What I offer to clients", published: true, sort_order: 3 },
  ]);

  await knex("analytics_stats").insert([
    { stat_key: "page_views", label: "Page Views", value: "48.2k", delta: "+22%" },
    { stat_key: "unique_visitors", label: "Unique Visitors", value: "12,540", delta: "+12%" },
    { stat_key: "avg_session", label: "Avg. Session", value: "3m 42s", delta: "+8%" },
    { stat_key: "bounce_rate", label: "Bounce Rate", value: "32%", delta: "-4%" },
    { stat_key: "dashboard_visitors", label: "Total Visitors", value: "12,540", delta: "+12.5%" },
    { stat_key: "dashboard_projects", label: "Projects", value: "28", delta: "+8.2%" },
    { stat_key: "dashboard_messages", label: "Messages", value: "146", delta: "+18.7%" },
    { stat_key: "dashboard_conversion", label: "Conversion", value: "3.8%", delta: "+2.4%" },
  ]);
}

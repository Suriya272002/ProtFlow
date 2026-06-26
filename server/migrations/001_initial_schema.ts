import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("admin_users", (t) => {
    t.increments("id").primary();
    t.string("name", 255).notNullable();
    t.string("email", 255).notNullable().unique();
    t.string("password_hash", 255).notNullable();
    t.string("role", 50).notNullable().defaultTo("Viewer");
    t.string("status", 50).notNullable().defaultTo("Active");
    t.string("avatar", 10).notNullable().defaultTo("?");
    t.timestamp("last_active").nullable();
    t.timestamps(true, true);
  });

  await knex.schema.createTable("hero_section", (t) => {
    t.increments("id").primary();
    t.string("tag", 255).notNullable();
    t.string("name", 255).notNullable();
    t.string("role", 500).notNullable();
    t.text("description").notNullable();
    t.string("years", 50).notNullable();
    t.string("projects", 50).notNullable();
    t.string("clients", 50).notNullable();
    t.text("avatar_url").notNullable();
    t.string("cta_primary", 100).notNullable();
    t.string("cta_secondary", 100).notNullable();
    t.text("cv_url").notNullable();
    t.boolean("show_stats").notNullable().defaultTo(true);
    t.boolean("show_stack").notNullable().defaultTo(true);
    t.boolean("typing_animation").notNullable().defaultTo(false);
    t.boolean("float_cards").notNullable().defaultTo(true);
    t.string("accent_color", 100).notNullable();
    t.text("tech_stack").notNullable();
    t.timestamps(true, true);
  });

  await knex.schema.createTable("about_section", (t) => {
    t.increments("id").primary();
    t.string("title", 255).notNullable();
    t.string("tag", 255).notNullable();
    t.text("bio").notNullable();
    t.text("long_bio").notNullable();
    t.string("location", 255).notNullable();
    t.string("availability", 255).notNullable();
    t.string("email", 255).notNullable();
    t.string("phone", 100).notNullable();
    t.text("resume_url").notNullable();
    t.text("image_url").notNullable();
    t.string("stat_value", 50).notNullable();
    t.string("stat_label", 255).notNullable();
    t.string("languages", 255).notNullable();
    t.string("interests", 500).notNullable();
    t.timestamps(true, true);
  });

  await knex.schema.createTable("education", (t) => {
    t.increments("id").primary();
    t.string("title", 500).notNullable();
    t.string("institution", 500).notNullable();
    t.string("year", 100).notNullable();
    t.text("description").nullable();
    t.integer("sort_order").notNullable().defaultTo(0);
    t.timestamps(true, true);
  });

  await knex.schema.createTable("experience", (t) => {
    t.increments("id").primary();
    t.string("role", 500).notNullable();
    t.string("company", 500).notNullable();
    t.string("period", 100).notNullable();
    t.text("description").nullable();
    t.integer("sort_order").notNullable().defaultTo(0);
    t.timestamps(true, true);
  });

  await knex.schema.createTable("skills", (t) => {
    t.increments("id").primary();
    t.string("name", 255).notNullable();
    t.integer("level").notNullable().defaultTo(50);
    t.string("category", 100).notNullable();
    t.string("icon", 100).notNullable();
    t.integer("sort_order").notNullable().defaultTo(0);
    t.timestamps(true, true);
  });

  await knex.schema.createTable("projects", (t) => {
    t.increments("id").primary();
    t.string("title", 500).notNullable();
    t.string("tag", 100).notNullable();
    t.text("image_url").notNullable();
    t.text("description").notNullable();
    t.text("live_url").nullable();
    t.text("repo_url").nullable();
    t.string("tech", 500).notNullable();
    t.boolean("featured").notNullable().defaultTo(false);
    t.integer("sort_order").notNullable().defaultTo(0);
    t.timestamps(true, true);
  });

  await knex.schema.createTable("services", (t) => {
    t.increments("id").primary();
    t.string("icon", 100).notNullable();
    t.string("title", 255).notNullable();
    t.text("description").notNullable();
    t.string("price", 100).notNullable();
    t.boolean("visible").notNullable().defaultTo(true);
    t.integer("sort_order").notNullable().defaultTo(0);
    t.timestamps(true, true);
  });

  await knex.schema.createTable("messages", (t) => {
    t.increments("id").primary();
    t.string("name", 255).notNullable();
    t.string("email", 255).notNullable();
    t.string("subject", 500).notNullable();
    t.text("body").notNullable();
    t.text("preview").notNullable();
    t.boolean("unread").notNullable().defaultTo(true);
    t.timestamps(true, true);
  });

  await knex.schema.createTable("smtp_config", (t) => {
    t.increments("id").primary();
    t.string("provider", 100).notNullable();
    t.string("host", 255).notNullable();
    t.string("port", 10).notNullable();
    t.string("username", 255).nullable();
    t.string("password", 255).nullable();
    t.string("from_name", 255).notNullable();
    t.string("from_email", 255).notNullable();
    t.string("reply_to", 255).notNullable();
    t.boolean("secure").notNullable().defaultTo(true);
    t.timestamps(true, true);
  });

  await knex.schema.createTable("appearance_config", (t) => {
    t.increments("id").primary();
    t.string("color_mode", 20).notNullable().defaultTo("dark");
    t.integer("palette_index").notNullable().defaultTo(0);
    t.integer("corner_radius").notNullable().defaultTo(16);
    t.string("density", 50).notNullable().defaultTo("Comfortable");
    t.string("bg_animation", 50).notNullable().defaultTo("orbs");
    t.integer("anim_speed").notNullable().defaultTo(60);
    t.integer("anim_intensity").notNullable().defaultTo(50);
    t.boolean("parallax").notNullable().defaultTo(true);
    t.boolean("reduced_motion").notNullable().defaultTo(false);
    t.boolean("scroll_reveal").notNullable().defaultTo(true);
    t.boolean("hover_3d").notNullable().defaultTo(true);
    t.timestamps(true, true);
  });

  await knex.schema.createTable("site_settings", (t) => {
    t.increments("id").primary();
    t.string("account_name", 255).notNullable();
    t.string("account_email", 255).notNullable();
    t.string("site_title", 255).notNullable();
    t.text("meta_description").notNullable();
    t.string("keywords", 500).notNullable();
    t.boolean("email_notifications").notNullable().defaultTo(true);
    t.boolean("show_analytics_widget").notNullable().defaultTo(false);
    t.boolean("allow_indexing").notNullable().defaultTo(true);
    t.timestamps(true, true);
  });

  await knex.schema.createTable("customization_config", (t) => {
    t.increments("id").primary();
    t.string("logo_text", 100).notNullable();
    t.string("favicon", 255).notNullable();
    t.text("og_image_url").nullable();
    t.string("tagline", 500).notNullable();
    t.json("navigation").notNullable();
    t.string("background_style", 100).notNullable();
    t.integer("animation_speed").notNullable().defaultTo(60);
    t.boolean("floating_cards").notNullable().defaultTo(true);
    t.boolean("typing_animation").notNullable().defaultTo(false);
    t.json("social_links").notNullable();
    t.text("custom_css").nullable();
    t.text("custom_head_scripts").nullable();
    t.timestamps(true, true);
  });

  await knex.schema.createTable("section_visibility", (t) => {
    t.increments("id").primary();
    t.string("section_key", 100).notNullable().unique();
    t.string("title", 255).notNullable();
    t.string("icon", 100).notNullable();
    t.string("subtitle", 500).notNullable();
    t.boolean("published").notNullable().defaultTo(true);
    t.integer("sort_order").notNullable().defaultTo(0);
    t.timestamps(true, true);
  });

  await knex.schema.createTable("analytics_stats", (t) => {
    t.increments("id").primary();
    t.string("stat_key", 100).notNullable().unique();
    t.string("label", 255).notNullable();
    t.string("value", 100).notNullable();
    t.string("delta", 50).notNullable();
    t.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  const tables = [
    "analytics_stats",
    "section_visibility",
    "customization_config",
    "site_settings",
    "appearance_config",
    "smtp_config",
    "messages",
    "services",
    "projects",
    "skills",
    "experience",
    "education",
    "about_section",
    "hero_section",
    "admin_users",
  ];
  for (const table of tables) {
    await knex.schema.dropTableIfExists(table);
  }
}

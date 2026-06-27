import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("footer_config", (t) => {
    t.increments("id").primary();
    t.string("tagline", 500).notNullable().defaultTo("Engineered with Precision.");
    t.string("copyright_name", 255).notNullable().defaultTo("Alex Morgan");
    t.string("copyright_year", 10).notNullable().defaultTo("2024");
    t.json("links").notNullable().defaultTo("[]");
    t.json("social_links").notNullable().defaultTo("[]");
    t.boolean("show_social").notNullable().defaultTo(true);
    t.boolean("show_links").notNullable().defaultTo(true);
    t.boolean("show_back_to_top").notNullable().defaultTo(true);
    t.timestamps(true, true);
  });

  // Insert default row
  await knex("footer_config").insert({
    tagline: "Engineered with Precision.",
    copyright_name: "Alex Morgan",
    copyright_year: new Date().getFullYear().toString(),
    links: JSON.stringify([
      { label: "Privacy Policy", url: "#" },
      { label: "Terms of Service", url: "#" },
      { label: "GitHub", url: "#" },
      { label: "LinkedIn", url: "#" },
    ]),
    social_links: JSON.stringify([]),
    show_social: true,
    show_links: true,
    show_back_to_top: true,
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("footer_config");
}
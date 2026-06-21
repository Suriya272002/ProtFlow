import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("settings", (table) => {
    table.increments("id").primary();
    table.string("shop_name", 200).notNullable();
    table.text("logo").nullable();
    table.string("email", 100).nullable();
    table.string("phone", 20).nullable();
    table.text("address").nullable();
    table.string("city", 100).nullable();
    table.string("zip_code", 20).nullable();
    table.string("website", 200).nullable();
    table.json("opening_hours").nullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("settings");
}

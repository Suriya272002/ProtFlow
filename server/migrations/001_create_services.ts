import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("services", (table) => {
    table.increments("id").primary();
    table.string("name", 100).notNullable();
    table.text("description").nullable();
    table
      .enum("category", ["washing", "ironing", "dry-clean", "other"])
      .notNullable();
    table.decimal("price", 10, 2).notNullable();
    table.boolean("enabled").defaultTo(true);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("services");
}

import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("staff", (table) => {
    table.increments("id").primary();
    table.string("name", 100).notNullable();
    table.string("email", 100).notNullable().unique();
    table.string("phone", 20).notNullable();
    table.enum("role", ["manager", "staff", "operator"]).defaultTo("staff");
    table.json("permissions").defaultTo("[]");
    table.boolean("active").defaultTo(true);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("staff");
}

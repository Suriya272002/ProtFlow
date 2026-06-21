import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable("users");
  if (!exists) {
    return knex.schema.createTable("users", (table) => {
      table.increments("id").primary();
      table.string("username", 100).notNullable().unique();
      table.string("name", 100).notNullable();
      table.string("email", 100).notNullable().unique();
      table.string("password", 255).notNullable();
      table.enum("role", ["admin", "user"]).defaultTo("user");
      table.boolean("active").defaultTo(true);
      table.timestamps(true, true);
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("users");
}

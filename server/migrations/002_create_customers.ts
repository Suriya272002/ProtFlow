import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("customers", (table) => {
    table.increments("id").primary();
    table.string("name", 100).notNullable();
    table.string("email", 100).nullable().unique();
    table.string("phone", 20).notNullable();
    table.text("address").nullable();
    table.integer("total_orders").defaultTo(0);
    table.decimal("total_spent", 12, 2).defaultTo(0);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("customers");
}

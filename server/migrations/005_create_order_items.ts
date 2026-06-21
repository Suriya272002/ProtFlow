import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("order_items", (table) => {
    table.increments("id").primary();
    table
      .integer("order_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("orders")
      .onDelete("CASCADE");
    table
      .integer("service_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("services")
      .onDelete("CASCADE");
    table.integer("quantity").notNullable().defaultTo(1);
    table.decimal("price", 10, 2).notNullable();
    table.decimal("subtotal", 12, 2).notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("order_items");
}

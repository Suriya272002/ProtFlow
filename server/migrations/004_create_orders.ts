import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("orders", (table) => {
    table.increments("id").primary();
    table.string("order_number", 50).unique().notNullable();
    table
      .integer("customer_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("customers")
      .onDelete("CASCADE");
    table.enum("order_type", ["laundry", "dry-clean", "mixed"]).notNullable();
    table
      .enum("status", ["pending", "processing", "ready", "delivered"])
      .defaultTo("pending");
    table.decimal("total_amount", 12, 2).notNullable();
    table.text("notes").nullable();
    table.date("completion_date").nullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("orders");
}

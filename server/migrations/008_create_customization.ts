import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable("customization");
  if (!exists) {
    return knex.schema.createTable("customization", (table) => {
      table.increments("id").primary();
      table.string("app_name", 100).defaultTo("MS Laundry");
      table.string("primary_color", 20).defaultTo("#3b82f6");
      table.string("secondary_color", 20).defaultTo("#1f2937");
      table.string("accent_color", 20).defaultTo("#10b981");
      table.boolean("dark_mode_enabled").defaultTo(false);
      table.boolean("enable_customer_portal").defaultTo(true);
      table.boolean("enable_order_tracking").defaultTo(true);
      table.boolean("enable_notifications").defaultTo(true);
      table.boolean("enable_reports").defaultTo(true);
      table.boolean("enable_staff_management").defaultTo(true);
      table.boolean("enable_loyalty_program").defaultTo(false);
      table.string("default_order_type", 20).defaultTo("mixed");
      table.integer("min_order_amount").defaultTo(100);
      table.integer("default_delivery_days").defaultTo(2);
      table.boolean("enable_express_service").defaultTo(true);
      table.integer("express_service_charge").defaultTo(50);
      table.boolean("notify_order_received").defaultTo(true);
      table.boolean("notify_order_ready").defaultTo(true);
      table.boolean("notify_order_delivered").defaultTo(true);
      table.boolean("notify_low_inventory").defaultTo(true);
      table.string("admin_email", 100).nullable();
      table.boolean("send_daily_summary").defaultTo(true);
      table.string("summary_email_time", 10).defaultTo("09:00");
      table.integer("items_per_page").defaultTo(10);
      table.string("date_format", 20).defaultTo("DD/MM/YYYY");
      table.string("currency", 10).defaultTo("INR");
      table.boolean("auto_generate_invoice").defaultTo(true);
      table.boolean("allow_customer_edits").defaultTo(true);
      table.timestamps(true, true);
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("customization");
}

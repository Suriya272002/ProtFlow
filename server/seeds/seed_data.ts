import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Disable FK checks for clean re-seed (MySQL)
  await knex.raw("SET FOREIGN_KEY_CHECKS = 0");
  await knex("order_items").truncate();
  await knex("orders").truncate();
  await knex("staff").truncate();
  await knex("customers").truncate();
  await knex("services").truncate();
  await knex("settings").truncate();
  await knex.raw("SET FOREIGN_KEY_CHECKS = 1");

  // Insert services one-by-one to capture MySQL lastInsertId
  const serviceInserts = [
    { name: "Washing", category: "washing", price: 80, enabled: true, description: "Regular washing service" },
    { name: "Dry Cleaning", category: "dry-clean", price: 150, enabled: true, description: "Professional dry cleaning" },
    { name: "Ironing", category: "ironing", price: 40, enabled: true, description: "Premium ironing service" },
    { name: "Starch Service", category: "other", price: 30, enabled: true, description: "Starch application service" },
    { name: "Alteration", category: "other", price: 200, enabled: true, description: "Clothing alteration and repairs" },
  ];

  const serviceIds: number[] = [];
  for (const s of serviceInserts) {
    const [id] = await knex("services").insert(s);
    serviceIds.push(id);
  }

  // Insert customers
  const customerInserts = [
    { name: "Rajesh Kumar", phone: "+91 98765 43210", email: "rajesh@example.com", address: "123 Main Street, New Delhi", total_orders: 12, total_spent: 4800 },
    { name: "Priya Sharma", phone: "+91 98765 43211", email: "priya@example.com", address: "456 Park Avenue, Delhi", total_orders: 8, total_spent: 3200 },
    { name: "Amit Patel", phone: "+91 98765 43212", email: "amit@example.com", address: "789 Business Park, Delhi", total_orders: 15, total_spent: 6500 },
    { name: "Neha Singh", phone: "+91 98765 43213", email: "neha@example.com", address: "321 Residential Area, Delhi", total_orders: 5, total_spent: 2100 },
  ];

  const customerIds: number[] = [];
  for (const c of customerInserts) {
    const [id] = await knex("customers").insert(c);
    customerIds.push(id);
  }

  // Insert staff
  await knex("staff").insert([
    { name: "Rajesh Verma", email: "rajesh@mslaundry.com", phone: "+91 98765 43210", role: "manager", permissions: JSON.stringify(["all"]), active: true },
    { name: "Priya Negi", email: "priya@mslaundry.com", phone: "+91 98765 43211", role: "staff", permissions: JSON.stringify(["orders", "customers"]), active: true },
    { name: "Amit Sharma", email: "amit@mslaundry.com", phone: "+91 98765 43212", role: "operator", permissions: JSON.stringify(["orders"]), active: true },
  ]);

  // Insert orders
  const orderInserts = [
    { order_number: "2024-001", customer_id: customerIds[0], order_type: "laundry", status: "pending", total_amount: 450, notes: "Handle with care" },
    { order_number: "2024-002", customer_id: customerIds[1], order_type: "dry-clean", status: "processing", total_amount: 650 },
    { order_number: "2024-003", customer_id: customerIds[2], order_type: "mixed", status: "ready", total_amount: 890 },
    { order_number: "2024-004", customer_id: customerIds[3], order_type: "laundry", status: "delivered", total_amount: 320, completion_date: new Date().toISOString().split("T")[0] },
    { order_number: "2024-005", customer_id: customerIds[0], order_type: "laundry", status: "processing", total_amount: 540 },
  ];

  const orderIds: number[] = [];
  for (const o of orderInserts) {
    const [id] = await knex("orders").insert(o);
    orderIds.push(id);
  }

  // Insert order items
  await knex("order_items").insert([
    { order_id: orderIds[0], service_id: serviceIds[0], quantity: 5, price: 80, subtotal: 400 },
    { order_id: orderIds[0], service_id: serviceIds[2], quantity: 1, price: 40, subtotal: 40 },
    { order_id: orderIds[1], service_id: serviceIds[1], quantity: 3, price: 150, subtotal: 450 },
    { order_id: orderIds[1], service_id: serviceIds[3], quantity: 1, price: 30, subtotal: 30 },
    { order_id: orderIds[2], service_id: serviceIds[0], quantity: 4, price: 80, subtotal: 320 },
    { order_id: orderIds[2], service_id: serviceIds[1], quantity: 2, price: 150, subtotal: 300 },
    { order_id: orderIds[2], service_id: serviceIds[2], quantity: 2, price: 40, subtotal: 80 },
    { order_id: orderIds[3], service_id: serviceIds[0], quantity: 3, price: 80, subtotal: 240 },
    { order_id: orderIds[3], service_id: serviceIds[2], quantity: 1, price: 40, subtotal: 40 },
  ]);

  await knex("settings").insert([
    {
      shop_name: "MS Laundry & Dry Cleaning",
      email: "contact@mslaundry.com",
      phone: "+91 98765 43210",
      address: "123 Main Street, Downtown",
      city: "New Delhi",
      zip_code: "110001",
      website: "www.mslaundry.com",
      opening_hours: JSON.stringify({
        monday: { open: "08:00", close: "20:00", closed: false },
        tuesday: { open: "08:00", close: "20:00", closed: false },
        wednesday: { open: "08:00", close: "20:00", closed: false },
        thursday: { open: "08:00", close: "20:00", closed: false },
        friday: { open: "08:00", close: "20:00", closed: false },
        saturday: { open: "09:00", close: "19:00", closed: false },
        sunday: { open: "10:00", close: "18:00", closed: false },
      }),
    },
  ]);
}

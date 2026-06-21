import knex from "knex";
import "dotenv/config";

const db = knex({
  client: "pg",
  connection: process.env.DATABASE_URL || {
    host: process.env.PGHOST || "localhost",
    port: parseInt(process.env.PGPORT || "5432"),
    user: process.env.PGUSER || "postgres",
    password: process.env.PGPASSWORD || "",
    database: process.env.PGDATABASE || "laundry_shop",
  },
  pool: { min: 0, max: 7 },
});

export default db;

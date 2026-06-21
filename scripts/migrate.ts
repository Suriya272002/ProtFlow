import knex from "knex";
import "dotenv/config";

const db = knex({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "landery_shop",
  },
  migrations: {
    extension: "ts",
    directory: "./server/migrations",
  },
  seeds: {
    extension: "ts",
    directory: "./server/seeds",
  },
});

async function main() {
  const action = process.argv[2] || "migrate";
  try {
    if (action === "migrate") {
      console.log("Running migrations...");
      const [batchNo, log] = await db.migrate.latest();
      if (log.length === 0) {
        console.log("Already up to date.");
      } else {
        console.log(`Batch ${batchNo} run: ${log.length} migrations`);
        log.forEach((m: string) => console.log(" -", m));
      }
    } else if (action === "seed") {
      console.log("Running seeds...");
      const [log] = await db.seed.run();
      console.log(`Seeded: ${log.join(", ")}`);
    } else if (action === "rollback") {
      console.log("Rolling back...");
      const [batchNo, log] = await db.migrate.rollback();
      console.log(`Batch ${batchNo} rolled back: ${log.length} migrations`);
    }
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

main();

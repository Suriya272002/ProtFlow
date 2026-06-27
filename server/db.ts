import knex, { type Knex } from "knex";
import "dotenv/config";

function env(key: string, fallback = ""): string {
  return process.env[key] || fallback;
}

export function getDbConfig(): Knex.Config {
  return {
    client: "mysql2",
    connection: {
      host: env("DATABASE_HOST", env("DB_HOST", "localhost")),
      port: parseInt(env("DATABASE_PORT", env("DB_PORT", "3306"))),
      user: env("DATABASE_USER", env("DB_USER", "portflow_v3")),
      password: env("DATABASE_PASSWORD", env("DB_PASSWORD", "portflow_v3")),
      database: env("DATABASE_NAME", env("DB_NAME", "portflow_v3")),
    },
    migrations: {
      extension: "ts",
      directory: "./server/migrations",
    },
    seeds: {
      extension: "ts",
      directory: "./server/seeds",
    },
  };
}

let db: Knex | null = null;

export function getDb(): Knex {
  if (!db) db = knex(getDbConfig());
  return db;
}

export async function testDbConnection(): Promise<void> {
  try {
    await getDb().raw("SELECT 1");
    const cfg = getDbConfig().connection as Record<string, unknown>;
    console.log(`✅ Database connected → ${cfg.host}:${cfg.port}/${cfg.database}`);
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
}

export async function closeDb(): Promise<void> {
  if (db) {
    await db.destroy();
    db = null;
  }
}
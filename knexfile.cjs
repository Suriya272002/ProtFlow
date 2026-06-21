require("dotenv").config();

module.exports = {
  development: {
    client: "pg",
    connection: process.env.DATABASE_URL || {
      host: process.env.PGHOST || "localhost",
      port: parseInt(process.env.PGPORT || "5432"),
      user: process.env.PGUSER || "postgres",
      password: process.env.PGPASSWORD || "",
      database: process.env.PGDATABASE || "laundry_shop",
    },
    migrations: {
      directory: "./server/migrations",
      extension: "ts",
    },
    seeds: {
      directory: "./server/seeds",
      extension: "ts",
    },
  },
};

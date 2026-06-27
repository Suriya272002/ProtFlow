import express from "express";
import adminRoutes from "./routes/admin";
import { testDbConnection } from "./db";

export function createServer() {
  const app = express();

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: true }));

  app.get("/api/ping", (_req, res) => res.json({ message: "pong" }));

  app.use("/api", adminRoutes);

  // Test DB connection on startup
  testDbConnection();

  return app;
}
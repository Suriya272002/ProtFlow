import express from "express";
import adminRoutes from "./routes/admin";

export function createServer() {
  const app = express();

  app.use(express.json());

  app.get("/api/ping", (_req, res) => res.json({ message: "pong" }));

  app.use("/api", adminRoutes);

  return app;
}

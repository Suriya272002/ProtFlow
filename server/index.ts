import express from "express";

export function createServer() {
  const app = express();

  app.use(express.json());

  // Health check
  app.get("/api/ping", (_req, res) => res.json({ message: "pong" }));

  // Routes

  // Error handler (must be last)

  return app;
}
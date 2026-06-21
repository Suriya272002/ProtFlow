import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";

import { sequelize, User } from "./models";
import { errorHandler } from "./middleware/errorHandler";

import authRoutes from "./routes/auth";
import trackingRoutes from "./routes/tracking";
import serviceRoutes from "./routes/services";
import customerRoutes from "./routes/customers";
import orderRoutes from "./routes/orders";
import staffRoutes from "./routes/staff";
import settingsRoutes from "./routes/settings";
import customizationRoutes from "./routes/customization";
import dashboardRoutes from "./routes/dashboard";
import reportsRoutes from "./routes/reports";

async function seedDefaultUsers() {
  const adminExists = await User.findOne({ where: { username: "admin" } });
  if (!adminExists) {
    await User.create({
      username: "admin",
      name: "Admin User",
      email: "admin@mslaundry.com",
      password: await bcrypt.hash("admin123", 10),
      role: "admin",
    });
    console.log("✅ Default admin user created (admin / admin123)");
  }

  const userExists = await User.findOne({ where: { username: "user" } });
  if (!userExists) {
    await User.create({
      username: "user",
      name: "Priya Ramesh",
      email: "priya@example.com",
      password: await bcrypt.hash("user123", 10),
      role: "user",
    });
    console.log("✅ Default user created (user / user123)");
  }
}

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/api/ping", (_req, res) => res.json({ message: "pong" }));

  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/track", trackingRoutes);
  app.use("/api/services", serviceRoutes);
  app.use("/api/customers", customerRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/staff", staffRoutes);
  app.use("/api/settings", settingsRoutes);
  app.use("/api/customization", customizationRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/reports", reportsRoutes);

  // Error handler (must be last)
  app.use(errorHandler);

  // Sync Sequelize models and seed default users
  sequelize
    .sync({ alter: false })
    .then(() => seedDefaultUsers())
    .catch((err) => console.error("DB sync error:", err));

  return app;
}

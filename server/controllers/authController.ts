import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models";
import { JWT_SECRET } from "../middleware/auth";

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, error: "Username and password are required" });
    }

    const user = await User.findOne({ where: { username, active: true } });
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.json({
      success: true,
      token,
      user: { id: user.id, username: user.username, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, name, email, password, role } = req.body;
    if (!username || !name || !email || !password) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    const exists = await User.findOne({ where: { username } });
    if (exists) {
      return res.status(409).json({ success: false, error: "Username already taken" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      name,
      email,
      password: hashed,
      role: role === "admin" ? "admin" : "user",
    });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(201).json({
      success: true,
      token,
      user: { id: user.id, username: user.username, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const logout = (_req: Request, res: Response) => {
  return res.json({ success: true, message: "Logged out successfully" });
};

export const me = async (req: any, res: Response) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "username", "name", "email", "role"],
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

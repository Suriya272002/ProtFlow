import { Request, Response } from "express";
import { Staff } from "../models";

export const getStaff = async (_req: Request, res: Response) => {
  try {
    const staff = await Staff.findAll({ order: [["id", "ASC"]] });
    res.json(staff);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch staff" });
  }
};

export const getStaffById = async (req: Request, res: Response) => {
  try {
    const staff = await Staff.findByPk(req.params.id);
    if (!staff) return res.status(404).json({ error: "Staff member not found" });
    res.json(staff);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch staff member" });
  }
};

export const createStaff = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, role, permissions } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ error: "name, email, and phone are required" });
    }
    const staff = await Staff.create({
      name,
      email,
      phone,
      role: role || "staff",
      permissions: JSON.stringify(permissions || []),
      active: true,
    });
    res.status(201).json(staff);
  } catch (err) {
    res.status(500).json({ error: "Failed to create staff member" });
  }
};

export const updateStaff = async (req: Request, res: Response) => {
  try {
    const staff = await Staff.findByPk(req.params.id);
    if (!staff) return res.status(404).json({ error: "Staff member not found" });
    const { name, email, phone, role, permissions, active } = req.body;
    await staff.update({
      name: name ?? staff.name,
      email: email ?? staff.email,
      phone: phone ?? staff.phone,
      role: role ?? staff.role,
      permissions: permissions !== undefined ? JSON.stringify(permissions) : staff.permissions,
      active: active !== undefined ? active : staff.active,
    });
    res.json(staff);
  } catch (err) {
    res.status(500).json({ error: "Failed to update staff member" });
  }
};

export const deleteStaff = async (req: Request, res: Response) => {
  try {
    const staff = await Staff.findByPk(req.params.id);
    if (!staff) return res.status(404).json({ error: "Staff member not found" });
    await staff.destroy();
    res.json({ message: "Staff member deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete staff member" });
  }
};

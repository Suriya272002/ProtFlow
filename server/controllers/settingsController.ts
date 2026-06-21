import { Request, Response } from "express";
import { Settings } from "../models";

const DEFAULT_SETTINGS = {
  shop_name: "MS Laundry & Dry Cleaning",
  email: "contact@mslaundry.com",
  phone: "+91 98765 43210",
  address: "123 Main Street, Downtown",
  city: "New Delhi",
  zip_code: "110001",
  website: "www.mslaundry.com",
  opening_hours: JSON.stringify({
    monday: { open: "08:00", close: "20:00", closed: false },
    tuesday: { open: "08:00", close: "20:00", closed: false },
    wednesday: { open: "08:00", close: "20:00", closed: false },
    thursday: { open: "08:00", close: "20:00", closed: false },
    friday: { open: "08:00", close: "20:00", closed: false },
    saturday: { open: "09:00", close: "19:00", closed: false },
    sunday: { open: "10:00", close: "18:00", closed: false },
  }),
};

export const getSettings = async (_req: Request, res: Response) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(DEFAULT_SETTINGS);
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    let settings = await Settings.findOne();
    const { opening_hours, ...rest } = req.body;
    const updates: any = { ...rest };
    if (opening_hours !== undefined) {
      updates.opening_hours = typeof opening_hours === "string" ? opening_hours : JSON.stringify(opening_hours);
    }
    if (!settings) {
      settings = await Settings.create({ ...DEFAULT_SETTINGS, ...updates });
    } else {
      await settings.update(updates);
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: "Failed to update settings" });
  }
};

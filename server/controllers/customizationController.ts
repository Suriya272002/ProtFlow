import { Request, Response } from "express";
import { Customization } from "../models";

export const getCustomization = async (_req: Request, res: Response) => {
  try {
    let c = await Customization.findOne();
    if (!c) c = await Customization.create({} as any);
    res.json(c);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch customization" });
  }
};

export const updateCustomization = async (req: Request, res: Response) => {
  try {
    let c = await Customization.findOne();
    if (!c) {
      c = await Customization.create(req.body);
    } else {
      await c.update(req.body);
    }
    res.json(c);
  } catch (err) {
    res.status(500).json({ error: "Failed to update customization" });
  }
};

export const getThemeConfig = async (_req: Request, res: Response) => {
  try {
    const c = await Customization.findOne();
    if (!c) {
      return res.json({ primaryColor: "#3b82f6", secondaryColor: "#1f2937", accentColor: "#10b981", darkMode: false });
    }
    res.json({
      primaryColor: c.primary_color,
      secondaryColor: c.secondary_color,
      accentColor: c.accent_color,
      darkMode: c.dark_mode_enabled,
      appName: c.app_name,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch theme config" });
  }
};

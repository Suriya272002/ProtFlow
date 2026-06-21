import { Request, Response } from "express";
import { Service } from "../models";

export const getServices = async (_req: Request, res: Response) => {
  try {
    const services = await Service.findAll({ order: [["id", "ASC"]] });
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch services" });
  }
};

export const getServiceById = async (req: Request, res: Response) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch service" });
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const { name, description, category, price, enabled } = req.body;
    if (!name || !category || price === undefined) {
      return res.status(400).json({ error: "name, category, and price are required" });
    }
    const service = await Service.create({ name, description, category, price: parseFloat(price), enabled: enabled ?? true });
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ error: "Failed to create service" });
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ error: "Service not found" });
    const { name, description, category, price, enabled } = req.body;
    await service.update({
      name: name ?? service.name,
      description: description ?? service.description,
      category: category ?? service.category,
      price: price !== undefined ? parseFloat(price) : service.price,
      enabled: enabled !== undefined ? enabled : service.enabled,
    });
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: "Failed to update service" });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ error: "Service not found" });
    await service.destroy();
    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete service" });
  }
};

import { Request, Response } from "express";
import { Customer } from "../models";

export const getCustomers = async (_req: Request, res: Response) => {
  try {
    const customers = await Customer.findAll({ order: [["id", "ASC"]] });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch customer" });
  }
};

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address } = req.body;
    if (!name || !phone) return res.status(400).json({ error: "Name and phone are required" });
    const customer = await Customer.create({
      name,
      email: email || undefined,
      phone,
      address: address || undefined,
      total_orders: 0,
      total_spent: 0,
    });
    res.status(201).json(customer);
  } catch (err) {
    res.status(500).json({ error: "Failed to create customer" });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    const { name, email, phone, address } = req.body;
    await customer.update({
      name: name ?? customer.name,
      email: email ?? customer.email,
      phone: phone ?? customer.phone,
      address: address ?? customer.address,
    });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: "Failed to update customer" });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    await customer.destroy();
    res.json({ message: "Customer deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete customer" });
  }
};

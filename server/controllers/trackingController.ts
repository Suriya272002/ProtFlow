import { Request, Response } from "express";
import { Order, OrderItem, Service, Customer } from "../models";
import { Op } from "sequelize";

export const trackOrder = async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;

    const order = await Order.findOne({
      where: {
        [Op.or]: [
          { order_number: identifier },
          ...(isNaN(Number(identifier)) ? [] : [{ id: Number(identifier) }]),
        ],
      },
      include: [
        {
          model: Customer,
          as: "customer",
          attributes: ["name", "phone", "email"],
        },
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Service, as: "service", attributes: ["name", "category"] }],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found. Please check your booking ID." });
    }

    const statusSteps = ["pending", "processing", "ready", "delivered"];
    const currentStep = statusSteps.indexOf(order.status);

    return res.json({
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      order_type: order.order_type,
      total_amount: order.total_amount,
      notes: order.notes,
      completion_date: order.completion_date,
      created_at: order.createdAt,
      updated_at: order.updatedAt,
      customer: (order as any).customer,
      items: (order as any).items,
      tracking: {
        current_step: currentStep,
        steps: [
          { label: "Order Received", done: currentStep >= 0 },
          { label: "Processing", done: currentStep >= 1 },
          { label: "Ready for Pickup", done: currentStep >= 2 },
          { label: "Delivered", done: currentStep >= 3 },
        ],
      },
    });
  } catch (err) {
    console.error("Track order error:", err);
    return res.status(500).json({ error: "Failed to track order" });
  }
};

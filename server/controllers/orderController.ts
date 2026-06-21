import { Request, Response } from "express";
import { Order, OrderItem, Customer, Service } from "../models";

export const getOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: Customer, as: "customer", attributes: ["name", "phone"] }],
      order: [["id", "DESC"]],
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: Customer, as: "customer", attributes: ["name", "phone", "email"] },
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Service, as: "service", attributes: ["name", "category"] }],
        },
      ],
    });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { customer_id, order_type, items, notes } = req.body;
    if (!customer_id || !order_type || !items || items.length === 0) {
      return res.status(400).json({ error: "customer_id, order_type, and items are required" });
    }

    const totalAmount = items.reduce((sum: number, item: any) => sum + (item.subtotal || 0), 0);
    const orderNumber = `ORD-${Date.now()}`;

    const order = await Order.create({
      order_number: orderNumber,
      customer_id,
      order_type,
      total_amount: totalAmount,
      notes: notes || undefined,
      status: "pending",
    });

    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      service_id: item.service_id,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.subtotal,
    }));
    await OrderItem.bulkCreate(orderItems);

    await Customer.increment(
      { total_orders: 1, total_spent: totalAmount },
      { where: { id: customer_id } }
    );

    const fullOrder = await Order.findByPk(order.id, {
      include: [
        { model: Customer, as: "customer", attributes: ["name", "phone"] },
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Service, as: "service", attributes: ["name"] }],
        },
      ],
    });
    res.status(201).json(fullOrder);
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
};

export const bookOrder = async (req: Request, res: Response) => {
  try {
    // Accept both customer_name/name and order_type/service_type for frontend flexibility
    const customerName = req.body.customer_name || req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;
    const address = req.body.address;
    const orderType = req.body.order_type || req.body.service_type || "laundry";
    const notes = req.body.notes;
    const pickupDate = req.body.pickup_date;
    const items: any[] = req.body.items || [];

    if (!customerName || !phone) {
      return res.status(400).json({ error: "customer_name and phone are required" });
    }

    // Find or create customer
    let customer = await Customer.findOne({ where: { phone } });
    if (!customer) {
      customer = await Customer.create({
        name: customerName,
        phone,
        email: email || undefined,
        address: address || undefined,
        total_orders: 0,
        total_spent: 0,
      });
    }

    // Calculate total from items (if provided) or default to 0 for manual pricing later
    let totalAmount = 0;
    const resolvedItems: { service_id: number; quantity: number; price: number; subtotal: number }[] = [];

    if (items.length > 0) {
      for (const item of items) {
        const service = await Service.findByPk(item.service_id);
        const price = service ? parseFloat(String(service.price)) : (item.price || 0);
        const qty = item.quantity || 1;
        const subtotal = price * qty;
        totalAmount += subtotal;
        resolvedItems.push({ service_id: item.service_id, quantity: qty, price, subtotal });
      }
    }

    const normalizedType: "laundry" | "dry-clean" | "mixed" =
      orderType === "dry-clean" ? "dry-clean" : orderType === "mixed" ? "mixed" : "laundry";

    const orderNumber = `BK-${Date.now()}`;
    const noteText = [pickupDate ? `Pickup: ${pickupDate}` : null, notes]
      .filter(Boolean)
      .join(". ");

    const order = await Order.create({
      order_number: orderNumber,
      customer_id: customer.id,
      order_type: normalizedType,
      total_amount: totalAmount,
      notes: noteText || undefined,
      status: "pending",
    });

    if (resolvedItems.length > 0) {
      await OrderItem.bulkCreate(
        resolvedItems.map((it) => ({ ...it, order_id: order.id }))
      );
    }

    await Customer.increment({ total_orders: 1, total_spent: totalAmount }, { where: { id: customer.id } });

    res.status(201).json({
      success: true,
      booking_id: order.order_number,
      order_number: order.order_number,
      order_id: order.id,
      message: "Booking confirmed! Use your booking ID to track your order.",
    });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ error: "Failed to create booking" });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    const { status, notes, completion_date } = req.body;
    await order.update({
      status: status ?? order.status,
      notes: notes ?? order.notes,
      completion_date: completion_date ?? order.completion_date,
    });
    const updated = await Order.findByPk(order.id, {
      include: [{ model: Customer, as: "customer", attributes: ["name", "phone"] }],
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update order" });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    await OrderItem.destroy({ where: { order_id: order.id } });
    await order.destroy();
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete order" });
  }
};

import { Request, Response } from "express";
import { Order, Customer } from "../models";
import { fn, col, Op } from "sequelize";

export const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    const totalOrders = await Order.count();
    const pendingOrders = await Order.count({ where: { status: "pending" } });
    const processingOrders = await Order.count({ where: { status: "processing" } });
    const completedOrders = await Order.count({ where: { status: "delivered" } });
    const totalCustomers = await Customer.count();

    const revenueResult = await Order.findOne({
      attributes: [[fn("SUM", col("total_amount")), "total"]],
      raw: true,
    }) as any;

    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthRevenueResult = await Order.findOne({
      attributes: [[fn("SUM", col("total_amount")), "total"]],
      where: { createdAt: { [Op.gte]: firstOfMonth } },
      raw: true,
    }) as any;

    res.json({
      totalOrders,
      pendingOrders,
      processingOrders,
      completedOrders,
      totalCustomers,
      totalRevenue: parseFloat(revenueResult?.total || "0"),
      revenueThisMonth: parseFloat(monthRevenueResult?.total || "0"),
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard statistics" });
  }
};

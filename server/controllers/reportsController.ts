import { Request, Response } from "express";
import { Order } from "../models";
import { literal } from "sequelize";

export const getDailyReport = async (req: Request, res: Response) => {
  try {
    const { date } = req.query;
    const reportDate = (date as string) || new Date().toISOString().split("T")[0];

    const orders = await Order.findAll({
      where: literal(`DATE(created_at) = '${reportDate}'`) as any,
    });

    res.json({
      date: reportDate,
      totalOrders: orders.length,
      completedOrders: orders.filter((o) => o.status === "delivered").length,
      totalRevenue: orders.reduce((s, o) => s + parseFloat(String(o.total_amount)), 0),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch daily report" });
  }
};

export const getMonthlyReport = async (req: Request, res: Response) => {
  try {
    const year = req.query.year ? parseInt(req.query.year as string) : new Date().getFullYear();
    const month = req.query.month ? parseInt(req.query.month as string) : new Date().getMonth() + 1;

    const orders = await Order.findAll({
      where: literal(
        `EXTRACT(YEAR FROM created_at) = ${year} AND EXTRACT(MONTH FROM created_at) = ${month}`
      ) as any,
    });

    const totalRevenue = orders.reduce((s, o) => s + parseFloat(String(o.total_amount)), 0);

    res.json({
      month: new Date(year, month - 1).toLocaleString("en-US", { month: "long" }),
      year,
      totalOrders: orders.length,
      completedOrders: orders.filter((o) => o.status === "delivered").length,
      totalRevenue,
      totalExpenses: 0,
      profit: totalRevenue,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch monthly report" });
  }
};

export const getOrderSummary = async (_req: Request, res: Response) => {
  try {
    const orders = await Order.findAll();
    res.json({
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      processing: orders.filter((o) => o.status === "processing").length,
      ready: orders.filter((o) => o.status === "ready").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      totalRevenue: orders.reduce((s, o) => s + parseFloat(String(o.total_amount)), 0),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch order summary" });
  }
};

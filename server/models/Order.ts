import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface OrderAttributes {
  id: number;
  order_number: string;
  customer_id: number;
  order_type: "laundry" | "dry-clean" | "mixed";
  status: "pending" | "processing" | "ready" | "delivered";
  total_amount: number;
  notes?: string;
  completion_date?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class Order
  extends Model<OrderAttributes, Optional<OrderAttributes, "id" | "status" | "notes" | "completion_date">>
  implements OrderAttributes {
  declare id: number;
  declare order_number: string;
  declare customer_id: number;
  declare order_type: "laundry" | "dry-clean" | "mixed";
  declare status: "pending" | "processing" | "ready" | "delivered";
  declare total_amount: number;
  declare notes: string;
  declare completion_date: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Order.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    order_number: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    customer_id: { type: DataTypes.INTEGER, allowNull: false },
    order_type: { type: DataTypes.ENUM("laundry", "dry-clean", "mixed"), allowNull: false },
    status: { type: DataTypes.ENUM("pending", "processing", "ready", "delivered"), defaultValue: "pending" },
    total_amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    notes: { type: DataTypes.TEXT },
    completion_date: { type: DataTypes.DATEONLY },
  },
  { sequelize, tableName: "orders", underscored: true }
);

export default Order;

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface CustomerAttributes {
  id: number;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  total_orders: number;
  total_spent: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class Customer
  extends Model<CustomerAttributes, Optional<CustomerAttributes, "id" | "email" | "address" | "total_orders" | "total_spent">>
  implements CustomerAttributes {
  declare id: number;
  declare name: string;
  declare email: string;
  declare phone: string;
  declare address: string;
  declare total_orders: number;
  declare total_spent: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Customer.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(100), unique: true },
    phone: { type: DataTypes.STRING(20), allowNull: false },
    address: { type: DataTypes.TEXT },
    total_orders: { type: DataTypes.INTEGER, defaultValue: 0 },
    total_spent: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  },
  { sequelize, tableName: "customers", underscored: true }
);

export default Customer;

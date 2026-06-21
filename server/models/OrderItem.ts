import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface OrderItemAttributes {
  id: number;
  order_id: number;
  service_id: number;
  quantity: number;
  price: number;
  subtotal: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class OrderItem extends Model<OrderItemAttributes, Optional<OrderItemAttributes, "id">> implements OrderItemAttributes {
  declare id: number;
  declare order_id: number;
  declare service_id: number;
  declare quantity: number;
  declare price: number;
  declare subtotal: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

OrderItem.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    service_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  },
  { sequelize, tableName: "order_items", underscored: true }
);

export default OrderItem;

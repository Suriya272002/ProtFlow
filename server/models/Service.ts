import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface ServiceAttributes {
  id: number;
  name: string;
  description?: string;
  category: "washing" | "ironing" | "dry-clean" | "other";
  price: number;
  enabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

class Service extends Model<ServiceAttributes, Optional<ServiceAttributes, "id" | "description" | "enabled">>
  implements ServiceAttributes {
  declare id: number;
  declare name: string;
  declare description: string;
  declare category: "washing" | "ironing" | "dry-clean" | "other";
  declare price: number;
  declare enabled: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Service.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.TEXT },
    category: { type: DataTypes.ENUM("washing", "ironing", "dry-clean", "other"), allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    enabled: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { sequelize, tableName: "services", underscored: true }
);

export default Service;

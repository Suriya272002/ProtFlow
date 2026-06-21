import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface StaffAttributes {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "manager" | "staff" | "operator";
  permissions: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

class Staff
  extends Model<StaffAttributes, Optional<StaffAttributes, "id" | "role" | "permissions" | "active">>
  implements StaffAttributes {
  declare id: number;
  declare name: string;
  declare email: string;
  declare phone: string;
  declare role: "manager" | "staff" | "operator";
  declare permissions: string;
  declare active: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Staff.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    phone: { type: DataTypes.STRING(20), allowNull: false },
    role: { type: DataTypes.ENUM("manager", "staff", "operator"), defaultValue: "staff" },
    permissions: { type: DataTypes.TEXT, defaultValue: "[]" },
    active: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { sequelize, tableName: "staff", underscored: true }
);

export default Staff;

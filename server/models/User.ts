import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface UserAttributes {
  id: number;
  username: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id" | "active"> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: number;
  declare username: string;
  declare name: string;
  declare email: string;
  declare password: string;
  declare role: "admin" | "user";
  declare active: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    role: { type: DataTypes.ENUM("admin", "user"), defaultValue: "user" },
    active: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { sequelize, tableName: "users", underscored: true }
);

export default User;

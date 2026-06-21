import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface SettingsAttributes {
  id: number;
  shop_name: string;
  logo?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  zip_code?: string;
  website?: string;
  opening_hours?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class Settings
  extends Model<SettingsAttributes, Optional<SettingsAttributes, "id" | "logo" | "email" | "phone" | "address" | "city" | "zip_code" | "website" | "opening_hours">>
  implements SettingsAttributes {
  declare id: number;
  declare shop_name: string;
  declare logo: string;
  declare email: string;
  declare phone: string;
  declare address: string;
  declare city: string;
  declare zip_code: string;
  declare website: string;
  declare opening_hours: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Settings.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    shop_name: { type: DataTypes.STRING(200), allowNull: false },
    logo: { type: DataTypes.TEXT },
    email: { type: DataTypes.STRING(100) },
    phone: { type: DataTypes.STRING(20) },
    address: { type: DataTypes.TEXT },
    city: { type: DataTypes.STRING(100) },
    zip_code: { type: DataTypes.STRING(20) },
    website: { type: DataTypes.STRING(200) },
    opening_hours: { type: DataTypes.TEXT },
  },
  { sequelize, tableName: "settings", underscored: true }
);

export default Settings;

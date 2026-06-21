import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface CustomizationAttributes {
  id: number;
  app_name: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  dark_mode_enabled: boolean;
  enable_customer_portal: boolean;
  enable_order_tracking: boolean;
  enable_notifications: boolean;
  enable_reports: boolean;
  enable_staff_management: boolean;
  enable_loyalty_program: boolean;
  default_order_type: string;
  min_order_amount: number;
  default_delivery_days: number;
  enable_express_service: boolean;
  express_service_charge: number;
  notify_order_received: boolean;
  notify_order_ready: boolean;
  notify_order_delivered: boolean;
  notify_low_inventory: boolean;
  admin_email?: string;
  send_daily_summary: boolean;
  summary_email_time: string;
  items_per_page: number;
  date_format: string;
  currency: string;
  auto_generate_invoice: boolean;
  allow_customer_edits: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

class Customization
  extends Model<CustomizationAttributes, Optional<CustomizationAttributes, "id" | "admin_email">>
  implements CustomizationAttributes {
  declare id: number;
  declare app_name: string;
  declare primary_color: string;
  declare secondary_color: string;
  declare accent_color: string;
  declare dark_mode_enabled: boolean;
  declare enable_customer_portal: boolean;
  declare enable_order_tracking: boolean;
  declare enable_notifications: boolean;
  declare enable_reports: boolean;
  declare enable_staff_management: boolean;
  declare enable_loyalty_program: boolean;
  declare default_order_type: string;
  declare min_order_amount: number;
  declare default_delivery_days: number;
  declare enable_express_service: boolean;
  declare express_service_charge: number;
  declare notify_order_received: boolean;
  declare notify_order_ready: boolean;
  declare notify_order_delivered: boolean;
  declare notify_low_inventory: boolean;
  declare admin_email: string;
  declare send_daily_summary: boolean;
  declare summary_email_time: string;
  declare items_per_page: number;
  declare date_format: string;
  declare currency: string;
  declare auto_generate_invoice: boolean;
  declare allow_customer_edits: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Customization.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    app_name: { type: DataTypes.STRING(100), defaultValue: "MS Laundry" },
    primary_color: { type: DataTypes.STRING(20), defaultValue: "#3b82f6" },
    secondary_color: { type: DataTypes.STRING(20), defaultValue: "#1f2937" },
    accent_color: { type: DataTypes.STRING(20), defaultValue: "#10b981" },
    dark_mode_enabled: { type: DataTypes.BOOLEAN, defaultValue: false },
    enable_customer_portal: { type: DataTypes.BOOLEAN, defaultValue: true },
    enable_order_tracking: { type: DataTypes.BOOLEAN, defaultValue: true },
    enable_notifications: { type: DataTypes.BOOLEAN, defaultValue: true },
    enable_reports: { type: DataTypes.BOOLEAN, defaultValue: true },
    enable_staff_management: { type: DataTypes.BOOLEAN, defaultValue: true },
    enable_loyalty_program: { type: DataTypes.BOOLEAN, defaultValue: false },
    default_order_type: { type: DataTypes.STRING(20), defaultValue: "mixed" },
    min_order_amount: { type: DataTypes.INTEGER, defaultValue: 100 },
    default_delivery_days: { type: DataTypes.INTEGER, defaultValue: 2 },
    enable_express_service: { type: DataTypes.BOOLEAN, defaultValue: true },
    express_service_charge: { type: DataTypes.INTEGER, defaultValue: 50 },
    notify_order_received: { type: DataTypes.BOOLEAN, defaultValue: true },
    notify_order_ready: { type: DataTypes.BOOLEAN, defaultValue: true },
    notify_order_delivered: { type: DataTypes.BOOLEAN, defaultValue: true },
    notify_low_inventory: { type: DataTypes.BOOLEAN, defaultValue: true },
    admin_email: { type: DataTypes.STRING(100) },
    send_daily_summary: { type: DataTypes.BOOLEAN, defaultValue: true },
    summary_email_time: { type: DataTypes.STRING(10), defaultValue: "09:00" },
    items_per_page: { type: DataTypes.INTEGER, defaultValue: 10 },
    date_format: { type: DataTypes.STRING(20), defaultValue: "DD/MM/YYYY" },
    currency: { type: DataTypes.STRING(10), defaultValue: "INR" },
    auto_generate_invoice: { type: DataTypes.BOOLEAN, defaultValue: true },
    allow_customer_edits: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { sequelize, tableName: "customization", underscored: true }
);

export default Customization;

import sequelize from "../config/database";
import User from "./User";
import Service from "./Service";
import Customer from "./Customer";
import Order from "./Order";
import OrderItem from "./OrderItem";
import Staff from "./Staff";
import Settings from "./Settings";
import Customization from "./Customization";

Order.belongsTo(Customer, { foreignKey: "customer_id", as: "customer" });
Customer.hasMany(Order, { foreignKey: "customer_id", as: "orders" });

Order.hasMany(OrderItem, { foreignKey: "order_id", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "order_id" });

OrderItem.belongsTo(Service, { foreignKey: "service_id", as: "service" });
Service.hasMany(OrderItem, { foreignKey: "service_id" });

export { sequelize, User, Service, Customer, Order, OrderItem, Staff, Settings, Customization };

import type { Knex } from "knex";
import "dotenv/config";
import { getDbConfig } from "./server/db";

export default getDbConfig();

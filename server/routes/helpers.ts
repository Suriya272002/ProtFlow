import type { RequestHandler, Router } from "express";
import { Router as createRouter } from "express";
import type { Knex } from "knex";
import { getDb } from "../db";
import { requireAuth } from "../middleware/auth";

type CrudConfig = {
  table: string;
  orderBy?: string;
  mapRow: (row: Record<string, unknown>) => Record<string, unknown>;
  mapInput?: (body: Record<string, unknown>) => Record<string, unknown>;
};

export function createCrudRoutes(config: CrudConfig): Router {
  const router = createRouter();
  const orderCol = config.orderBy || "sort_order";

  const list: RequestHandler = async (_req, res) => {
    try {
      const rows = await getDb()(config.table).orderBy(orderCol, "asc");
      res.json(rows.map(config.mapRow));
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  };

  const create: RequestHandler = async (req, res) => {
    try {
      const data = config.mapInput ? config.mapInput(req.body) : req.body;
      const maxOrder = await getDb()(config.table).max("sort_order as max").first();
      const sortOrder = (Number(maxOrder?.max) || 0) + 1;
      const [id] = await getDb()(config.table).insert({ ...data, sort_order: sortOrder });
      const row = await getDb()(config.table).where({ id }).first();
      res.status(201).json(config.mapRow(row));
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  };

  const update: RequestHandler = async (req, res) => {
    try {
      const id = req.params.id;
      const data = config.mapInput ? config.mapInput(req.body) : req.body;
      await getDb()(config.table).where({ id }).update(data);
      const row = await getDb()(config.table).where({ id }).first();
      if (!row) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json(config.mapRow(row));
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  };

  const remove: RequestHandler = async (req, res) => {
    try {
      const deleted = await getDb()(config.table).where({ id: req.params.id }).del();
      if (!deleted) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  };

  router.get("/", list);
  router.post("/", requireAuth, create);
  router.put("/:id", requireAuth, update);
  router.delete("/:id", requireAuth, remove);
  return router;
}

export async function getSingleton(table: string): Promise<Record<string, unknown> | undefined> {
  return getDb()(table).first();
}

export async function updateSingleton(table: string, data: Record<string, unknown>): Promise<void> {
  const existing = await getDb()(table).first();
  if (existing) {
    await getDb()(table).where({ id: (existing as { id: number }).id }).update(data);
  } else {
    await getDb()(table).insert(data);
  }
}

export function parseJsonField<T>(value: unknown, fallback: T): T {
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  if (Array.isArray(value) || (value && typeof value === "object")) return value as T;
  return fallback;
}

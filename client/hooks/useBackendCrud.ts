import { useCallback, useEffect, useRef, useState } from "react";
import type { ModalMode } from "../pages/shared";

type CrudApi<T extends { id?: number | string }> = {
  list: () => Promise<T[]>;
  create: (item: T) => Promise<T>;
  update: (id: number, item: T) => Promise<T>;
  remove: (id: number) => Promise<void>;
};

export function useBackendCrud<T extends { id?: number | string }>(api: CrudApi<T>) {
  const apiRef = useRef(api);
  apiRef.current = api;
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<ModalMode>(null);
  const [current, setCurrent] = useState<T | null>(null);
  const [confirm, setConfirm] = useState<T | null>(null);
  const [saving, setSaving] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiRef.current.list();
      setItems(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const open = (m: ModalMode, item: T | null) => {
    setCurrent(item ? { ...item } : null);
    setMode(m);
  };
  const close = () => {
    setMode(null);
    setCurrent(null);
  };
  const update = (patch: Partial<T>) => setCurrent((c) => (c ? { ...c, ...patch } : c));

  const save = async () => {
    if (!current) return;
    setSaving(true);
    setError("");
    try {
      const exists = items.some((x) => x.id === current.id);
      if (exists && current.id != null) {
        const updated = await apiRef.current.update(Number(current.id), current);
        setItems((arr) => arr.map((x) => (x.id === current.id ? updated : x)));
      } else {
        const created = await apiRef.current.create(current);
        setItems((arr) => [...arr, created]);
      }
      close();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item: T) => {
    if (item.id == null) return;
    setError("");
    try {
      await apiRef.current.remove(Number(item.id));
      setItems((arr) => arr.filter((x) => x.id !== item.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return { items, loading, error, saving, mode, current, confirm, setConfirm, open, close, update, save, remove, reload };
}

export function useSingleton<T>(load: () => Promise<T>, saveFn: (data: T) => Promise<unknown>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    load()
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [load]);

  const save = async () => {
    if (!data) return;
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const result = await saveFn(data);
      if (result && typeof result === "object") setData(result as T);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const update = (patch: Partial<T>) => setData((d) => (d ? { ...d, ...patch } : d));

  return { data, setData, loading, saving, error, saved, save, update };
}

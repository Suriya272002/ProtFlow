import { useEffect, useState } from "react";

/* ── Icon ── */
export const Icon = ({
  name,
  className = "",
  fill = false,
}: {
  name: string;
  className?: string;
  fill?: boolean;
}) => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
  >
    {name}
  </span>
);

/* ── Page header ── */
export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="flex justify-between items-center mb-10 flex-wrap gap-6">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface">{title}</h1>
        <p className="text-on-surface-variant font-body-md opacity-70">{subtitle}</p>
      </div>
      <div className="flex items-center gap-4">{action}</div>
    </header>
  );
}

/* ── Form field ── */
export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-label-sm font-label-sm uppercase tracking-widest text-on-surface-variant opacity-70 mb-2">
        {label}
      </span>
      {children}
    </label>
  );
}


/* ── Save button ── */
export function SaveBtn({
  onClick,
  label = "Save Changes",
}: {
  onClick?: () => void;
  label?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-primary text-on-primary font-bold px-6 py-3 rounded-full glow-primary hover:scale-105 transition-transform flex items-center gap-2"
    >
      <Icon name="save" className="text-[18px]" /> {label}
    </button>
  );
}

/* ── Toggle ── */
export function Toggle({ on: initial }: { on: boolean }) {
  const [on, setOn] = useState(initial);
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        checked={on}
        onChange={(e) => setOn(e.target.checked)}
        className="sr-only peer"
        type="checkbox"
      />
      <div className="w-11 h-6 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container" />
    </label>
  );
}

/* ── Row actions ── */
export function RowActions({
  onView,
  onEdit,
  onDelete,
}: {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex md:justify-end gap-1">
      <button
        onClick={onView}
        title="View"
        className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10"
      >
        <Icon name="visibility" className="text-[18px]" />
      </button>
      <button
        onClick={onEdit}
        title="Edit"
        className="p-2 rounded-lg text-on-surface-variant hover:text-secondary-fixed hover:bg-secondary-fixed/10"
      >
        <Icon name="edit" className="text-[18px]" />
      </button>
      <button
        onClick={onDelete}
        title="Delete"
        className="p-2 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10"
      >
        <Icon name="delete" className="text-[18px]" />
      </button>
    </div>
  );
}

/* ── Detail row ── */
export function DetailRow({
  label,
  value,
  full = false,
}: {
  label: string;
  value: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60 font-bold mb-1">
        {label}
      </p>
      <div className="text-on-surface break-words">
        {value || <span className="opacity-40">—</span>}
      </div>
    </div>
  );
}

/* ── Modal ── */
export type ModalMode = "view" | "edit" | "create" | null;

export function Modal({
  open,
  onClose,
  title,
  icon,
  mode,
  children,
  footer,
  maxWidth = "max-w-2xl",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  icon?: string;
  mode?: ModalMode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const badge =
    mode === "view"
      ? { l: "Read only", c: "bg-primary/15 text-primary" }
      : mode === "edit"
      ? { l: "Editing", c: "bg-secondary-fixed/15 text-secondary-fixed" }
      : mode === "create"
      ? { l: "New entry", c: "bg-tertiary/15 text-tertiary" }
      : null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className={`relative w-full ${maxWidth} max-h-[90vh] flex flex-col glass-panel rounded-3xl border border-white/10 shadow-2xl overflow-hidden`}
      >
        <div className="flex items-center gap-3 px-6 py-4 border-b border-outline-variant/30">
          {icon && (
            <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
              <Icon name={icon} fill />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-on-surface truncate">{title}</h3>
            {badge && (
              <span
                className={`inline-block mt-0.5 text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${badge.c}`}
              >
                {badge.l}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl text-on-surface-variant hover:bg-white/5 hover:text-on-surface flex items-center justify-center"
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-5">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-outline-variant/30 flex items-center justify-end gap-2 bg-surface-variant/20">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Modal footer ── */
export function ModalFooter({
  mode,
  onClose,
  onSave,
}: {
  mode: ModalMode;
  onClose: () => void;
  onSave?: () => void;
}) {
  if (mode === "view")
    return (
      <button
        onClick={onClose}
        className="px-5 py-2.5 rounded-xl bg-white/5 text-on-surface font-bold hover:bg-white/10"
      >
        Close
      </button>
    );
  return (
    <>
      <button
        onClick={onClose}
        className="px-5 py-2.5 rounded-xl bg-white/5 text-on-surface font-bold hover:bg-white/10"
      >
        Cancel
      </button>
      <button
        onClick={() => {
          onSave?.();
          onClose();
        }}
        className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold glow-primary hover:scale-[1.02] transition-transform flex items-center gap-2"
      >
        <Icon name="save" className="text-[18px]" />
        {mode === "create" ? "Create" : "Save"}
      </button>
    </>
  );
}

/* ── Confirm delete ── */
export function ConfirmDelete({
  open,
  onClose,
  onConfirm,
  name,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-md glass-panel rounded-3xl border border-error/30 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-error/15 text-error flex items-center justify-center shrink-0">
            <Icon name="delete_forever" fill />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-on-surface text-lg">Are you sure?</h3>
            <p className="text-sm text-on-surface-variant opacity-70 mt-1">
              This will permanently remove{" "}
              <span className="text-on-surface font-bold">{name}</span>. This action cannot be
              undone.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white/5 text-on-surface font-bold hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-error text-on-error font-bold hover:scale-[1.02] transition-transform flex items-center gap-2"
          >
            <Icon name="delete" className="text-[18px]" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── useCrud hook ── */
export function useCrud<T extends { id?: string | number }>(initial: T[]) {
  const [items, setItems] = useState<T[]>(
    initial.map((it, i) => ({ ...it, id: it.id ?? i }))
  );
  const [mode, setMode] = useState<ModalMode>(null);
  const [current, setCurrent] = useState<T | null>(null);
  const [confirm, setConfirm] = useState<T | null>(null);

  const open = (m: ModalMode, item: T | null) => {
    setCurrent(item ? { ...item } : null);
    setMode(m);
  };
  const close = () => {
    setMode(null);
    setCurrent(null);
  };
  const update = (patch: Partial<T>) =>
    setCurrent((c) => (c ? { ...c, ...patch } : c));
  const save = () => {
    if (!current) return;
    setItems((arr) => {
      const exists = arr.some((x) => x.id === current.id);
      return exists
        ? arr.map((x) => (x.id === current.id ? current : x))
        : [...arr, { ...current, id: current.id ?? Date.now() }];
    });
  };
  const remove = (item: T) => setItems((arr) => arr.filter((x) => x.id !== item.id));

  return { items, mode, current, confirm, setConfirm, open, close, update, save, remove };
}
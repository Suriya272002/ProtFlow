import {
  Icon, PageHeader, Field, inputCls,
  RowActions, Modal, ModalFooter, ConfirmDelete, DetailRow, useCrud,
} from "../shared";

type Skill = { id?: number | string; name: string; level: number; category: string; icon: string };

export function SkillsPage() {
  const crud = useCrud<Skill>([
    { name: "React / TanStack", level: 95, category: "Frontend",    icon: "code" },
    { name: "TypeScript",       level: 90, category: "Language",    icon: "javascript" },
    { name: "Three.js / WebGL", level: 80, category: "3D / Graphics",icon: "view_in_ar" },
    { name: "Node.js",          level: 85, category: "Backend",     icon: "dns" },
    { name: "Figma",            level: 75, category: "Design",      icon: "palette" },
    { name: "Python",           level: 70, category: "Language",    icon: "terminal" },
  ]);
  const blank: Skill = { name: "", level: 50, category: "", icon: "bolt" };

  const categoryColor: Record<string, string> = {
    Frontend:      "primary",
    Language:      "secondary-fixed",
    "3D / Graphics":"tertiary",
    Backend:       "primary",
    Design:        "tertiary",
  };

  return (
    <>
      <PageHeader
        title="Skills"
        subtitle="Every skill chip on the user-side Skills section."
        action={
          <button
            onClick={() => crud.open("create", blank)}
            className="bg-primary text-on-primary font-bold px-5 py-3 rounded-full glow-primary hover:scale-105 transition-transform flex items-center gap-2"
          >
            <Icon name="add" className="text-[18px]" /> Add Skill
          </button>
        }
      />

      <div className="glass-panel rounded-3xl overflow-hidden">
        <div className="hidden md:grid grid-cols-[1.5fr_1fr_2fr_140px] gap-4 px-6 py-4 border-b border-outline-variant/30 text-xs uppercase tracking-widest text-on-surface-variant opacity-60">
          <span>Skill</span><span>Category</span><span>Level</span><span className="text-right">Actions</span>
        </div>

        {crud.items.map((s) => (
          <div key={s.id} className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_2fr_140px] gap-3 px-4 md:px-6 py-4 border-b border-outline-variant/20 hover:bg-white/[0.03] md:items-center">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0">
                <Icon name={s.icon} />
              </div>
              <span className="font-bold text-on-surface truncate">{s.name}</span>
            </div>
            <span className={`text-xs uppercase tracking-wider text-${categoryColor[s.category] || "primary"} font-bold`}>
              {s.category}
            </span>
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex-1 h-2 bg-surface-variant/40 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-primary-container" style={{ width: `${s.level}%` }} />
              </div>
              <span className="text-xs text-on-surface-variant font-bold w-10 text-right">{s.level}%</span>
            </div>
            <RowActions
              onView={() => crud.open("view", s)}
              onEdit={() => crud.open("edit", s)}
              onDelete={() => crud.setConfirm(s)}
            />
          </div>
        ))}
      </div>

      <Modal
        open={crud.mode !== null}
        onClose={crud.close}
        mode={crud.mode}
        icon="deployed_code"
        title={crud.mode === "view" ? "Skill Details" : crud.mode === "edit" ? "Edit Skill" : "New Skill"}
        footer={<ModalFooter mode={crud.mode} onClose={crud.close} onSave={crud.save} />}
      >
        {crud.current && (crud.mode === "view" ? (
          <div className="grid grid-cols-2 gap-5">
            <DetailRow label="Name"     value={crud.current.name} />
            <DetailRow label="Category" value={crud.current.category} />
            <DetailRow label="Icon"     value={crud.current.icon} />
            <DetailRow label="Level"    value={`${crud.current.level}%`} />
            <div className="col-span-2">
              <div className="h-3 bg-surface-variant/40 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-primary-container" style={{ width: `${crud.current.level}%` }} />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Field label="Skill Name">
              <input className={inputCls} value={crud.current.name} onChange={(e) => crud.update({ name: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Category">
                <input className={inputCls} value={crud.current.category} onChange={(e) => crud.update({ category: e.target.value })} />
              </Field>
              <Field label="Material Icon">
                <input className={inputCls} value={crud.current.icon} onChange={(e) => crud.update({ icon: e.target.value })} />
              </Field>
            </div>
            <Field label={`Level: ${crud.current.level}%`}>
              <input
                type="range" min={0} max={100}
                value={crud.current.level}
                onChange={(e) => crud.update({ level: +e.target.value })}
                className="w-full accent-primary"
              />
            </Field>
          </div>
        ))}
      </Modal>

      <ConfirmDelete
        open={!!crud.confirm}
        onClose={() => crud.setConfirm(null)}
        onConfirm={() => crud.confirm && crud.remove(crud.confirm)}
        name={crud.confirm?.name || ""}
      />
    </>
  );
}
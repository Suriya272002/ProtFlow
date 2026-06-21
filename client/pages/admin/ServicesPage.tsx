import {
  Icon, PageHeader, Field, inputCls,
  RowActions, Modal, ModalFooter, ConfirmDelete, DetailRow, useCrud,
} from "../shared";

type Service = { id?: number | string; icon: string; title: string; desc: string; price: string; visible: boolean };

export function ServicesPage() {
  const crud = useCrud<Service>([
    { icon: "code",           title: "Web Development",  desc: "Full-stack apps with React, TanStack, Node.", price: "from $2,500", visible: true },
    { icon: "view_in_ar",    title: "3D Experiences",   desc: "Immersive Three.js / WebGL worlds.",           price: "from $4,000", visible: true },
    { icon: "palette",       title: "UI / UX Design",   desc: "Interfaces that feel as good as they look.",  price: "from $1,800", visible: true },
    { icon: "rocket_launch", title: "Performance",       desc: "Audits and optimization for fast sites.",     price: "from $1,200", visible: false },
  ]);
  const blank: Service = { icon: "handshake", title: "", desc: "", price: "", visible: true };

  return (
    <>
      <PageHeader
        title="Services"
        subtitle="What you offer to clients — every card shown on the user-side."
        action={
          <button
            onClick={() => crud.open("create", blank)}
            className="bg-primary text-on-primary font-bold px-5 py-3 rounded-full glow-primary hover:scale-105 transition-transform flex items-center gap-2"
          >
            <Icon name="add" className="text-[18px]" /> Add Service
          </button>
        }
      />

      <div className="grid md:grid-cols-2 gap-6">
        {crud.items.map((s) => (
          <div key={s.id} className="glass-panel rounded-3xl p-6 flex gap-5">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Icon name={s.icon} fill />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-3 mb-1">
                <h3 className="font-bold text-on-surface">{s.title}</h3>
                {!s.visible && (
                  <span className="text-[10px] uppercase font-bold bg-white/10 text-on-surface-variant px-2 py-0.5 rounded-full">
                    Hidden
                  </span>
                )}
              </div>
              <p className="text-sm text-on-surface-variant opacity-70 mb-2">{s.desc}</p>
              <p className="text-xs text-secondary-fixed font-bold mb-3">{s.price}</p>
              <RowActions
                onView={() => crud.open("view", s)}
                onEdit={() => crud.open("edit", s)}
                onDelete={() => crud.setConfirm(s)}
              />
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={crud.mode !== null}
        onClose={crud.close}
        mode={crud.mode}
        icon="handshake"
        title={crud.mode === "view" ? "Service Details" : crud.mode === "edit" ? "Edit Service" : "New Service"}
        footer={<ModalFooter mode={crud.mode} onClose={crud.close} onSave={crud.save} />}
      >
        {crud.current && (crud.mode === "view" ? (
          <div className="grid grid-cols-2 gap-5">
            <DetailRow label="Title"       value={crud.current.title} />
            <DetailRow label="Icon"        value={crud.current.icon} />
            <DetailRow label="Price"       value={crud.current.price} />
            <DetailRow label="Visible"     value={crud.current.visible ? "Yes" : "No"} />
            <DetailRow label="Description" value={crud.current.desc} full />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Title">
                <input className={inputCls} value={crud.current.title} onChange={(e) => crud.update({ title: e.target.value })} />
              </Field>
              <Field label="Material Icon">
                <input className={inputCls} value={crud.current.icon} onChange={(e) => crud.update({ icon: e.target.value })} />
              </Field>
            </div>
            <Field label="Description">
              <textarea rows={3} className={inputCls} value={crud.current.desc} onChange={(e) => crud.update({ desc: e.target.value })} />
            </Field>
            <Field label="Starting Price">
              <input className={inputCls} value={crud.current.price} onChange={(e) => crud.update({ price: e.target.value })} />
            </Field>
            <label className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] cursor-pointer">
              <input type="checkbox" checked={crud.current.visible} onChange={(e) => crud.update({ visible: e.target.checked })} className="accent-primary w-4 h-4" />
              <span className="text-sm text-on-surface">Show on the public site</span>
            </label>
          </div>
        ))}
      </Modal>

      <ConfirmDelete
        open={!!crud.confirm}
        onClose={() => crud.setConfirm(null)}
        onConfirm={() => crud.confirm && crud.remove(crud.confirm)}
        name={crud.confirm?.title || ""}
      />
    </>
  );
}
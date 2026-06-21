import {
  Icon, PageHeader, Field, inputCls,
  RowActions, Modal, ModalFooter, ConfirmDelete, DetailRow, useCrud,
} from "../shared";

type AdminUser = { id?: number | string; name: string; email: string; role: string; status: string; last: string; avatar: string };

const roleColor:   Record<string, string> = { Owner: "primary", Editor: "secondary-fixed", Viewer: "tertiary" };
const statusColor: Record<string, string> = { Active: "secondary-fixed", Invited: "primary", Suspended: "error" };

export function UsersPage() {
  const crud = useCrud<AdminUser>([
    { name: "Alex Morgan",     email: "alex@morgan.dev",         role: "Owner",  status: "Active",    last: "Just now", avatar: "A" },
    { name: "Sarah Williams",  email: "sarah@studio.io",         role: "Editor", status: "Active",    last: "2h ago",   avatar: "S" },
    { name: "David Chen",      email: "david@vrlabs.com",        role: "Viewer", status: "Active",    last: "1d ago",   avatar: "D" },
    { name: "Elena Rodriguez", email: "elena@designweek.org",    role: "Editor", status: "Invited",   last: "—",        avatar: "E" },
    { name: "Marcus Kim",      email: "marcus@startup.co",       role: "Viewer", status: "Suspended", last: "5d ago",   avatar: "M" },
  ]);
  const blank: AdminUser = { name: "", email: "", role: "Viewer", status: "Invited", last: "—", avatar: "?" };

  return (
    <>
      <PageHeader
        title="Users"
        subtitle="Manage team members and access to your admin panel."
        action={
          <button
            onClick={() => crud.open("create", blank)}
            className="bg-primary text-on-primary font-bold px-5 py-3 rounded-full glow-primary hover:scale-105 transition-transform flex items-center gap-2"
          >
            <Icon name="person_add" className="text-[18px]" /> Invite User
          </button>
        }
      />

      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { l: "Total",     v: crud.items.length,                                       i: "group"    },
          { l: "Active",    v: crud.items.filter((u) => u.status === "Active").length,    i: "verified" },
          { l: "Invited",   v: crud.items.filter((u) => u.status === "Invited").length,   i: "mail"     },
          { l: "Suspended", v: crud.items.filter((u) => u.status === "Suspended").length, i: "block"    },
        ].map((s) => (
          <div key={s.l} className="glass-panel rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Icon name={s.i} />
            </div>
            <div>
              <p className="text-xs uppercase text-on-surface-variant opacity-60">{s.l}</p>
              <p className="font-bold text-on-surface text-lg">{s.v}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Table */}
      <div className="glass-panel rounded-3xl overflow-hidden">
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_140px] gap-4 px-6 py-4 border-b border-outline-variant/30 text-xs uppercase tracking-widest text-on-surface-variant opacity-60">
          <span>User</span><span>Role</span><span>Status</span><span>Last Active</span><span className="text-right">Actions</span>
        </div>

        {crud.items.map((u) => (
          <div key={u.id} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_140px] gap-3 md:gap-4 px-4 md:px-6 py-4 border-b border-outline-variant/20 hover:bg-white/[0.03] md:items-center">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0">
                {u.avatar}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-on-surface truncate">{u.name}</p>
                <p className="text-xs text-on-surface-variant opacity-60 truncate">{u.email}</p>
              </div>
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider text-${roleColor[u.role] || "primary"}`}>
              {u.role}
            </span>
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-${statusColor[u.status] || "primary"} w-fit`}>
              <span className={`w-1.5 h-1.5 rounded-full bg-${statusColor[u.status] || "primary"}`} />
              {u.status}
            </span>
            <span className="text-sm text-on-surface-variant opacity-70">{u.last}</span>
            <RowActions
              onView={() => crud.open("view", u)}
              onEdit={() => crud.open("edit", u)}
              onDelete={() => crud.setConfirm(u)}
            />
          </div>
        ))}
      </div>

      <Modal
        open={crud.mode !== null}
        onClose={crud.close}
        mode={crud.mode}
        icon="person"
        title={crud.mode === "view" ? "User Details" : crud.mode === "edit" ? "Edit User" : "Invite User"}
        footer={<ModalFooter mode={crud.mode} onClose={crud.close} onSave={crud.save} />}
      >
        {crud.current && (crud.mode === "view" ? (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 text-primary flex items-center justify-center font-bold text-2xl">
                {crud.current.avatar}
              </div>
              <div>
                <h3 className="font-bold text-on-surface text-lg">{crud.current.name}</h3>
                <p className="text-sm text-on-surface-variant opacity-70">{crud.current.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <DetailRow label="Role"         value={<span className={`text-${roleColor[crud.current.role] || "primary"} font-bold`}>{crud.current.role}</span>} />
              <DetailRow label="Status"       value={<span className={`text-${statusColor[crud.current.status] || "primary"} font-bold`}>{crud.current.status}</span>} />
              <DetailRow label="Last Active"  value={crud.current.last} />
              <DetailRow label="Avatar Initial" value={crud.current.avatar} />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Name">
                <input className={inputCls} value={crud.current.name} onChange={(e) => crud.update({ name: e.target.value, avatar: (e.target.value[0] || "?").toUpperCase() })} />
              </Field>
              <Field label="Email">
                <input className={inputCls} value={crud.current.email} onChange={(e) => crud.update({ email: e.target.value })} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Role">
                <select className={inputCls} value={crud.current.role} onChange={(e) => crud.update({ role: e.target.value })}>
                  <option>Owner</option><option>Editor</option><option>Viewer</option>
                </select>
              </Field>
              <Field label="Status">
                <select className={inputCls} value={crud.current.status} onChange={(e) => crud.update({ status: e.target.value })}>
                  <option>Active</option><option>Invited</option><option>Suspended</option>
                </select>
              </Field>
            </div>
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
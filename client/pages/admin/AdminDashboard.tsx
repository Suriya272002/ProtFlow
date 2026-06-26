import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { ROUTES } from "../../lib/routes";
import { adminApi, isAuthed, setToken } from "../../lib/admin-api";
import { useBackendCrud, useSingleton } from "../../hooks/useBackendCrud";

const Icon = ({ name, className = "", fill = false }: { name: string; className?: string; fill?: boolean }) => (
  <span className={`material-symbols-outlined ${className}`} style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}>
    {name}
  </span>
);

const NAV_MAIN = [
  { icon: "dashboard", label: "Dashboard" },
  { icon: "token", label: "Hero Section" },
  { icon: "person", label: "About" },
  { icon: "school", label: "Education" },
  { icon: "deployed_code", label: "Skills" },
  { icon: "work", label: "Projects" },
  { icon: "history", label: "Experience" },
  { icon: "handshake", label: "Services" },
];

const NAV_OPS = [
  { icon: "mail", label: "Messages", badge: "12" },
  { icon: "group", label: "Users" },
  { icon: "analytics", label: "Analytics" },
  { icon: "outgoing_mail", label: "SMTP Mail" },
  { icon: "palette", label: "Appearance" },
  { icon: "tune", label: "Customization" },
  { icon: "settings", label: "Settings" },
];

function SidebarNavItem({
  icon, label, active, badge, collapsed, onClick,
}: { icon: string; label: string; active: boolean; badge?: string; collapsed: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={`w-full text-left py-2.5 ${collapsed ? "px-0 justify-center" : "px-3"} rounded-xl flex items-center gap-3 transition-all duration-200 group relative ${
        active
          ? "bg-primary/15 text-primary border border-primary/20"
          : "text-on-surface-variant hover:bg-white/5 hover:text-on-surface border border-transparent"
      }`}
    >
      <Icon name={icon} className={`text-[20px] ${active ? "text-primary" : "group-hover:text-primary"}`} fill={active} />
      {!collapsed && <span className="text-sm font-medium truncate">{label}</span>}
      {!collapsed && badge && (
        <span className="ml-auto bg-primary text-on-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full">{badge}</span>
      )}
      {!collapsed && active && !badge && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
      {collapsed && badge && (
        <span className="absolute top-1 right-1 bg-primary text-on-primary text-[9px] font-bold px-1 rounded-full">{badge}</span>
      )}
    </button>
  );
}

export function AdminDashboard() {
  const [active, setActive] = useState("Dashboard");
  const [authed, setAuthed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setAuthed(isAuthed());
    setCollapsed(localStorage.getItem("admin_sidebar_collapsed") === "1");
    if (isAuthed()) {
      adminApi.getDashboard().then((d) => setUnreadCount(d.counts.unread)).catch(() => {});
    }
  }, [authed]);

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      const next = !c;
      localStorage.setItem("admin_sidebar_collapsed", next ? "1" : "0");
      return next;
    });
  };

  const signIn = () => setAuthed(true);
  const signOut = () => {
    setToken(null);
    localStorage.removeItem("admin_authed");
    setAuthed(false);
  };

  if (!authed) return <AdminLogin onSignIn={signIn} />;

  const sidebarWidth = collapsed ? "w-20" : "w-72";
  const mainOffset = collapsed ? "lg:ml-20" : "lg:ml-72";

  const pick = (label: string) => { setActive(label); setSidebarOpen(false); };

  return (
    <div className="bg-background min-h-screen">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 py-3 glass-panel border-b border-outline-variant">
        <button onClick={() => setSidebarOpen(true)} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-on-surface">
          <Icon name="menu" />
        </button>
        <span className="font-bold tracking-tighter text-primary">PORTFOLIO.</span>
        <span className="w-10" />
      </div>

      {/* Sidebar backdrop on mobile */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="lg:hidden fixed inset-0 bg-black/60 z-40" />}

      {/* SIDEBAR */}
      <aside className={`fixed left-0 top-0 h-screen ${sidebarWidth} flex flex-col glass-panel border-r border-outline-variant z-50 py-5 overflow-y-auto custom-scrollbar transition-all duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className={`${collapsed ? "px-0 justify-center" : "px-6"} mb-6 flex items-center gap-3 relative`}>
          <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
            <Icon name="dashboard" fill />
          </div>
          {!collapsed && (
            <div className="leading-tight min-w-0">
              <span className="block font-bold tracking-tighter text-primary text-lg truncate">PORTFOLIO.</span>
              <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60">Admin Panel</span>
            </div>
          )}
        </div>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={toggleCollapsed}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden lg:flex absolute top-6 -right-3 w-7 h-7 rounded-full bg-primary text-on-primary items-center justify-center shadow-lg hover:scale-110 transition-transform z-10"
        >
          <Icon name={collapsed ? "chevron_right" : "chevron_left"} className="text-[16px]" />
        </button>

        <div className={`flex-1 ${collapsed ? "px-2" : "px-3"} space-y-0.5`}>
          {!collapsed && <div className="px-3 mb-1 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-50">Main Menu</div>}
          {NAV_MAIN.map((n) => (
            <SidebarNavItem key={n.label} icon={n.icon} label={n.label} active={active === n.label} collapsed={collapsed} onClick={() => pick(n.label)} />
          ))}
          {!collapsed && <div className="px-3 mt-5 mb-1 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-50">Operations</div>}
          {collapsed && <div className="my-3 mx-3 border-t border-white/10" />}
          {NAV_OPS.map((n) => (
            <SidebarNavItem key={n.label} icon={n.icon} label={n.label} badge={n.label === "Messages" && unreadCount > 0 ? String(unreadCount) : n.badge} active={active === n.label} collapsed={collapsed} onClick={() => pick(n.label)} />
          ))}
        </div>
        <div className={`mt-auto ${collapsed ? "px-2" : "px-6"} py-4 border-t border-outline-variant/30 space-y-2`}>
          <Link to={ROUTES.HOME} title="View Site" className={`w-full flex items-center ${collapsed ? "justify-center" : "gap-4"} text-on-surface-variant py-3 ${collapsed ? "px-0" : "px-4"} rounded-xl hover:bg-white/5 transition-colors`}>
            <Icon name="public" />
            {!collapsed && <span className="font-label-sm text-label-sm">View Site</span>}
          </Link>
          <button onClick={signOut} title="Sign Out" className={`w-full flex items-center ${collapsed ? "justify-center" : "gap-4"} text-on-error py-3 ${collapsed ? "px-0" : "px-4"} rounded-xl hover:bg-error/10 transition-colors`}>
            <Icon name="logout" />
            {!collapsed && <span className="font-label-sm text-label-sm">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className={`${mainOffset} p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 max-w-[1600px] mx-auto relative z-10 transition-all duration-300`}>
        {active === "Dashboard" && <DashboardPage />}
        {active === "Hero Section" && <HeroEditor />}
        {active === "About" && <AboutEditor />}
        {active === "Education" && <ListEditor title="Education" icon="school" columns={["Degree", "Institution", "Year"]} api={{ list: adminApi.listEducation, create: adminApi.createEducation, update: adminApi.updateEducation, remove: adminApi.deleteEducation }} />}
        {active === "Skills" && <SkillsEditor />}
        {active === "Projects" && <ProjectsEditor />}
        {active === "Experience" && <ListEditor title="Experience" icon="history" columns={["Role", "Company", "Period"]} api={{ list: adminApi.listExperience, create: adminApi.createExperience, update: adminApi.updateExperience, remove: adminApi.deleteExperience }} />}
        {active === "Services" && <ServicesEditor />}
        {active === "Messages" && <MessagesPage />}
        {active === "Users" && <UsersPage />}
        {active === "Analytics" && <AnalyticsPage />}
        {active === "SMTP Mail" && <SmtpPage />}
        {active === "Appearance" && <AppearancePage />}
        {active === "Customization" && <CustomizationPage />}
        {active === "Settings" && <SettingsPage />}
      </main>

      {/* Floating controls */}
      <div className="fixed bottom-6 right-6 flex gap-3 z-[100]">
        <button className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-primary hover:scale-110 transition-all hover:bg-primary/20" title="System Status">
          <Icon name="settings_suggest" />
        </button>
        <button className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-secondary-fixed hover:scale-110 transition-all hover:bg-secondary-fixed/20" title="Help Center">
          <Icon name="help_center" />
        </button>
      </div>
    </div>
  );
}

/* ============== Admin Login ============== */
function AdminLogin({ onSignIn }: { onSignIn: () => void }) {
  const [email, setEmail] = useState("admin@portfolio.dev");
  const [password, setPassword] = useState("admin");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || password.length < 3) {
      setError("Enter a valid email and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await adminApi.login({ email, password });
      setToken(res.token);
      localStorage.setItem("admin_authed", "1");
      onSignIn();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center px-4">
      <div className="animated-bg" aria-hidden="true">
        <div className="orb o1" /><div className="orb o2" /><div className="orb o3" /><div className="grid-overlay" />
      </div>
      <div className="relative z-10 w-full max-w-md">
        <Link to={ROUTES.HOME} className="flex items-center gap-2 text-on-surface-variant hover:text-primary text-sm mb-6">
          <Icon name="arrow_back" className="text-[18px]" /> Back to site
        </Link>
        <div className="glass-panel rounded-3xl p-8 sm:p-10 space-y-6 border border-white/10">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/15 text-primary flex items-center justify-center">
              <Icon name="admin_panel_settings" fill />
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">Admin Login</h1>
            <p className="text-sm text-on-surface-variant opacity-70">Sign in to manage your portfolio.</p>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <Field label="Email">
              <input className={inputCls} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
            </Field>
            <Field label="Password">
              <div className="relative">
                <input className={`${inputCls} pr-12`} type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
                <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary">
                  <Icon name={showPw ? "visibility_off" : "visibility"} className="text-[18px]" />
                </button>
              </div>
            </Field>
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-on-surface-variant cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-primary" /> Remember me
              </label>
              <a href="#" className="text-primary hover:underline">Forgot password?</a>
            </div>
            {error && <p className="text-error text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-primary text-on-primary font-bold glow-primary hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-60">
              <Icon name="login" className="text-[18px]" /> {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <div className="text-center text-xs text-on-surface-variant opacity-60">Default: admin@portfolio.dev / admin</div>
        </div>
      </div>
    </div>
  );
}

/* ============== Users Page ============== */
type AdminUser = { id?: number | string; name: string; email: string; role: string; status: string; last: string; avatar: string };

function UsersPage() {
  const crud = useBackendCrud({
    list: adminApi.listUsers,
    create: adminApi.createUser,
    update: adminApi.updateUser,
    remove: adminApi.deleteUser,
  });
  const blank: AdminUser = { name: "", email: "", role: "Viewer", status: "Invited", last: "—", avatar: "?" };
  const roleColor: Record<string, string> = { Owner: "primary", Editor: "secondary-fixed", Viewer: "tertiary" };
  const statusColor: Record<string, string> = { Active: "secondary-fixed", Invited: "primary", Suspended: "error" };
  return (
    <>
      <PageHeader
        title="Users"
        subtitle="Manage team members and access to your admin panel."
        action={
          <button onClick={() => crud.open("create", blank)} className="bg-primary text-on-primary font-bold px-5 py-3 rounded-full glow-primary hover:scale-105 transition-transform flex items-center gap-2">
            <Icon name="person_add" className="text-[18px]" /> Invite User
          </button>
        }
      />
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { l: "Total", v: crud.items.length, i: "group" },
          { l: "Active", v: crud.items.filter((u) => u.status === "Active").length, i: "verified" },
          { l: "Invited", v: crud.items.filter((u) => u.status === "Invited").length, i: "mail" },
          { l: "Suspended", v: crud.items.filter((u) => u.status === "Suspended").length, i: "block" },
        ].map((s) => (
          <div key={s.l} className="glass-panel rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><Icon name={s.i} /></div>
            <div><p className="text-xs uppercase text-on-surface-variant opacity-60">{s.l}</p><p className="font-bold text-on-surface text-lg">{s.v}</p></div>
          </div>
        ))}
      </section>
      <div className="glass-panel rounded-3xl overflow-hidden">
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_140px] gap-4 px-6 py-4 border-b border-outline-variant/30 text-xs uppercase tracking-widest text-on-surface-variant opacity-60">
          <span>User</span><span>Role</span><span>Status</span><span>Last Active</span><span className="text-right">Actions</span>
        </div>
        {crud.items.map((u) => (
          <div key={u.id} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_140px] gap-3 md:gap-4 px-4 md:px-6 py-4 border-b border-outline-variant/20 hover:bg-white/[0.03] md:items-center">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0">{u.avatar}</div>
              <div className="min-w-0">
                <p className="font-bold text-on-surface truncate">{u.name}</p>
                <p className="text-xs text-on-surface-variant opacity-60 truncate">{u.email}</p>
              </div>
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider text-${roleColor[u.role] || "primary"}`}>{u.role}</span>
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-${statusColor[u.status] || "primary"} w-fit`}>
              <span className={`w-1.5 h-1.5 rounded-full bg-${statusColor[u.status] || "primary"}`} />{u.status}
            </span>
            <span className="text-sm text-on-surface-variant opacity-70">{u.last}</span>
            <RowActions onView={() => crud.open("view", u)} onEdit={() => crud.open("edit", u)} onDelete={() => crud.setConfirm(u)} />
          </div>
        ))}
      </div>

      <Modal open={crud.mode !== null} onClose={crud.close} mode={crud.mode} icon="person" title={crud.mode === "view" ? "User Details" : crud.mode === "edit" ? "Edit User" : "Invite User"} footer={<ModalFooter mode={crud.mode} onClose={crud.close} onSave={() => void crud.save()} saving={crud.saving} />}>
        {crud.current && (crud.mode === "view" ? (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 text-primary flex items-center justify-center font-bold text-2xl">{crud.current.avatar}</div>
              <div><h3 className="font-bold text-on-surface text-lg">{crud.current.name}</h3><p className="text-sm text-on-surface-variant opacity-70">{crud.current.email}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <DetailRow label="Role" value={<span className={`text-${roleColor[crud.current.role] || "primary"} font-bold`}>{crud.current.role}</span>} />
              <DetailRow label="Status" value={<span className={`text-${statusColor[crud.current.status] || "primary"} font-bold`}>{crud.current.status}</span>} />
              <DetailRow label="Last Active" value={crud.current.last} />
              <DetailRow label="Avatar Initial" value={crud.current.avatar} />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Name"><input className={inputCls} value={crud.current.name} onChange={(e) => crud.update({ name: e.target.value, avatar: (e.target.value[0] || "?").toUpperCase() })} /></Field>
              <Field label="Email"><input className={inputCls} value={crud.current.email} onChange={(e) => crud.update({ email: e.target.value })} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Role"><select className={inputCls} value={crud.current.role} onChange={(e) => crud.update({ role: e.target.value })}><option>Owner</option><option>Editor</option><option>Viewer</option></select></Field>
              <Field label="Status"><select className={inputCls} value={crud.current.status} onChange={(e) => crud.update({ status: e.target.value })}><option>Active</option><option>Invited</option><option>Suspended</option></select></Field>
            </div>
          </div>
        ))}
      </Modal>
      <ConfirmDelete open={!!crud.confirm} onClose={() => crud.setConfirm(null)} onConfirm={() => crud.confirm && crud.remove(crud.confirm)} name={crud.confirm?.name || ""} />
    </>
  );
}

/* ============== Shared ============== */
function PageHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) {
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-label-sm font-label-sm uppercase tracking-widest text-on-surface-variant opacity-70 mb-2">{label}</span>
      {children}
    </label>
  );
}

const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary/50 transition";

function SaveBtn({ onClick, label = "Save Changes", saving, saved }: { onClick?: () => void; label?: string; saving?: boolean; saved?: boolean }) {
  return (
    <button onClick={onClick} disabled={saving} className="bg-primary text-on-primary font-bold px-6 py-3 rounded-full glow-primary hover:scale-105 transition-transform flex items-center gap-2 disabled:opacity-60">
      <Icon name="save" className="text-[18px]" /> {saved ? "Saved!" : saving ? "Saving..." : label}
    </button>
  );
}

/* ============== Reusable Modal System ============== */
type ModalMode = "view" | "edit" | "create" | null;

function Modal({ open, onClose, title, icon, mode, children, footer, maxWidth = "max-w-2xl" }: { open: boolean; onClose: () => void; title: string; icon?: string; mode?: ModalMode; children: React.ReactNode; footer?: React.ReactNode; maxWidth?: string }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);
  if (!open) return null;
  const badge = mode === "view" ? { l: "Read only", c: "bg-primary/15 text-primary" } : mode === "edit" ? { l: "Editing", c: "bg-secondary-fixed/15 text-secondary-fixed" } : mode === "create" ? { l: "New entry", c: "bg-tertiary/15 text-tertiary" } : null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className={`relative w-full ${maxWidth} max-h-[90vh] flex flex-col glass-panel rounded-3xl border border-white/10 shadow-2xl overflow-hidden`}>
        <div className="flex items-center gap-3 px-6 py-4 border-b border-outline-variant/30">
          {icon && <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0"><Icon name={icon} fill /></div>}
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-on-surface truncate">{title}</h3>
            {badge && <span className={`inline-block mt-0.5 text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${badge.c}`}>{badge.l}</span>}
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl text-on-surface-variant hover:bg-white/5 hover:text-on-surface flex items-center justify-center"><Icon name="close" /></button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-5">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-outline-variant/30 flex items-center justify-end gap-2 bg-surface-variant/20">{footer}</div>}
      </div>
    </div>
  );
}

function ConfirmDelete({ open, onClose, onConfirm, name }: { open: boolean; onClose: () => void; onConfirm: () => void; name: string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-md glass-panel rounded-3xl border border-error/30 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-error/15 text-error flex items-center justify-center shrink-0"><Icon name="delete_forever" fill /></div>
          <div className="flex-1">
            <h3 className="font-bold text-on-surface text-lg">Are you sure you want to delete?</h3>
            <p className="text-sm text-on-surface-variant opacity-70 mt-1">This will permanently remove <span className="text-on-surface font-bold">{name}</span>. This action cannot be undone.</p>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-white/5 text-on-surface font-bold hover:bg-white/10">Cancel</button>
          <button onClick={() => { onConfirm(); onClose(); }} className="px-5 py-2.5 rounded-xl bg-error text-on-error font-bold hover:scale-[1.02] transition-transform flex items-center gap-2"><Icon name="delete" className="text-[18px]" />Delete</button>
        </div>
      </div>
    </div>
  );
}

function RowActions({ onView, onEdit, onDelete }: { onView: () => void; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex md:justify-end gap-1">
      <button onClick={onView} title="View" className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10"><Icon name="visibility" className="text-[18px]" /></button>
      <button onClick={onEdit} title="Edit" className="p-2 rounded-lg text-on-surface-variant hover:text-secondary-fixed hover:bg-secondary-fixed/10"><Icon name="edit" className="text-[18px]" /></button>
      <button onClick={onDelete} title="Delete" className="p-2 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10"><Icon name="delete" className="text-[18px]" /></button>
    </div>
  );
}

function DetailRow({ label, value, full = false }: { label: string; value: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60 font-bold mb-1">{label}</p>
      <div className="text-on-surface break-words">{value || <span className="opacity-40">—</span>}</div>
    </div>
  );
}

function ModalFooter({ mode, onClose, onSave, saving }: { mode: ModalMode; onClose: () => void; onSave?: () => void; saving?: boolean }) {
  if (mode === "view") return <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-white/5 text-on-surface font-bold hover:bg-white/10">Close</button>;
  return (
    <>
      <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-white/5 text-on-surface font-bold hover:bg-white/10">Cancel</button>
      <button disabled={saving} onClick={() => onSave?.()} className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold glow-primary hover:scale-[1.02] transition-transform flex items-center gap-2 disabled:opacity-60"><Icon name="save" className="text-[18px]" />{saving ? "Saving..." : mode === "create" ? "Create" : "Save"}</button>
    </>
  );
}

function useCrud<T extends { id?: string | number }>(initial: T[]) {
  const [items, setItems] = useState<T[]>(initial.map((it, i) => ({ ...it, id: it.id ?? i })));
  const [mode, setMode] = useState<ModalMode>(null);
  const [current, setCurrent] = useState<T | null>(null);
  const [confirm, setConfirm] = useState<T | null>(null);
  const open = (m: ModalMode, item: T | null) => { setCurrent(item ? { ...item } : null); setMode(m); };
  const close = () => { setMode(null); setCurrent(null); };
  const update = (patch: Partial<T>) => setCurrent((c) => (c ? { ...c, ...patch } : c));
  const save = () => {
    if (!current) return;
    setItems((arr) => {
      const exists = arr.some((x) => x.id === current.id);
      return exists ? arr.map((x) => (x.id === current.id ? current : x)) : [...arr, { ...current, id: current.id ?? Date.now() }];
    });
  };
  const remove = (item: T) => setItems((arr) => arr.filter((x) => x.id !== item.id));
  return { items, mode, current, confirm, setConfirm, open, close, update, save, remove };
}

/* ============== Dashboard ============== */
function DashboardPage() {
  const [data, setData] = useState<{ stats: { label: string; value: string; delta: string; icon: string; color?: string; sub?: string }[]; sections: { id: number; title: string; icon: string; subtitle: string; published: boolean; color?: string }[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboard()
      .then((d) => {
        const colors = ["primary", "secondary-fixed", "tertiary", "primary"];
        setData({
          stats: d.stats.map((s, i) => ({ ...s, color: colors[i], sub: i === 0 ? "vs last month" : i === 1 ? "new uploads" : i === 2 ? "leads generated" : "hiring rate" })),
          sections: d.sections.map((s, i) => ({ ...s, color: colors[i % colors.length] })),
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-on-surface-variant">Loading dashboard...</p>;
  if (!data) return <p className="text-error">Failed to load dashboard</p>;

  return (
    <>
      <PageHeader
        title="Dashboard Overview"
        subtitle="Welcome back. Here's what's happening with your portfolio today."
        action={
          <button className="bg-primary text-on-primary font-bold px-6 py-3 rounded-full glow-primary hover:scale-105 transition-transform">Live Preview</button>
        }
      />
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {data.stats.map((m) => (
          <div key={m.label} className="glass-panel p-6 rounded-3xl relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-widest opacity-60">{m.label}</p>
                <h3 className="font-headline-lg text-headline-lg text-on-surface mt-1">{m.value}</h3>
              </div>
              <div className={`bg-${m.color}/10 p-3 rounded-2xl`}>
                <Icon name={m.icon} className={`text-${m.color}`} fill />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-secondary-fixed">
              <Icon name="trending_up" className="text-xs" />
              <span>{m.delta}</span>
              <span className="text-on-surface-variant opacity-40 ml-1">{m.sub}</span>
            </div>
          </div>
        ))}
      </section>
      <div className="glass-panel rounded-3xl p-8">
        <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-3 mb-6">
          <Icon name="layers" className="text-primary" /> Manage Sections
        </h2>
        <div className="space-y-3">
          {data.sections.map((s) => <SectionRow key={s.id} id={s.id} icon={s.icon} title={s.title} sub={s.subtitle} published={s.published} color={s.color || "primary"} />)}
        </div>
      </div>
    </>
  );
}

function SectionRow({ id, icon, title, sub, published, color }: { id: number; icon: string; title: string; sub: string; published: boolean; color: string }) {
  const [on, setOn] = useState(published);
  const toggle = async (checked: boolean) => {
    setOn(checked);
    try {
      await adminApi.updateSection(id, checked);
    } catch {
      setOn(!checked);
    }
  };
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 hover:bg-white/[0.08] transition-all flex-wrap gap-3">
      <div className="flex items-center gap-4">
        <Icon name="drag_indicator" className="text-on-surface-variant cursor-grab" />
        <div className={`w-12 h-12 rounded-xl bg-${color}/10 flex items-center justify-center text-${color}`}>
          <Icon name={icon} />
        </div>
        <div>
          <h4 className="font-bold text-on-surface">{title}</h4>
          <p className="text-xs text-on-surface-variant opacity-60">{sub}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <span className={`text-xs uppercase tracking-wider ${on ? "text-secondary-fixed" : "text-on-surface-variant/40"}`}>{on ? "Published" : "Draft"}</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input checked={on} onChange={(e) => void toggle(e.target.checked)} className="sr-only peer" type="checkbox" />
          <div className="w-11 h-6 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
        </label>
      </div>
    </div>
  );
}

/* ============== Hero ============== */
function HeroEditor() {
  const loadHero = useCallback(() => adminApi.getHero(), []);
  const saveHero = useCallback((data: Parameters<typeof adminApi.saveHero>[0]) => adminApi.saveHero(data), []);
  const { data: d, loading, saving, saved, save, update, error } = useSingleton(loadHero, saveHero);

  if (loading || !d) return <p className="text-on-surface-variant">{loading ? "Loading hero section..." : "Failed to load"}</p>;
  const upd = (k: keyof typeof d, v: unknown) => update({ [k]: v } as Partial<typeof d>);
  return (
    <>
      <PageHeader title="Hero Section" subtitle="Edit every element shown in the user-side hero." action={<SaveBtn onClick={() => void save()} saving={saving} saved={saved} />} />
      {error && <p className="text-error text-sm mb-4">{error}</p>}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel rounded-3xl p-8 space-y-5">
          <Field label="Greeting Tag"><input className={inputCls} value={d.tag} onChange={(e) => upd("tag", e.target.value)} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Name"><input className={inputCls} value={d.name} onChange={(e) => upd("name", e.target.value)} /></Field>
            <Field label="Accent Color"><input className={inputCls} value={d.accent} onChange={(e) => upd("accent", e.target.value)} /></Field>
          </div>
          <Field label="Role / Tagline"><input className={inputCls} value={d.role} onChange={(e) => upd("role", e.target.value)} /></Field>
          <Field label="Description"><textarea rows={4} className={inputCls} value={d.desc} onChange={(e) => upd("desc", e.target.value)} /></Field>
          <Field label="Tech Stack (comma separated icons)"><input className={inputCls} value={d.techStack} onChange={(e) => upd("techStack", e.target.value)} /></Field>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Years Exp."><input className={inputCls} value={d.years} onChange={(e) => upd("years", e.target.value)} /></Field>
            <Field label="Projects"><input className={inputCls} value={d.projects} onChange={(e) => upd("projects", e.target.value)} /></Field>
            <Field label="Clients"><input className={inputCls} value={d.clients} onChange={(e) => upd("clients", e.target.value)} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Primary CTA"><input className={inputCls} value={d.cta1} onChange={(e) => upd("cta1", e.target.value)} /></Field>
            <Field label="Secondary CTA"><input className={inputCls} value={d.cta2} onChange={(e) => upd("cta2", e.target.value)} /></Field>
          </div>
          <Field label="Resume / CV URL"><input className={inputCls} value={d.cvUrl} onChange={(e) => upd("cvUrl", e.target.value)} /></Field>
          <div className="grid sm:grid-cols-2 gap-3 pt-3 border-t border-outline-variant/20">
            {[
              { k: "showStats", l: "Show stats counters", i: "tag" },
              { k: "showStack", l: "Show tech stack", i: "deployed_code" },
              { k: "typing", l: "Typing animation", i: "keyboard" },
              { k: "floatCards", l: "Floating cards FX", i: "auto_awesome" },
            ].map((o) => (
              <label key={o.k} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.03] cursor-pointer">
                <span className="flex items-center gap-2 text-sm text-on-surface"><Icon name={o.i} className="text-primary text-[18px]" />{o.l}</span>
                <input type="checkbox" checked={(d as any)[o.k]} onChange={(e) => upd(o.k as any, e.target.checked)} className="accent-primary w-4 h-4" />
              </label>
            ))}
          </div>
        </div>
        <div className="glass-panel rounded-3xl p-6 space-y-4">
          <h3 className="font-bold text-on-surface flex items-center gap-2"><Icon name="image" className="text-primary" /> Avatar</h3>
          <div className="aspect-square rounded-2xl overflow-hidden bg-surface-variant/40 border border-outline-variant/40">
            <img src={d.avatar} alt="" className="w-full h-full object-cover" />
          </div>
          <Field label="Avatar URL"><input className={inputCls} value={d.avatar} onChange={(e) => upd("avatar", e.target.value)} /></Field>
          <button className="w-full py-2.5 rounded-xl bg-primary/20 text-primary font-bold text-sm flex items-center justify-center gap-2"><Icon name="cloud_upload" className="text-[18px]" /> Upload Image</button>
        </div>
      </div>
    </>
  );
}

/* ============== About ============== */
function AboutEditor() {
  const loadAbout = useCallback(() => adminApi.getAbout(), []);
  const saveAbout = useCallback((data: Parameters<typeof adminApi.saveAbout>[0]) => adminApi.saveAbout(data), []);
  const { data: d, loading, saving, saved, save, update, error } = useSingleton(loadAbout, saveAbout);

  if (loading || !d) return <p className="text-on-surface-variant">{loading ? "Loading about section..." : "Failed to load"}</p>;
  const upd = (k: keyof typeof d, v: unknown) => update({ [k]: v } as Partial<typeof d>);
  return (
    <>
      <PageHeader title="About" subtitle="Every detail of the user-side About section." action={<SaveBtn onClick={() => void save()} saving={saving} saved={saved} />} />
      {error && <p className="text-error text-sm mb-4">{error}</p>}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel rounded-3xl p-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Section Title"><input className={inputCls} value={d.title} onChange={(e) => upd("title", e.target.value)} /></Field>
            <Field label="Eyebrow Tag"><input className={inputCls} value={d.tag} onChange={(e) => upd("tag", e.target.value)} /></Field>
          </div>
          <Field label="Short Bio"><textarea rows={3} className={inputCls} value={d.bio} onChange={(e) => upd("bio", e.target.value)} /></Field>
          <Field label="Long Bio"><textarea rows={5} className={inputCls} value={d.longBio} onChange={(e) => upd("longBio", e.target.value)} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Location"><input className={inputCls} value={d.location} onChange={(e) => upd("location", e.target.value)} /></Field>
            <Field label="Availability"><input className={inputCls} value={d.availability} onChange={(e) => upd("availability", e.target.value)} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Email"><input className={inputCls} value={d.email} onChange={(e) => upd("email", e.target.value)} /></Field>
            <Field label="Phone"><input className={inputCls} value={d.phone} onChange={(e) => upd("phone", e.target.value)} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Languages"><input className={inputCls} value={d.languages} onChange={(e) => upd("languages", e.target.value)} /></Field>
            <Field label="Interests"><input className={inputCls} value={d.interests} onChange={(e) => upd("interests", e.target.value)} /></Field>
          </div>
          <Field label="Resume URL"><input className={inputCls} value={d.resume} onChange={(e) => upd("resume", e.target.value)} /></Field>
        </div>
        <div className="glass-panel rounded-3xl p-6 space-y-4">
          <h3 className="font-bold text-on-surface flex items-center gap-2"><Icon name="badge" className="text-primary" /> Highlight Card</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Stat Value"><input className={inputCls} value={d.statValue} onChange={(e) => upd("statValue", e.target.value)} /></Field>
            <Field label="Stat Label"><input className={inputCls} value={d.statLabel} onChange={(e) => upd("statLabel", e.target.value)} /></Field>
          </div>
          <Field label="About Image URL"><input className={inputCls} value={d.image} onChange={(e) => upd("image", e.target.value)} /></Field>
          <div className="aspect-square rounded-2xl overflow-hidden bg-surface-variant/40 border border-outline-variant/40"><img src={d.image} alt="" className="w-full h-full object-cover" /></div>
        </div>
      </div>
    </>
  );
}

/* ============== List editor (Education/Experience) ============== */
type ListItem = { id?: number | string; a: string; b: string; c: string; d?: string };

function ListEditor({ title, icon, columns, api }: { title: string; icon: string; columns: [string, string, string]; api: { list: () => Promise<ListItem[]>; create: (item: ListItem) => Promise<ListItem>; update: (id: number, item: ListItem) => Promise<ListItem>; remove: (id: number) => Promise<void> } }) {
  const crud = useBackendCrud(api);
  const blank: ListItem = { a: "", b: "", c: "", d: "" };
  return (
    <>
      <PageHeader
        title={title}
        subtitle={`Manage your ${title.toLowerCase()} entries — appears live on the user portfolio.`}
        action={
          <button onClick={() => crud.open("create", blank)} className="bg-primary text-on-primary font-bold px-5 py-3 rounded-full glow-primary hover:scale-105 transition-transform flex items-center gap-2">
            <Icon name="add" className="text-[18px]" /> Add Entry
          </button>
        }
      />
      <div className="glass-panel rounded-3xl overflow-hidden">
        <div className="hidden md:grid grid-cols-[1fr_1fr_180px_140px] gap-4 px-6 py-4 border-b border-outline-variant/30 text-xs uppercase tracking-widest text-on-surface-variant opacity-60">
          <span>{columns[0]}</span><span>{columns[1]}</span><span>{columns[2]}</span><span className="text-right">Actions</span>
        </div>
        {crud.items.map((it) => (
          <div key={it.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_180px_140px] gap-2 md:gap-4 px-4 md:px-6 py-4 md:py-5 border-b border-outline-variant/20 hover:bg-white/[0.03] md:items-center">
            <div className="flex items-center gap-3 min-w-0"><Icon name={icon} className="text-primary shrink-0" /><span className="font-bold text-on-surface truncate">{it.a}</span></div>
            <span className="text-on-surface-variant text-sm md:text-base truncate">{it.b}</span>
            <span className="text-on-surface-variant text-xs md:text-sm opacity-70">{it.c}</span>
            <RowActions onView={() => crud.open("view", it)} onEdit={() => crud.open("edit", it)} onDelete={() => crud.setConfirm(it)} />
          </div>
        ))}
        {crud.items.length === 0 && <div className="px-6 py-10 text-center text-on-surface-variant opacity-60 text-sm">No entries yet. Click <b className="text-primary">Add Entry</b> to create one.</div>}
      </div>

      <Modal open={crud.mode !== null} onClose={crud.close} mode={crud.mode} icon={icon} title={crud.mode === "view" ? `${title} Details` : crud.mode === "edit" ? `Edit ${title}` : `New ${title}`} footer={<ModalFooter mode={crud.mode} onClose={crud.close} onSave={() => void crud.save()} saving={crud.saving} />}>
        {crud.current && (crud.mode === "view" ? (
          <div className="grid grid-cols-2 gap-5">
            <DetailRow label={columns[0]} value={crud.current.a} />
            <DetailRow label={columns[1]} value={crud.current.b} />
            <DetailRow label={columns[2]} value={crud.current.c} />
            <DetailRow label="Description" value={crud.current.d} full />
          </div>
        ) : (
          <div className="space-y-4">
            <Field label={columns[0]}><input className={inputCls} value={crud.current.a} onChange={(e) => crud.update({ a: e.target.value })} /></Field>
            <Field label={columns[1]}><input className={inputCls} value={crud.current.b} onChange={(e) => crud.update({ b: e.target.value })} /></Field>
            <Field label={columns[2]}><input className={inputCls} value={crud.current.c} onChange={(e) => crud.update({ c: e.target.value })} /></Field>
            <Field label="Description"><textarea rows={4} className={inputCls} value={crud.current.d || ""} onChange={(e) => crud.update({ d: e.target.value })} /></Field>
          </div>
        ))}
      </Modal>
      <ConfirmDelete open={!!crud.confirm} onClose={() => crud.setConfirm(null)} onConfirm={() => crud.confirm && void crud.remove(crud.confirm)} name={crud.confirm?.a || ""} />
      {crud.loading && <p className="text-on-surface-variant text-sm mt-4">Loading...</p>}
      {crud.error && <p className="text-error text-sm mt-4">{crud.error}</p>}
    </>
  );
}

/* ============== Skills ============== */
type Skill = { id?: number | string; name: string; level: number; category: string; icon: string };

function SkillsEditor() {
  const crud = useBackendCrud({
    list: adminApi.listSkills,
    create: adminApi.createSkill,
    update: adminApi.updateSkill,
    remove: adminApi.deleteSkill,
  });
  const blank: Skill = { name: "", level: 50, category: "", icon: "bolt" };
  return (
    <>
      <PageHeader title="Skills" subtitle="Every skill chip on the user-side Skills section." action={<button onClick={() => crud.open("create", blank)} className="bg-primary text-on-primary font-bold px-5 py-3 rounded-full glow-primary flex items-center gap-2"><Icon name="add" className="text-[18px]" />Add Skill</button>} />
      <div className="glass-panel rounded-3xl overflow-hidden">
        <div className="hidden md:grid grid-cols-[1.5fr_1fr_2fr_140px] gap-4 px-6 py-4 border-b border-outline-variant/30 text-xs uppercase tracking-widest text-on-surface-variant opacity-60">
          <span>Skill</span><span>Category</span><span>Level</span><span className="text-right">Actions</span>
        </div>
        {crud.items.map((s) => (
          <div key={s.id} className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_2fr_140px] gap-3 px-4 md:px-6 py-4 border-b border-outline-variant/20 hover:bg-white/[0.03] md:items-center">
            <div className="flex items-center gap-3 min-w-0"><div className="w-9 h-9 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0"><Icon name={s.icon} /></div><span className="font-bold text-on-surface truncate">{s.name}</span></div>
            <span className="text-xs uppercase tracking-wider text-secondary-fixed font-bold">{s.category}</span>
            <div className="flex items-center gap-3 min-w-0"><div className="flex-1 h-2 bg-surface-variant/40 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-primary to-primary-container" style={{ width: `${s.level}%` }} /></div><span className="text-xs text-on-surface-variant font-bold w-10 text-right">{s.level}%</span></div>
            <RowActions onView={() => crud.open("view", s)} onEdit={() => crud.open("edit", s)} onDelete={() => crud.setConfirm(s)} />
          </div>
        ))}
      </div>

      <Modal open={crud.mode !== null} onClose={crud.close} mode={crud.mode} icon="deployed_code" title={crud.mode === "view" ? "Skill Details" : crud.mode === "edit" ? "Edit Skill" : "New Skill"} footer={<ModalFooter mode={crud.mode} onClose={crud.close} onSave={() => void crud.save()} saving={crud.saving} />}>
        {crud.current && (crud.mode === "view" ? (
          <div className="grid grid-cols-2 gap-5">
            <DetailRow label="Name" value={crud.current.name} />
            <DetailRow label="Category" value={crud.current.category} />
            <DetailRow label="Icon" value={crud.current.icon} />
            <DetailRow label="Level" value={`${crud.current.level}%`} />
            <div className="col-span-2"><div className="h-3 bg-surface-variant/40 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-primary to-primary-container" style={{ width: `${crud.current.level}%` }} /></div></div>
          </div>
        ) : (
          <div className="space-y-4">
            <Field label="Skill Name"><input className={inputCls} value={crud.current.name} onChange={(e) => crud.update({ name: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Category"><input className={inputCls} value={crud.current.category} onChange={(e) => crud.update({ category: e.target.value })} /></Field>
              <Field label="Material Icon"><input className={inputCls} value={crud.current.icon} onChange={(e) => crud.update({ icon: e.target.value })} /></Field>
            </div>
            <Field label={`Level: ${crud.current.level}%`}><input type="range" min={0} max={100} value={crud.current.level} onChange={(e) => crud.update({ level: +e.target.value })} className="w-full accent-primary" /></Field>
          </div>
        ))}
      </Modal>
      <ConfirmDelete open={!!crud.confirm} onClose={() => crud.setConfirm(null)} onConfirm={() => crud.confirm && void crud.remove(crud.confirm)} name={crud.confirm?.name || ""} />
      {crud.loading && <p className="text-on-surface-variant text-sm mt-4">Loading skills...</p>}
      {crud.error && <p className="text-error text-sm mt-4">{crud.error}</p>}
    </>
  );
}

/* ============== Projects ============== */
type Project = { id?: number | string; title: string; tag: string; img: string; desc: string; live: string; repo: string; tech: string; featured: boolean };

function ProjectsEditor() {
  const crud = useBackendCrud({
    list: adminApi.listProjects,
    create: adminApi.createProject,
    update: adminApi.updateProject,
    remove: adminApi.deleteProject,
  });
  const blank: Project = { title: "", tag: "", img: "", desc: "", live: "", repo: "", tech: "", featured: false };
  return (
    <>
      <PageHeader title="Projects" subtitle="Curate every project card shown on the user-side Projects section." action={<button onClick={() => crud.open("create", blank)} className="bg-primary text-on-primary font-bold px-5 py-3 rounded-full glow-primary flex items-center gap-2"><Icon name="add" className="text-[18px]" />New Project</button>} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {crud.items.map((p) => (
          <div key={p.id} className="glass-panel rounded-3xl overflow-hidden group flex flex-col">
            <div className="aspect-video bg-surface-variant/40 overflow-hidden relative">
              {p.img ? <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /> : <div className="w-full h-full flex items-center justify-center text-on-surface-variant"><Icon name="image" /></div>}
              {p.featured && <span className="absolute top-3 left-3 text-[10px] uppercase font-bold bg-primary text-on-primary px-2 py-0.5 rounded-full tracking-wider">Featured</span>}
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <p className="text-xs uppercase tracking-widest text-primary mb-1">{p.tag}</p>
              <h3 className="font-bold text-on-surface mb-3">{p.title}</h3>
              <div className="flex justify-end gap-1 mt-auto">
                <RowActions onView={() => crud.open("view", p)} onEdit={() => crud.open("edit", p)} onDelete={() => crud.setConfirm(p)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={crud.mode !== null} onClose={crud.close} mode={crud.mode} icon="work" maxWidth="max-w-3xl" title={crud.mode === "view" ? "Project Details" : crud.mode === "edit" ? "Edit Project" : "New Project"} footer={<ModalFooter mode={crud.mode} onClose={crud.close} onSave={() => void crud.save()} saving={crud.saving} />}>
        {crud.current && (crud.mode === "view" ? (
          <div className="space-y-5">
            {crud.current.img && <div className="aspect-video rounded-2xl overflow-hidden bg-surface-variant/40"><img src={crud.current.img} alt="" className="w-full h-full object-cover" /></div>}
            <div className="grid grid-cols-2 gap-5">
              <DetailRow label="Title" value={crud.current.title} />
              <DetailRow label="Tag" value={crud.current.tag} />
              <DetailRow label="Tech" value={crud.current.tech} />
              <DetailRow label="Featured" value={crud.current.featured ? "Yes" : "No"} />
              <DetailRow label="Live URL" value={crud.current.live ? <a href={crud.current.live} className="text-primary underline" target="_blank" rel="noreferrer">{crud.current.live}</a> : ""} />
              <DetailRow label="Repository" value={crud.current.repo ? <a href={crud.current.repo} className="text-primary underline" target="_blank" rel="noreferrer">{crud.current.repo}</a> : ""} />
              <DetailRow label="Description" value={crud.current.desc} full />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Title"><input className={inputCls} value={crud.current.title} onChange={(e) => crud.update({ title: e.target.value })} /></Field>
              <Field label="Tag / Category"><input className={inputCls} value={crud.current.tag} onChange={(e) => crud.update({ tag: e.target.value })} /></Field>
            </div>
            <Field label="Cover Image URL"><input className={inputCls} value={crud.current.img} onChange={(e) => crud.update({ img: e.target.value })} /></Field>
            <Field label="Description"><textarea rows={3} className={inputCls} value={crud.current.desc} onChange={(e) => crud.update({ desc: e.target.value })} /></Field>
            <Field label="Tech Stack"><input className={inputCls} value={crud.current.tech} onChange={(e) => crud.update({ tech: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Live URL"><input className={inputCls} value={crud.current.live} onChange={(e) => crud.update({ live: e.target.value })} /></Field>
              <Field label="Repository URL"><input className={inputCls} value={crud.current.repo} onChange={(e) => crud.update({ repo: e.target.value })} /></Field>
            </div>
            <label className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] cursor-pointer">
              <input type="checkbox" checked={crud.current.featured} onChange={(e) => crud.update({ featured: e.target.checked })} className="accent-primary w-4 h-4" />
              <span className="text-sm text-on-surface">Feature this project on the homepage</span>
            </label>
          </div>
        ))}
      </Modal>
      <ConfirmDelete open={!!crud.confirm} onClose={() => crud.setConfirm(null)} onConfirm={() => crud.confirm && void crud.remove(crud.confirm)} name={crud.confirm?.title || ""} />
      {crud.loading && <p className="text-on-surface-variant text-sm mt-4">Loading projects...</p>}
      {crud.error && <p className="text-error text-sm mt-4">{crud.error}</p>}
    </>
  );
}

/* ============== Services ============== */
type Service = { id?: number | string; icon: string; title: string; desc: string; price: string; visible: boolean };

function ServicesEditor() {
  const crud = useBackendCrud({
    list: adminApi.listServices,
    create: adminApi.createService,
    update: adminApi.updateService,
    remove: adminApi.deleteService,
  });
  const blank: Service = { icon: "handshake", title: "", desc: "", price: "", visible: true };
  return (
    <>
      <PageHeader title="Services" subtitle="What you offer to clients — every card shown on the user-side." action={<button onClick={() => crud.open("create", blank)} className="bg-primary text-on-primary font-bold px-5 py-3 rounded-full glow-primary flex items-center gap-2"><Icon name="add" className="text-[18px]" />Add Service</button>} />
      <div className="grid md:grid-cols-2 gap-6">
        {crud.items.map((s) => (
          <div key={s.id} className="glass-panel rounded-3xl p-6 flex gap-5">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0"><Icon name={s.icon} fill /></div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-3 mb-1">
                <h3 className="font-bold text-on-surface">{s.title}</h3>
                {!s.visible && <span className="text-[10px] uppercase font-bold bg-white/10 text-on-surface-variant px-2 py-0.5 rounded-full">Hidden</span>}
              </div>
              <p className="text-sm text-on-surface-variant opacity-70 mb-2">{s.desc}</p>
              <p className="text-xs text-secondary-fixed font-bold mb-3">{s.price}</p>
              <RowActions onView={() => crud.open("view", s)} onEdit={() => crud.open("edit", s)} onDelete={() => crud.setConfirm(s)} />
            </div>
          </div>
        ))}
      </div>

      <Modal open={crud.mode !== null} onClose={crud.close} mode={crud.mode} icon="handshake" title={crud.mode === "view" ? "Service Details" : crud.mode === "edit" ? "Edit Service" : "New Service"} footer={<ModalFooter mode={crud.mode} onClose={crud.close} onSave={() => void crud.save()} saving={crud.saving} />}>
        {crud.current && (crud.mode === "view" ? (
          <div className="grid grid-cols-2 gap-5">
            <DetailRow label="Title" value={crud.current.title} />
            <DetailRow label="Icon" value={crud.current.icon} />
            <DetailRow label="Price" value={crud.current.price} />
            <DetailRow label="Visible" value={crud.current.visible ? "Yes" : "No"} />
            <DetailRow label="Description" value={crud.current.desc} full />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Title"><input className={inputCls} value={crud.current.title} onChange={(e) => crud.update({ title: e.target.value })} /></Field>
              <Field label="Material Icon"><input className={inputCls} value={crud.current.icon} onChange={(e) => crud.update({ icon: e.target.value })} /></Field>
            </div>
            <Field label="Description"><textarea rows={3} className={inputCls} value={crud.current.desc} onChange={(e) => crud.update({ desc: e.target.value })} /></Field>
            <Field label="Starting Price"><input className={inputCls} value={crud.current.price} onChange={(e) => crud.update({ price: e.target.value })} /></Field>
            <label className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] cursor-pointer">
              <input type="checkbox" checked={crud.current.visible} onChange={(e) => crud.update({ visible: e.target.checked })} className="accent-primary w-4 h-4" />
              <span className="text-sm text-on-surface">Show on the public site</span>
            </label>
          </div>
        ))}
      </Modal>
      <ConfirmDelete open={!!crud.confirm} onClose={() => crud.setConfirm(null)} onConfirm={() => crud.confirm && void crud.remove(crud.confirm)} name={crud.confirm?.title || ""} />
      {crud.loading && <p className="text-on-surface-variant text-sm mt-4">Loading services...</p>}
      {crud.error && <p className="text-error text-sm mt-4">{crud.error}</p>}
    </>
  );
}

/* ============== Messages ============== */
type Message = { id?: number | string; name: string; email: string; time: string; preview: string; body: string; subject: string; unread: boolean };

function MessagesPage() {
  const crud = useBackendCrud({
    list: adminApi.listMessages,
    create: adminApi.createMessage,
    update: adminApi.updateMessage,
    remove: adminApi.deleteMessage,
  });
  return (
    <>
      <PageHeader title="Messages" subtitle="Inbox from your portfolio contact form." action={<span className="text-xs bg-primary text-on-primary font-bold px-3 py-1 rounded-full">{crud.items.filter((m) => m.unread).length} New</span>} />
      <div className="glass-panel rounded-3xl overflow-hidden">
        {crud.items.map((m) => (
          <div key={m.id} className={`flex gap-4 px-4 md:px-6 py-5 border-b border-outline-variant/20 hover:bg-white/[0.03] ${m.unread ? "bg-primary/[0.03]" : ""}`}>
            <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0">{m.name[0]}</div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center gap-3 mb-1 flex-wrap">
                <h4 className={`text-on-surface ${m.unread ? "font-bold" : "font-medium"}`}>{m.name} <span className="text-on-surface-variant text-xs font-normal opacity-60">· {m.email}</span></h4>
                <span className="text-xs text-on-surface-variant opacity-60 shrink-0">{m.time}</span>
              </div>
              <p className="text-sm text-on-surface-variant opacity-70 truncate">{m.preview}</p>
            </div>
            <div className="flex items-center">
              <RowActions onView={() => crud.open("view", m)} onEdit={() => crud.open("edit", m)} onDelete={() => crud.setConfirm(m)} />
            </div>
          </div>
        ))}
      </div>

      <Modal open={crud.mode !== null} onClose={crud.close} mode={crud.mode} icon="mail" maxWidth="max-w-2xl" title={crud.mode === "view" ? crud.current?.subject || "Message" : "Edit Message"} footer={<ModalFooter mode={crud.mode} onClose={crud.close} onSave={() => void crud.save()} saving={crud.saving} />}>
        {crud.current && (crud.mode === "view" ? (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <DetailRow label="From" value={crud.current.name} />
              <DetailRow label="Email" value={<a href={`mailto:${crud.current.email}`} className="text-primary underline">{crud.current.email}</a>} />
              <DetailRow label="Subject" value={crud.current.subject} />
              <DetailRow label="Received" value={crud.current.time} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60 font-bold mb-2">Message</p>
              <div className="p-4 rounded-2xl bg-surface-variant/30 text-on-surface text-sm leading-relaxed whitespace-pre-wrap">{crud.current.body}</div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Name"><input className={inputCls} value={crud.current.name} onChange={(e) => crud.update({ name: e.target.value })} /></Field>
              <Field label="Email"><input className={inputCls} value={crud.current.email} onChange={(e) => crud.update({ email: e.target.value })} /></Field>
            </div>
            <Field label="Subject"><input className={inputCls} value={crud.current.subject} onChange={(e) => crud.update({ subject: e.target.value })} /></Field>
            <Field label="Body"><textarea rows={6} className={inputCls} value={crud.current.body} onChange={(e) => crud.update({ body: e.target.value, preview: e.target.value.slice(0, 100) })} /></Field>
            <label className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] cursor-pointer">
              <input type="checkbox" checked={crud.current.unread} onChange={(e) => crud.update({ unread: e.target.checked })} className="accent-primary w-4 h-4" />
              <span className="text-sm text-on-surface">Mark as unread</span>
            </label>
          </div>
        ))}
      </Modal>
      <ConfirmDelete open={!!crud.confirm} onClose={() => crud.setConfirm(null)} onConfirm={() => crud.confirm && void crud.remove(crud.confirm)} name={crud.confirm?.name || ""} />
      {crud.loading && <p className="text-on-surface-variant text-sm mt-4">Loading messages...</p>}
      {crud.error && <p className="text-error text-sm mt-4">{crud.error}</p>}
    </>
  );
}

/* ============== Analytics ============== */
function AnalyticsPage() {
  const [stats, setStats] = useState<{ label: string; value: string; delta: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getAnalytics().then((d) => setStats(d.stats)).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-on-surface-variant">Loading analytics...</p>;

  return (
    <>
      <PageHeader title="Analytics" subtitle="Traffic and engagement across your portfolio." action={<select className={`${inputCls} w-auto py-2`}><option>Last 30 days</option><option>Last 7 days</option><option>Last year</option></select>} />
      <section className="grid md:grid-cols-4 gap-6 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="glass-panel rounded-3xl p-6">
            <p className="text-xs uppercase tracking-widest text-on-surface-variant opacity-60">{s.label}</p>
            <h3 className="font-headline-lg text-headline-lg text-on-surface mt-2">{s.value}</h3>
            <p className="text-secondary-fixed text-sm mt-1">{s.delta}</p>
          </div>
        ))}
      </section>
      <div className="glass-panel rounded-3xl p-8">
        <h3 className="font-bold text-on-surface mb-6 flex items-center gap-2"><Icon name="show_chart" className="text-primary" />Traffic Trend</h3>
        <svg viewBox="0 0 600 200" className="w-full h-64">
          <defs>
            <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#d6baff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#d6baff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0,160 C60,140 90,80 150,100 C210,120 250,40 320,60 C390,80 430,30 500,50 C560,65 600,30 600,30 L600,200 L0,200 Z" fill="url(#g)" />
          <path d="M0,160 C60,140 90,80 150,100 C210,120 250,40 320,60 C390,80 430,30 500,50 C560,65 600,30 600,30" stroke="#d6baff" strokeWidth="2" fill="none" />
        </svg>
      </div>
    </>
  );
}

/* ============== Settings ============== */
function SettingsPage() {
  const loadSettings = useCallback(() => adminApi.getSettings(), []);
  const saveSettings = useCallback((data: Parameters<typeof adminApi.saveSettings>[0]) => adminApi.saveSettings(data), []);
  const { data, loading, saving, saved, save, update, error } = useSingleton(loadSettings, saveSettings);
  const [password, setPassword] = useState("••••••••");

  if (loading || !data) return <p className="text-on-surface-variant">{loading ? "Loading settings..." : "Failed to load"}</p>;

  const handleSave = () => void save({ ...data, password: password !== "••••••••" ? password : undefined });

  return (
    <>
      <PageHeader title="Settings" subtitle="Account, SEO, and site preferences." action={<SaveBtn onClick={handleSave} saving={saving} saved={saved} />} />
      {error && <p className="text-error text-sm mb-4">{error}</p>}
      <div className="grid lg:grid-cols-2 gap-6 max-w-5xl">
        <div className="glass-panel rounded-3xl p-8 space-y-5">
          <h3 className="font-bold text-on-surface flex items-center gap-2 mb-2"><Icon name="account_circle" className="text-primary" />Account</h3>
          <Field label="Name"><input className={inputCls} value={data.accountName} onChange={(e) => update({ accountName: e.target.value })} /></Field>
          <Field label="Email"><input className={inputCls} value={data.accountEmail} onChange={(e) => update({ accountEmail: e.target.value })} /></Field>
          <Field label="Password"><input type="password" className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
        </div>
        <div className="glass-panel rounded-3xl p-8 space-y-5">
          <h3 className="font-bold text-on-surface flex items-center gap-2 mb-2"><Icon name="search" className="text-primary" />SEO</h3>
          <Field label="Site Title"><input className={inputCls} value={data.siteTitle} onChange={(e) => update({ siteTitle: e.target.value })} /></Field>
          <Field label="Meta Description"><textarea rows={3} className={inputCls} value={data.metaDescription} onChange={(e) => update({ metaDescription: e.target.value })} /></Field>
          <Field label="Keywords"><input className={inputCls} value={data.keywords} onChange={(e) => update({ keywords: e.target.value })} /></Field>
        </div>
        <div className="glass-panel rounded-3xl p-8 space-y-4 lg:col-span-2">
          <h3 className="font-bold text-on-surface flex items-center gap-2 mb-2"><Icon name="tune" className="text-primary" />Preferences</h3>
          {[
            { key: "emailNotifications" as const, label: "Email notifications for new messages" },
            { key: "showAnalyticsWidget" as const, label: "Show analytics widget on homepage" },
            { key: "allowIndexing" as const, label: "Allow indexing by search engines" },
          ].map((p) => (
            <div key={p.key} className="flex items-center justify-between py-2 border-b border-outline-variant/20 last:border-0">
              <span className="text-on-surface">{p.label}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input checked={data[p.key]} onChange={(e) => update({ [p.key]: e.target.checked })} className="sr-only peer" type="checkbox" />
                <div className="w-11 h-6 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Toggle({ on: initial }: { on: boolean }) {
  const [on, setOn] = useState(initial);
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input checked={on} onChange={(e) => setOn(e.target.checked)} className="sr-only peer" type="checkbox" />
      <div className="w-11 h-6 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
    </label>
  );
}

/* ============== SMTP Mail ============== */
function SmtpPage() {
  const loadSmtp = useCallback(() => adminApi.getSmtp(), []);
  const saveSmtp = useCallback((data: Parameters<typeof adminApi.saveSmtp>[0]) => adminApi.saveSmtp(data), []);
  const { data, loading, saving, saved, save, update, error } = useSingleton(loadSmtp, saveSmtp);
  const [testEmail, setTestEmail] = useState("");
  const [testMsg, setTestMsg] = useState("");

  const presets: Record<string, { host: string; port: string }> = {
    "Custom SMTP": { host: "", port: "587" },
    Gmail: { host: "smtp.gmail.com", port: "587" },
    SendGrid: { host: "smtp.sendgrid.net", port: "587" },
    Mailgun: { host: "smtp.mailgun.org", port: "587" },
    "Amazon SES": { host: "email-smtp.us-east-1.amazonaws.com", port: "587" },
  };

  if (loading || !data) return <p className="text-on-surface-variant">{loading ? "Loading SMTP config..." : "Failed to load"}</p>;

  const setProvider = (provider: string) => {
    const preset = presets[provider];
    update({ provider, host: preset.host || data.host, port: preset.port });
  };

  const sendTest = async () => {
    try {
      const res = await adminApi.testSmtp(testEmail || "test@example.com");
      setTestMsg(res.message);
    } catch (e) {
      setTestMsg(e instanceof Error ? e.message : "Test failed");
    }
  };

  return (
    <>
      <PageHeader title="SMTP Mail Configuration" subtitle="Connect an outgoing mail server to send contact-form replies and notifications." action={<SaveBtn onClick={() => void save()} saving={saving} saved={saved} />} />
      {error && <p className="text-error text-sm mb-4">{error}</p>}
      <div className="grid lg:grid-cols-3 gap-6 max-w-6xl">
        <div className="lg:col-span-2 glass-panel rounded-3xl p-8 space-y-5">
          <Field label="Mail Provider">
            <select value={data.provider} onChange={(e) => setProvider(e.target.value)} className={inputCls}>
              {Object.keys(presets).map((p) => <option key={p}>{p}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2"><Field label="SMTP Host"><input className={inputCls} value={data.host} onChange={(e) => update({ host: e.target.value })} placeholder="smtp.example.com" /></Field></div>
            <Field label="Port"><input className={inputCls} value={data.port} onChange={(e) => update({ port: e.target.value })} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Username"><input className={inputCls} value={data.username} onChange={(e) => update({ username: e.target.value })} placeholder="apikey or email" /></Field>
            <Field label="Password / API Key"><input type="password" className={inputCls} value={data.password} onChange={(e) => update({ password: e.target.value })} placeholder="••••••••" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="From Name"><input className={inputCls} value={data.fromName} onChange={(e) => update({ fromName: e.target.value })} /></Field>
            <Field label="From Email"><input className={inputCls} value={data.fromEmail} onChange={(e) => update({ fromEmail: e.target.value })} /></Field>
          </div>
          <Field label="Reply-To"><input className={inputCls} value={data.replyTo} onChange={(e) => update({ replyTo: e.target.value })} /></Field>
          <div className="flex items-center justify-between py-3 border-t border-outline-variant/30">
            <div>
              <h4 className="font-bold text-on-surface">Use TLS / SSL</h4>
              <p className="text-xs text-on-surface-variant opacity-60">Encrypt connection (recommended).</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input checked={data.secure} onChange={(e) => update({ secure: e.target.checked })} className="sr-only peer" type="checkbox" />
              <div className="w-11 h-6 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
            </label>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 space-y-4">
            <h3 className="font-bold flex items-center gap-2 text-on-surface"><Icon name="bolt" className="text-primary" />Connection Status</h3>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-secondary-fixed/10 border border-secondary-fixed/20">
              <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse" />
              <span className="text-sm text-on-surface">Ready — save config then send test</span>
            </div>
            <button onClick={() => void sendTest()} className="w-full py-3 rounded-xl bg-primary/20 text-primary font-bold hover:bg-primary/30 transition flex items-center justify-center gap-2"><Icon name="send" className="text-[18px]" />Send Test Email</button>
            <input className={inputCls} placeholder="test@example.com" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} />
            {testMsg && <p className="text-xs text-secondary-fixed">{testMsg}</p>}
          </div>
        </div>
      </div>
    </>
  );
}

/* ============== Appearance / Theme ============== */
const PALETTES = [
  { name: "Lavender Aurora", colors: ["#d6baff", "#7832d9", "#00dbe9", "#0e0e0f"] },
  { name: "Sunset Blaze", colors: ["#ff6b35", "#f7931e", "#e84393", "#1a1a1f"] },
  { name: "Ocean Deep", colors: ["#5cbdb9", "#2d8a9e", "#1a4a6e", "#0c2340"] },
  { name: "Forest Moss", colors: ["#a0c49d", "#5a8a5c", "#2d5a3d", "#1a3c2a"] },
  { name: "Noir Gold", colors: ["#f0d78c", "#c9a84c", "#1a1a1a", "#0d0d0d"] },
  { name: "Cherry Pop", colors: ["#ff6b6b", "#c44569", "#574b90", "#1b1530"] },
  { name: "Cyber Neon", colors: ["#00ffa3", "#00b4ff", "#ff00d4", "#06010f"] },
  { name: "Mono Slate", colors: ["#e2e8f0", "#94a3b8", "#475569", "#0f172a"] },
  { name: "Peach Sorbet", colors: ["#ffb4a2", "#e5989b", "#b5838d", "#6d6875"] },
  { name: "Emerald Mint", colors: ["#34d399", "#10b981", "#065f46", "#022c22"] },
  { name: "Royal Plum", colors: ["#c084fc", "#7e22ce", "#3b0764", "#1a0033"] },
  { name: "Solar Flare", colors: ["#fde047", "#f97316", "#dc2626", "#1c0a00"] },
];

const BG_ANIMATIONS = [
  { id: "orbs", name: "Animated Orbs", icon: "blur_on" },
  { id: "particles", name: "Particle Field", icon: "scatter_plot" },
  { id: "waves", name: "Wave Mesh", icon: "waves" },
  { id: "grid", name: "Grid Pulse", icon: "grid_4x4" },
  { id: "stars", name: "Starfield", icon: "auto_awesome" },
  { id: "none", name: "Static", icon: "block" },
];

function AppearancePage() {
  const loadAppearance = useCallback(() => adminApi.getAppearance(), []);
  const saveAppearance = useCallback((d: Parameters<typeof adminApi.saveAppearance>[0]) => adminApi.saveAppearance({
    mode: d.mode ?? "dark",
    palette: typeof d.palette === "number" ? d.palette : 0,
    radius: d.radius ?? 16,
    density: d.density ?? "Comfortable",
    bgAnim: d.bgAnim ?? "orbs",
    animSpeed: d.animSpeed ?? 60,
    animIntensity: d.animIntensity ?? 50,
    parallax: !!d.parallax,
    reducedMotion: !!d.reducedMotion,
    scrollReveal: !!d.scrollReveal,
    hover3d: !!d.hover3d,
  }), []);
  const { data, loading, saving, saved, save, update, error } = useSingleton(loadAppearance, saveAppearance);

  if (loading || !data) return <p className="text-on-surface-variant">{loading ? "Loading appearance..." : "Failed to load"}</p>;

  const { mode, radius, density, bgAnim, animSpeed, animIntensity, parallax, reducedMotion, scrollReveal, hover3d } = data;
  const palette = (typeof data.palette === "number" && data.palette >= 0 && data.palette < PALETTES.length) ? data.palette : 0;
  const setMode = (m: "dark" | "light" | "system") => update({ mode: m });
  const setPalette = (i: number) => update({ palette: i });
  const setRadius = (v: number) => update({ radius: v });
  const setDensity = (d: string) => update({ density: d });
  const setBgAnim = (id: string) => update({ bgAnim: id });
  const setAnimSpeed = (v: number) => update({ animSpeed: v });
  const setAnimIntensity = (v: number) => update({ animIntensity: v });
  const setParallax = (v: boolean) => update({ parallax: v });
  const setReducedMotion = (v: boolean) => update({ reducedMotion: v });
  const setScrollReveal = (v: boolean) => update({ scrollReveal: v });
  const setHover3d = (v: boolean) => update({ hover3d: v });

  return (
    <>
      <PageHeader title="Appearance & Theme" subtitle="Visual identity, palette, animations, and motion settings." action={<SaveBtn onClick={() => void save()} saving={saving} saved={saved} />} />
      {error && <p className="text-error text-sm mb-4">{error}</p>}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-on-surface"><Icon name="contrast" className="text-primary" />Color Mode</h3>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {(["dark", "light", "system"] as const).map((m) => (
                <button key={m} onClick={() => setMode(m)} className={`p-4 sm:p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 sm:gap-3 ${mode === m ? "border-primary bg-primary/10" : "border-outline-variant/30 hover:border-primary/40"}`}>
                  <Icon name={m === "dark" ? "dark_mode" : m === "light" ? "light_mode" : "monitor"} className="text-2xl text-primary" />
                  <span className="capitalize font-bold text-on-surface text-sm">{m}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 sm:p-8">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-on-surface"><Icon name="palette" className="text-primary" />Color Palette <span className="ml-auto text-xs text-on-surface-variant opacity-60">{PALETTES.length} themes</span></h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {PALETTES.map((p, i) => (
                <button key={p.name} onClick={() => setPalette(i)} className={`p-3 sm:p-4 rounded-2xl border-2 transition-all text-left ${palette === i ? "border-primary bg-primary/10" : "border-outline-variant/30 hover:border-primary/40"}`}>
                  <div className="flex gap-1 mb-3">
                    {p.colors.map((c) => <div key={c} className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg" style={{ background: c }} />)}
                  </div>
                  <p className="font-bold text-on-surface text-xs sm:text-sm truncate">{p.name}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-5">
            <h3 className="font-bold flex items-center gap-2 text-on-surface"><Icon name="animation" className="text-primary" />Background Animation</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {BG_ANIMATIONS.map((a) => (
                <button key={a.id} onClick={() => setBgAnim(a.id)} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${bgAnim === a.id ? "border-primary bg-primary/10" : "border-outline-variant/30 hover:border-primary/40"}`}>
                  <Icon name={a.icon} className="text-primary" />
                  <span className="text-xs font-bold text-on-surface text-center">{a.name}</span>
                </button>
              ))}
            </div>
            <Field label={`Animation speed: ${animSpeed}%`}>
              <input type="range" min={0} max={100} value={animSpeed} onChange={(e) => setAnimSpeed(+e.target.value)} className="w-full accent-primary" />
            </Field>
            <Field label={`Effect intensity: ${animIntensity}%`}>
              <input type="range" min={0} max={100} value={animIntensity} onChange={(e) => setAnimIntensity(+e.target.value)} className="w-full accent-primary" />
            </Field>
            <div className="grid sm:grid-cols-2 gap-3 pt-2 border-t border-outline-variant/20">
              {[
                { l: "Parallax on scroll", v: parallax, s: setParallax, i: "swap_vert" },
                { l: "Reveal on scroll", v: scrollReveal, s: setScrollReveal, i: "visibility" },
                { l: "3D hover tilt", v: hover3d, s: setHover3d, i: "3d_rotation" },
                { l: "Reduced motion", v: reducedMotion, s: setReducedMotion, i: "accessibility" },
              ].map((o) => (
                <label key={o.l} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.03] cursor-pointer">
                  <span className="flex items-center gap-2 text-sm text-on-surface"><Icon name={o.i} className="text-primary text-[18px]" />{o.l}</span>
                  <input type="checkbox" checked={o.v} onChange={(e) => o.s(e.target.checked)} className="accent-primary w-4 h-4" />
                </label>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-5">
            <h3 className="font-bold flex items-center gap-2 text-on-surface"><Icon name="rounded_corner" className="text-primary" />Shape & Density</h3>
            <Field label={`Corner radius: ${radius}px`}>
              <input type="range" min={0} max={32} value={radius} onChange={(e) => setRadius(+e.target.value)} className="w-full accent-primary" />
            </Field>
            <Field label="UI Density">
              <div className="grid grid-cols-3 gap-3">
                {["Compact", "Comfortable", "Spacious"].map((d) => (
                  <button key={d} onClick={() => setDensity(d)} className={`py-3 rounded-xl border text-sm ${density === d ? "border-primary bg-primary/10 text-primary" : "border-outline-variant/30 text-on-surface-variant"}`}>{d}</button>
                ))}
              </div>
            </Field>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 space-y-4 lg:sticky lg:top-6 h-fit">
          <h3 className="font-bold flex items-center gap-2 text-on-surface"><Icon name="visibility" className="text-primary" />Live Preview</h3>
          <div className="rounded-2xl p-5 space-y-3 relative overflow-hidden" style={{ background: PALETTES[palette].colors[3], borderRadius: radius }}>
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-50" style={{ background: PALETTES[palette].colors[0], animation: `drift ${30 - animSpeed / 5}s ease-in-out infinite` }} />
            <div className="relative">
              <div className="flex gap-2 mb-2">{PALETTES[palette].colors.slice(0, 3).map((c) => <span key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />)}</div>
              <h4 className="font-bold text-white">Portfolio Preview</h4>
              <p className="text-xs text-white/70 mb-3">Mode: {mode} · {bgAnim} · {density}</p>
              <button className="px-4 py-2 text-xs font-bold text-white" style={{ background: PALETTES[palette].colors[1], borderRadius: radius }}>Hire Me</button>
            </div>
          </div>
          <div className="text-xs text-on-surface-variant opacity-70 space-y-1 pt-2 border-t border-outline-variant/20">
            <p>Palette: <span className="text-on-surface font-bold">{PALETTES[palette].name}</span></p>
            <p>Animation: <span className="text-on-surface font-bold capitalize">{bgAnim}</span> @ {animSpeed}%</p>
            <p>Radius: <span className="text-on-surface font-bold">{radius}px</span></p>
          </div>
        </div>
      </div>
    </>
  );
}

/* ============== App Customization ============== */
function CustomizationPage() {
  const loadCustomization = useCallback(() => adminApi.getCustomization(), []);
  const saveCustomization = useCallback((data: Parameters<typeof adminApi.saveCustomization>[0]) => adminApi.saveCustomization(data), []);
  const { data, loading, saving, saved, save, update, error } = useSingleton(loadCustomization, saveCustomization);

  if (loading || !data) return <p className="text-on-surface-variant">{loading ? "Loading customization..." : "Failed to load"}</p>;

  const updateNav = (index: number, visible: boolean) => {
    const navigation = data.navigation.map((n, i) => (i === index ? { ...n, visible } : n));
    update({ navigation });
  };

  const updateSocial = (index: number, url: string) => {
    const socialLinks = data.socialLinks.map((s, i) => (i === index ? { ...s, url } : s));
    update({ socialLinks });
  };

  return (
    <>
      <PageHeader title="App Customization" subtitle="Branding, navigation, hero behavior, and global content." action={<SaveBtn onClick={() => void save()} saving={saving} saved={saved} />} />
      {error && <p className="text-error text-sm mb-4">{error}</p>}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-panel rounded-3xl p-8 space-y-5">
          <h3 className="font-bold text-on-surface flex items-center gap-2"><Icon name="branding_watermark" className="text-primary" />Brand</h3>
          <Field label="Site Logo Text"><input className={inputCls} value={data.logoText} onChange={(e) => update({ logoText: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Favicon"><input className={inputCls} value={data.favicon} onChange={(e) => update({ favicon: e.target.value })} /></Field>
            <Field label="OG Image URL"><input className={inputCls} value={data.ogImageUrl} onChange={(e) => update({ ogImageUrl: e.target.value })} /></Field>
          </div>
          <Field label="Tagline"><input className={inputCls} value={data.tagline} onChange={(e) => update({ tagline: e.target.value })} /></Field>
        </div>

        <div className="glass-panel rounded-3xl p-8 space-y-4">
          <h3 className="font-bold text-on-surface flex items-center gap-2"><Icon name="menu" className="text-primary" />Navigation</h3>
          {data.navigation.map((n, i) => (
            <div key={n.label} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center gap-3"><Icon name="drag_indicator" className="text-on-surface-variant cursor-grab" /><span className="text-on-surface">{n.label}</span></div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input checked={n.visible} onChange={(e) => updateNav(i, e.target.checked)} className="sr-only peer" type="checkbox" />
                <div className="w-11 h-6 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
              </label>
            </div>
          ))}
        </div>

        <div className="glass-panel rounded-3xl p-8 space-y-5">
          <h3 className="font-bold text-on-surface flex items-center gap-2"><Icon name="animation" className="text-primary" />Hero & Animation</h3>
          <Field label="Background Style">
            <select className={inputCls} value={data.backgroundStyle} onChange={(e) => update({ backgroundStyle: e.target.value })}>
              <option>Animated Orbs</option><option>Particles</option><option>Static Gradient</option><option>None</option>
            </select>
          </Field>
          <Field label="Animation Speed">
            <input type="range" min={0} max={100} value={data.animationSpeed} onChange={(e) => update({ animationSpeed: +e.target.value })} className="w-full accent-primary" />
          </Field>
          <div className="flex items-center justify-between"><span className="text-on-surface">Enable floating cards</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input checked={data.floatingCards} onChange={(e) => update({ floatingCards: e.target.checked })} className="sr-only peer" type="checkbox" />
              <div className="w-11 h-6 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
            </label>
          </div>
          <div className="flex items-center justify-between"><span className="text-on-surface">Show typing animation</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input checked={data.typingAnimation} onChange={(e) => update({ typingAnimation: e.target.checked })} className="sr-only peer" type="checkbox" />
              <div className="w-11 h-6 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
            </label>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-8 space-y-5">
          <h3 className="font-bold text-on-surface flex items-center gap-2"><Icon name="share" className="text-primary" />Social Links</h3>
          {data.socialLinks.map((s, i) => (
            <div key={s.label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><Icon name={s.icon} /></div>
              <div className="flex-1"><Field label={s.label}><input className={inputCls} value={s.url} onChange={(e) => updateSocial(i, e.target.value)} /></Field></div>
            </div>
          ))}
        </div>

        <div className="glass-panel rounded-3xl p-8 space-y-5 lg:col-span-2">
          <h3 className="font-bold text-on-surface flex items-center gap-2"><Icon name="code_blocks" className="text-primary" />Advanced</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Custom CSS"><textarea rows={5} className={inputCls} value={data.customCss} onChange={(e) => update({ customCss: e.target.value })} placeholder="/* paste custom CSS */" /></Field>
            <Field label="Custom <head> scripts"><textarea rows={5} className={inputCls} value={data.customHeadScripts} onChange={(e) => update({ customHeadScripts: e.target.value })} placeholder="<!-- analytics, pixels, etc. -->" /></Field>
          </div>
        </div>
      </div>
    </>
  );
}
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ROUTES } from "../../lib/routes";

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

  useEffect(() => {
    setAuthed(localStorage.getItem("admin_authed") === "1");
    setCollapsed(localStorage.getItem("admin_sidebar_collapsed") === "1");
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      const next = !c;
      localStorage.setItem("admin_sidebar_collapsed", next ? "1" : "0");
      return next;
    });
  };

  const signIn = () => {
    localStorage.setItem("admin_authed", "1");
    setAuthed(true);
  };
  const signOut = () => {
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
            <SidebarNavItem key={n.label} icon={n.icon} label={n.label} badge={n.badge} active={active === n.label} collapsed={collapsed} onClick={() => pick(n.label)} />
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
        {active === "Education" && <ListEditor title="Education" icon="school" items={EDUCATION} columns={["Degree", "Institution", "Year"]} />}
        {active === "Skills" && <SkillsEditor />}
        {active === "Projects" && <ProjectsEditor />}
        {active === "Experience" && <ListEditor title="Experience" icon="history" items={EXPERIENCE} columns={["Role", "Company", "Period"]} />}
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
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password.length >= 3) {
      setError("");
      onSignIn();
    } else {
      setError("Enter a valid email and password.");
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
            <button type="submit" className="w-full py-3 rounded-xl bg-primary text-on-primary font-bold glow-primary hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
              <Icon name="login" className="text-[18px]" /> Sign In
            </button>
          </form>
          <div className="text-center text-xs text-on-surface-variant opacity-60">Demo: any email + password (min 3 chars)</div>
        </div>
      </div>
    </div>
  );
}

/* ============== Users Page ============== */
type AdminUser = { id?: number | string; name: string; email: string; role: string; status: string; last: string; avatar: string };

function UsersPage() {
  const crud = useCrud<AdminUser>([
    { name: "Alex Morgan", email: "alex@morgan.dev", role: "Owner", status: "Active", last: "Just now", avatar: "A" },
    { name: "Sarah Williams", email: "sarah@studio.io", role: "Editor", status: "Active", last: "2h ago", avatar: "S" },
    { name: "David Chen", email: "david@vrlabs.com", role: "Viewer", status: "Active", last: "1d ago", avatar: "D" },
    { name: "Elena Rodriguez", email: "elena@designweek.org", role: "Editor", status: "Invited", last: "—", avatar: "E" },
    { name: "Marcus Kim", email: "marcus@startup.co", role: "Viewer", status: "Suspended", last: "5d ago", avatar: "M" },
  ]);
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

      <Modal open={crud.mode !== null} onClose={crud.close} mode={crud.mode} icon="person" title={crud.mode === "view" ? "User Details" : crud.mode === "edit" ? "Edit User" : "Invite User"} footer={<ModalFooter mode={crud.mode} onClose={crud.close} onSave={crud.save} />}>
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

const inputCls = "w-full bg-surface-variant/40 border border-outline-variant/40 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary/50 transition";

function SaveBtn({ onClick, label = "Save Changes" }: { onClick?: () => void; label?: string }) {
  return (
    <button onClick={onClick} className="bg-primary text-on-primary font-bold px-6 py-3 rounded-full glow-primary hover:scale-105 transition-transform flex items-center gap-2">
      <Icon name="save" className="text-[18px]" /> {label}
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

function ModalFooter({ mode, onClose, onSave }: { mode: ModalMode; onClose: () => void; onSave?: () => void }) {
  if (mode === "view") return <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-white/5 text-on-surface font-bold hover:bg-white/10">Close</button>;
  return (
    <>
      <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-white/5 text-on-surface font-bold hover:bg-white/10">Cancel</button>
      <button onClick={() => { onSave?.(); onClose(); }} className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold glow-primary hover:scale-[1.02] transition-transform flex items-center gap-2"><Icon name="save" className="text-[18px]" />{mode === "create" ? "Create" : "Save"}</button>
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
  return (
    <>
      <PageHeader
        title="Dashboard Overview"
        subtitle="Welcome back, Alex. Here's what's happening with your portfolio today."
        action={
          <button className="bg-primary text-on-primary font-bold px-6 py-3 rounded-full glow-primary hover:scale-105 transition-transform">Live Preview</button>
        }
      />
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Visitors", value: "12,540", icon: "group", color: "primary", delta: "+12.5%", sub: "vs last month" },
          { label: "Projects", value: "28", icon: "folder_open", color: "secondary-fixed", delta: "+8.2%", sub: "new uploads" },
          { label: "Messages", value: "146", icon: "chat_bubble", color: "tertiary", delta: "+18.7%", sub: "leads generated" },
          { label: "Conversion", value: "3.8%", icon: "ads_click", color: "primary", delta: "+2.4%", sub: "hiring rate" },
        ].map((m) => (
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
          {[
            { icon: "token", title: "Hero Section", sub: "Last updated 2 days ago", published: true, color: "primary" },
            { icon: "person", title: "About Me", sub: "Contains personal bio and skills", published: true, color: "secondary-fixed" },
            { icon: "work", title: "Case Studies", sub: "High-detail project views", published: false, color: "tertiary" },
            { icon: "handshake", title: "Services", sub: "What I offer to clients", published: true, color: "primary" },
          ].map((s) => <SectionRow key={s.title} {...s} />)}
        </div>
      </div>
    </>
  );
}

function SectionRow({ icon, title, sub, published, color }: { icon: string; title: string; sub: string; published: boolean; color: string }) {
  const [on, setOn] = useState(published);
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
          <input checked={on} onChange={(e) => setOn(e.target.checked)} className="sr-only peer" type="checkbox" />
          <div className="w-11 h-6 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
        </label>
      </div>
    </div>
  );
}

/* ============== Hero ============== */
function HeroEditor() {
  const [d, set] = useState({
    tag: "Hello, It's Me",
    name: "Alex Morgan",
    role: "Full Stack Developer & 3D Designer",
    desc: "I create immersive digital experiences with modern technologies and beautiful 3D animations. Specializing in the intersection of code and visual art.",
    years: "3+", projects: "30+", clients: "20+",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTV4dOlVZZQ6R1MeCj_bizBDfUqKVytS9-WED8VuXrLBKOcduycsryW53f1SehopltWRY8jGQqOojVFk0cL29D_-PmscGoE8N_bdFc3KGRaihHE_8DlQx2bnPZuGZ8bAUB-HGfUbTKg9n62VBAfPlTkFn2o647bWlNFvoHmrqQeC-XJS7_5n4G1PLy4IGmdpOV2-dX5Ao_4_f1Z270qpktAnCedLvZmpGHzoh7v83-I4RKxAgX7DBcLJGEnyHsHVIWbHvzCVmBWSfv",
    cta1: "Hire Me", cta2: "Download CV", cvUrl: "https://example.com/resume.pdf",
    showStats: true, showStack: true, typing: false, floatCards: true,
    accent: "Lavender", techStack: "JavaScript, React, Three.js, Node.js, TypeScript",
  });
  const upd = (k: keyof typeof d, v: any) => set((s) => ({ ...s, [k]: v }));
  return (
    <>
      <PageHeader title="Hero Section" subtitle="Edit every element shown in the user-side hero." action={<SaveBtn />} />
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
  const [d, set] = useState({
    title: "About Me",
    tag: "Get To Know Me",
    bio: "I'm a passionate Full Stack Developer & 3D Designer who loves building interactive, modern and beautiful web experiences. I specialize in React, Next.js, Three.js and Node.js.",
    longBio: "Over 3+ years I've delivered 30+ projects for clients across the globe — from startups to enterprises — focusing on performance, motion, and pixel-perfect detail.",
    location: "San Francisco, CA",
    availability: "Open to opportunities",
    email: "hello@alexmorgan.dev", phone: "+1 (555) 010-2025",
    resume: "https://example.com/resume.pdf",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCBBu6aAzqIOEjOyaMYW7sjIp1xZIoCSqSwiWwIB9pFWvooquI87zmyDT2-GXoIMwl1xFv-8IVc17eKnOWivK51xf7KKcGaX3NLGqIJA",
    statValue: "30+", statLabel: "Projects Successfully Delivered",
    languages: "English, Spanish", interests: "Generative art, climbing, electronic music",
  });
  const upd = (k: keyof typeof d, v: any) => set((s) => ({ ...s, [k]: v }));
  return (
    <>
      <PageHeader title="About" subtitle="Every detail of the user-side About section." action={<SaveBtn />} />
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
const EDUCATION = [
  { a: "MSc Computer Science", b: "Stanford University", c: "2020 — 2022", d: "Specialized in HCI and computer graphics. Graduated with honors." },
  { a: "BSc Software Engineering", b: "UC Berkeley", c: "2016 — 2020", d: "Top of class, Dean's List four years running." },
];
const EXPERIENCE = [
  { a: "Senior Frontend Engineer", b: "Vercel", c: "2023 — Present", d: "Leading the design-systems team across Next.js dashboards." },
  { a: "UI Engineer", b: "Linear", c: "2021 — 2023", d: "Shipped the timeline and roadmap surfaces used by 30k+ teams." },
  { a: "Junior Developer", b: "Airbnb", c: "2019 — 2021", d: "Worked on the host onboarding experience and growth funnels." },
];

type ListItem = { id?: number | string; a: string; b: string; c: string; d?: string };

function ListEditor({ title, icon, items, columns }: { title: string; icon: string; items: ListItem[]; columns: [string, string, string] }) {
  const crud = useCrud<ListItem>(items);
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

      <Modal open={crud.mode !== null} onClose={crud.close} mode={crud.mode} icon={icon} title={crud.mode === "view" ? `${title} Details` : crud.mode === "edit" ? `Edit ${title}` : `New ${title}`} footer={<ModalFooter mode={crud.mode} onClose={crud.close} onSave={crud.save} />}>
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
      <ConfirmDelete open={!!crud.confirm} onClose={() => crud.setConfirm(null)} onConfirm={() => crud.confirm && crud.remove(crud.confirm)} name={crud.confirm?.a || ""} />
    </>
  );
}

/* ============== Skills ============== */
type Skill = { id?: number | string; name: string; level: number; category: string; icon: string };

function SkillsEditor() {
  const crud = useCrud<Skill>([
    { name: "React / TanStack", level: 95, category: "Frontend", icon: "code" },
    { name: "TypeScript", level: 90, category: "Language", icon: "javascript" },
    { name: "Three.js / WebGL", level: 80, category: "3D / Graphics", icon: "view_in_ar" },
    { name: "Node.js", level: 85, category: "Backend", icon: "dns" },
    { name: "Figma", level: 75, category: "Design", icon: "palette" },
  ]);
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

      <Modal open={crud.mode !== null} onClose={crud.close} mode={crud.mode} icon="deployed_code" title={crud.mode === "view" ? "Skill Details" : crud.mode === "edit" ? "Edit Skill" : "New Skill"} footer={<ModalFooter mode={crud.mode} onClose={crud.close} onSave={crud.save} />}>
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
      <ConfirmDelete open={!!crud.confirm} onClose={() => crud.setConfirm(null)} onConfirm={() => crud.confirm && crud.remove(crud.confirm)} name={crud.confirm?.name || ""} />
    </>
  );
}

/* ============== Projects ============== */
type Project = { id?: number | string; title: string; tag: string; img: string; desc: string; live: string; repo: string; tech: string; featured: boolean };

function ProjectsEditor() {
  const crud = useCrud<Project>([
    { title: "Nebula Dashboard", tag: "Web App", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600", desc: "Analytics dashboard with realtime charts and 3D data viz.", live: "https://nebula.app", repo: "https://github.com/alex/nebula", tech: "React, D3, Three.js", featured: true },
    { title: "VR Configurator", tag: "3D / WebGL", img: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=600", desc: "Immersive product configurator in WebXR.", live: "https://vr.demo", repo: "https://github.com/alex/vrc", tech: "Three.js, WebXR", featured: true },
    { title: "Brand System", tag: "Design", img: "https://images.unsplash.com/photo-1561070791-2526d30994b8?w=600", desc: "End-to-end identity and design tokens.", live: "", repo: "", tech: "Figma, Tokens Studio", featured: false },
    { title: "AI Studio", tag: "SaaS", img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600", desc: "Prompt-driven creative tools for marketers.", live: "https://ai.studio", repo: "", tech: "Next.js, OpenAI", featured: true },
  ]);
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

      <Modal open={crud.mode !== null} onClose={crud.close} mode={crud.mode} icon="work" maxWidth="max-w-3xl" title={crud.mode === "view" ? "Project Details" : crud.mode === "edit" ? "Edit Project" : "New Project"} footer={<ModalFooter mode={crud.mode} onClose={crud.close} onSave={crud.save} />}>
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
      <ConfirmDelete open={!!crud.confirm} onClose={() => crud.setConfirm(null)} onConfirm={() => crud.confirm && crud.remove(crud.confirm)} name={crud.confirm?.title || ""} />
    </>
  );
}

/* ============== Services ============== */
type Service = { id?: number | string; icon: string; title: string; desc: string; price: string; visible: boolean };

function ServicesEditor() {
  const crud = useCrud<Service>([
    { icon: "code", title: "Web Development", desc: "Full-stack apps with React, TanStack, Node.", price: "from $2,500", visible: true },
    { icon: "view_in_ar", title: "3D Experiences", desc: "Immersive Three.js / WebGL worlds.", price: "from $4,000", visible: true },
    { icon: "palette", title: "UI / UX Design", desc: "Interfaces that feel as good as they look.", price: "from $1,800", visible: true },
    { icon: "rocket_launch", title: "Performance", desc: "Audits and optimization for fast sites.", price: "from $1,200", visible: false },
  ]);
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

      <Modal open={crud.mode !== null} onClose={crud.close} mode={crud.mode} icon="handshake" title={crud.mode === "view" ? "Service Details" : crud.mode === "edit" ? "Edit Service" : "New Service"} footer={<ModalFooter mode={crud.mode} onClose={crud.close} onSave={crud.save} />}>
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
      <ConfirmDelete open={!!crud.confirm} onClose={() => crud.setConfirm(null)} onConfirm={() => crud.confirm && crud.remove(crud.confirm)} name={crud.confirm?.title || ""} />
    </>
  );
}

/* ============== Messages ============== */
type Message = { id?: number | string; name: string; email: string; time: string; preview: string; body: string; subject: string; unread: boolean };

function MessagesPage() {
  const crud = useCrud<Message>([
    { name: "Sarah Williams", email: "sarah@studio.io", subject: "Collaboration on 3D Tesla project", time: "15m ago", preview: "Hey Alex, I loved your 3D work on the Tesla project. Would love to chat about a collaboration.", body: "Hey Alex, I loved your 3D work on the Tesla project. Would love to chat about a collaboration — we're scoping a configurator for an EV brand and your aesthetic is exactly what we need.", unread: true },
    { name: "David Chen", email: "david@vrlabs.com", subject: "VR onboarding for SaaS", time: "1h ago", preview: "Looking for a developer to help build a VR onboarding experience for our SaaS product.", body: "Hi Alex — we're VR Labs and we're rebuilding our onboarding into a WebXR experience. Budget is flexible and timeline is Q4. Can we book a call?", unread: true },
    { name: "Elena Rodriguez", email: "elena@designweek.org", subject: "Interview request", time: "3h ago", preview: "We'd love to interview you for our next issue on emerging 3D web designers.", body: "Hi Alex, Design Week Magazine here. Our next issue covers emerging 3D web designers — would you be open to a 30-minute interview?", unread: true },
    { name: "Marcus Kim", email: "marcus@startup.co", subject: "Dashboard redesign follow-up", time: "Yesterday", preview: "Following up on our discussion about the dashboard redesign.", body: "Quick follow up — are we still aligned on shipping the dashboard refresh by end of month?", unread: false },
    { name: "Priya Patel", email: "priya@agency.com", subject: "Thanks!", time: "2 days ago", preview: "Thank you for the quick turnaround on the landing page!", body: "Just wanted to say thank you for the lightning-fast landing page delivery. The team is thrilled.", unread: false },
  ]);
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

      <Modal open={crud.mode !== null} onClose={crud.close} mode={crud.mode} icon="mail" maxWidth="max-w-2xl" title={crud.mode === "view" ? crud.current?.subject || "Message" : "Edit Message"} footer={<ModalFooter mode={crud.mode} onClose={crud.close} onSave={crud.save} />}>
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
      <ConfirmDelete open={!!crud.confirm} onClose={() => crud.setConfirm(null)} onConfirm={() => crud.confirm && crud.remove(crud.confirm)} name={crud.confirm?.name || ""} />
    </>
  );
}

/* ============== Analytics ============== */
function AnalyticsPage() {
  return (
    <>
      <PageHeader title="Analytics" subtitle="Traffic and engagement across your portfolio." action={<select className={`${inputCls} w-auto py-2`}><option>Last 30 days</option><option>Last 7 days</option><option>Last year</option></select>} />
      <section className="grid md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Page Views", value: "48.2k", delta: "+22%" },
          { label: "Unique Visitors", value: "12,540", delta: "+12%" },
          { label: "Avg. Session", value: "3m 42s", delta: "+8%" },
          { label: "Bounce Rate", value: "32%", delta: "-4%" },
        ].map((s) => (
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
  return (
    <>
      <PageHeader title="Settings" subtitle="Account, SEO, and site preferences." action={<SaveBtn />} />
      <div className="grid lg:grid-cols-2 gap-6 max-w-5xl">
        <div className="glass-panel rounded-3xl p-8 space-y-5">
          <h3 className="font-bold text-on-surface flex items-center gap-2 mb-2"><Icon name="account_circle" className="text-primary" />Account</h3>
          <Field label="Name"><input className={inputCls} defaultValue="Alex Morgan" /></Field>
          <Field label="Email"><input className={inputCls} defaultValue="alex@morgan.dev" /></Field>
          <Field label="Password"><input type="password" className={inputCls} defaultValue="••••••••" /></Field>
        </div>
        <div className="glass-panel rounded-3xl p-8 space-y-5">
          <h3 className="font-bold text-on-surface flex items-center gap-2 mb-2"><Icon name="search" className="text-primary" />SEO</h3>
          <Field label="Site Title"><input className={inputCls} defaultValue="Alex Morgan | Portfolio" /></Field>
          <Field label="Meta Description"><textarea rows={3} className={inputCls} defaultValue="Full Stack Developer & 3D Designer." /></Field>
          <Field label="Keywords"><input className={inputCls} defaultValue="react, three.js, web design" /></Field>
        </div>
        <div className="glass-panel rounded-3xl p-8 space-y-4 lg:col-span-2">
          <h3 className="font-bold text-on-surface flex items-center gap-2 mb-2"><Icon name="tune" className="text-primary" />Preferences</h3>
          {[
            { label: "Email notifications for new messages", on: true },
            { label: "Show analytics widget on homepage", on: false },
            { label: "Allow indexing by search engines", on: true },
          ].map((p) => (
            <div key={p.label} className="flex items-center justify-between py-2 border-b border-outline-variant/20 last:border-0">
              <span className="text-on-surface">{p.label}</span>
              <Toggle on={p.on} />
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
  const [provider, setProvider] = useState("Custom SMTP");
  const [secure, setSecure] = useState(true);
  const presets: Record<string, { host: string; port: string }> = {
    "Custom SMTP": { host: "", port: "587" },
    Gmail: { host: "smtp.gmail.com", port: "587" },
    SendGrid: { host: "smtp.sendgrid.net", port: "587" },
    Mailgun: { host: "smtp.mailgun.org", port: "587" },
    "Amazon SES": { host: "email-smtp.us-east-1.amazonaws.com", port: "587" },
  };
  const preset = presets[provider];
  return (
    <>
      <PageHeader title="SMTP Mail Configuration" subtitle="Connect an outgoing mail server to send contact-form replies and notifications." action={<SaveBtn />} />
      <div className="grid lg:grid-cols-3 gap-6 max-w-6xl">
        <div className="lg:col-span-2 glass-panel rounded-3xl p-8 space-y-5">
          <Field label="Mail Provider">
            <select value={provider} onChange={(e) => setProvider(e.target.value)} className={inputCls}>
              {Object.keys(presets).map((p) => <option key={p}>{p}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2"><Field label="SMTP Host"><input className={inputCls} defaultValue={preset.host} placeholder="smtp.example.com" /></Field></div>
            <Field label="Port"><input className={inputCls} defaultValue={preset.port} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Username"><input className={inputCls} placeholder="apikey or email" /></Field>
            <Field label="Password / API Key"><input type="password" className={inputCls} placeholder="••••••••" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="From Name"><input className={inputCls} defaultValue="Alex Morgan" /></Field>
            <Field label="From Email"><input className={inputCls} defaultValue="hello@alexmorgan.dev" /></Field>
          </div>
          <Field label="Reply-To"><input className={inputCls} defaultValue="alex@morgan.dev" /></Field>
          <div className="flex items-center justify-between py-3 border-t border-outline-variant/30">
            <div>
              <h4 className="font-bold text-on-surface">Use TLS / SSL</h4>
              <p className="text-xs text-on-surface-variant opacity-60">Encrypt connection (recommended).</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input checked={secure} onChange={(e) => setSecure(e.target.checked)} className="sr-only peer" type="checkbox" />
              <div className="w-11 h-6 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
            </label>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 space-y-4">
            <h3 className="font-bold flex items-center gap-2 text-on-surface"><Icon name="bolt" className="text-primary" />Connection Status</h3>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-secondary-fixed/10 border border-secondary-fixed/20">
              <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse" />
              <span className="text-sm text-on-surface">Last test: 2 minutes ago — Success</span>
            </div>
            <button className="w-full py-3 rounded-xl bg-primary/20 text-primary font-bold hover:bg-primary/30 transition flex items-center justify-center gap-2"><Icon name="send" className="text-[18px]" />Send Test Email</button>
            <input className={inputCls} placeholder="test@example.com" />
          </div>
          <div className="glass-panel rounded-3xl p-6 space-y-3">
            <h3 className="font-bold flex items-center gap-2 text-on-surface"><Icon name="mark_email_read" className="text-primary" />Recent Sends</h3>
            {[
              { to: "sarah@studio.io", time: "5m", ok: true },
              { to: "david@vrlabs.com", time: "1h", ok: true },
              { to: "elena@designweek.org", time: "3h", ok: false },
            ].map((r) => (
              <div key={r.to} className="flex justify-between items-center text-sm py-2 border-b border-outline-variant/20 last:border-0">
                <span className="text-on-surface truncate">{r.to}</span>
                <span className={`text-xs ${r.ok ? "text-secondary-fixed" : "text-error"}`}>{r.ok ? "Delivered" : "Failed"} · {r.time}</span>
              </div>
            ))}
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
  const [mode, setMode] = useState<"dark" | "light" | "system">("dark");
  const [palette, setPalette] = useState(0);
  const [radius, setRadius] = useState(16);
  const [density, setDensity] = useState("Comfortable");
  const [bgAnim, setBgAnim] = useState("orbs");
  const [animSpeed, setAnimSpeed] = useState(60);
  const [animIntensity, setAnimIntensity] = useState(50);
  const [parallax, setParallax] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [scrollReveal, setScrollReveal] = useState(true);
  const [hover3d, setHover3d] = useState(true);

  return (
    <>
      <PageHeader title="Appearance & Theme" subtitle="Visual identity, palette, animations, and motion settings." action={<SaveBtn />} />
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
  return (
    <>
      <PageHeader title="App Customization" subtitle="Branding, navigation, hero behavior, and global content." action={<SaveBtn />} />
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-panel rounded-3xl p-8 space-y-5">
          <h3 className="font-bold text-on-surface flex items-center gap-2"><Icon name="branding_watermark" className="text-primary" />Brand</h3>
          <Field label="Site Logo Text"><input className={inputCls} defaultValue="PORTFOLIO." /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Favicon"><input className={inputCls} defaultValue="/favicon.ico" /></Field>
            <Field label="OG Image URL"><input className={inputCls} defaultValue="https://..." /></Field>
          </div>
          <Field label="Tagline"><input className={inputCls} defaultValue="Crafting immersive 3D web." /></Field>
        </div>

        <div className="glass-panel rounded-3xl p-8 space-y-4">
          <h3 className="font-bold text-on-surface flex items-center gap-2"><Icon name="menu" className="text-primary" />Navigation</h3>
          {["Home", "About", "Education", "Skills", "Projects", "Contact"].map((n) => (
            <div key={n} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center gap-3"><Icon name="drag_indicator" className="text-on-surface-variant cursor-grab" /><span className="text-on-surface">{n}</span></div>
              <Toggle on={true} />
            </div>
          ))}
        </div>

        <div className="glass-panel rounded-3xl p-8 space-y-5">
          <h3 className="font-bold text-on-surface flex items-center gap-2"><Icon name="animation" className="text-primary" />Hero & Animation</h3>
          <Field label="Background Style">
            <select className={inputCls}><option>Animated Orbs</option><option>Particles</option><option>Static Gradient</option><option>None</option></select>
          </Field>
          <Field label="Animation Speed">
            <input type="range" min={0} max={100} defaultValue={60} className="w-full accent-primary" />
          </Field>
          <div className="flex items-center justify-between"><span className="text-on-surface">Enable floating cards</span><Toggle on={true} /></div>
          <div className="flex items-center justify-between"><span className="text-on-surface">Show typing animation</span><Toggle on={false} /></div>
        </div>

        <div className="glass-panel rounded-3xl p-8 space-y-5">
          <h3 className="font-bold text-on-surface flex items-center gap-2"><Icon name="share" className="text-primary" />Social Links</h3>
          {[
            { i: "code", l: "GitHub", v: "https://github.com/alexmorgan" },
            { i: "alternate_email", l: "Twitter / X", v: "https://x.com/alex" },
            { i: "business_center", l: "LinkedIn", v: "https://linkedin.com/in/alex" },
            { i: "photo_camera", l: "Dribbble", v: "https://dribbble.com/alex" },
          ].map((s) => (
            <div key={s.l} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><Icon name={s.i} /></div>
              <div className="flex-1"><Field label={s.l}><input className={inputCls} defaultValue={s.v} /></Field></div>
            </div>
          ))}
        </div>

        <div className="glass-panel rounded-3xl p-8 space-y-5 lg:col-span-2">
          <h3 className="font-bold text-on-surface flex items-center gap-2"><Icon name="code_blocks" className="text-primary" />Advanced</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Custom CSS"><textarea rows={5} className={inputCls} placeholder="/* paste custom CSS */" /></Field>
            <Field label="Custom <head> scripts"><textarea rows={5} className={inputCls} placeholder="<!-- analytics, pixels, etc. -->" /></Field>
          </div>
        </div>
      </div>
    </>
  );
}

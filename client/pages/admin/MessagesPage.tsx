import {
  Icon, PageHeader, Field, inputCls,
  RowActions, Modal, ModalFooter, ConfirmDelete, DetailRow, useCrud,
} from "../shared";

type Message = {
  id?: number | string;
  name: string; email: string; time: string;
  preview: string; body: string; subject: string; unread: boolean;
};

export function MessagesPage() {
  const crud = useCrud<Message>([
    { name: "Sarah Williams", email: "sarah@studio.io",       subject: "Collaboration on 3D Tesla project", time: "15m ago",   preview: "Hey Alex, I loved your 3D work on the Tesla project.",                             body: "Hey Alex, I loved your 3D work on the Tesla project. Would love to chat about a collaboration — we're scoping a configurator for an EV brand.",               unread: true  },
    { name: "David Chen",     email: "david@vrlabs.com",       subject: "VR onboarding for SaaS",           time: "1h ago",    preview: "Looking for a developer to help build a VR onboarding experience.",               body: "Hi Alex — we're VR Labs and we're rebuilding our onboarding into a WebXR experience. Budget is flexible and timeline is Q4. Can we book a call?",             unread: true  },
    { name: "Elena Rodriguez",email: "elena@designweek.org",   subject: "Interview request",                time: "3h ago",    preview: "We'd love to interview you for our next issue on emerging 3D web designers.",     body: "Hi Alex, Design Week Magazine here. Our next issue covers emerging 3D web designers — would you be open to a 30-minute interview?",                          unread: true  },
    { name: "Marcus Kim",     email: "marcus@startup.co",      subject: "Dashboard redesign follow-up",     time: "Yesterday", preview: "Following up on our discussion about the dashboard redesign.",                    body: "Quick follow up — are we still aligned on shipping the dashboard refresh by end of month?",                                                               unread: false },
    { name: "Priya Patel",    email: "priya@agency.com",       subject: "Thanks!",                          time: "2 days ago",preview: "Thank you for the quick turnaround on the landing page!",                        body: "Just wanted to say thank you for the lightning-fast landing page delivery. The team is thrilled.",                                                           unread: false },
  ]);

  const unreadCount = crud.items.filter((m) => m.unread).length;

  return (
    <>
      <PageHeader
        title="Messages"
        subtitle="Inbox from your portfolio contact form."
        action={
          <span className="text-xs bg-primary text-on-primary font-bold px-3 py-1 rounded-full">
            {unreadCount} New
          </span>
        }
      />

      <div className="glass-panel rounded-3xl overflow-hidden">
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_140px] gap-4 px-6 py-4 border-b border-outline-variant/30 text-xs uppercase tracking-widest text-on-surface-variant opacity-60">
          <span>Sender</span><span>Subject</span><span>Received</span><span className="text-right">Actions</span>
        </div>

        {crud.items.map((m) => (
          <div
            key={m.id}
            className={`grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_140px] gap-3 md:gap-4 px-4 md:px-6 py-5 border-b border-outline-variant/20 hover:bg-white/[0.03] md:items-center ${m.unread ? "bg-primary/[0.03]" : ""}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {m.unread && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
              <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0">
                {m.name[0]}
              </div>
              <div className="min-w-0">
                <p className={`text-on-surface truncate ${m.unread ? "font-bold" : "font-medium"}`}>{m.name}</p>
                <p className="text-xs text-on-surface-variant opacity-60 truncate">{m.email}</p>
              </div>
            </div>
            <span className="text-sm text-on-surface truncate">{m.subject}</span>
            <span className="text-xs text-on-surface-variant opacity-60">{m.time}</span>
            <RowActions
              onView={() => crud.open("view", m)}
              onEdit={() => crud.open("edit", m)}
              onDelete={() => crud.setConfirm(m)}
            />
          </div>
        ))}
      </div>

      <Modal
        open={crud.mode !== null}
        onClose={crud.close}
        mode={crud.mode}
        icon="mail"
        maxWidth="max-w-2xl"
        title={crud.mode === "view" ? crud.current?.subject || "Message" : "Edit Message"}
        footer={<ModalFooter mode={crud.mode} onClose={crud.close} onSave={crud.save} />}
      >
        {crud.current && (crud.mode === "view" ? (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <DetailRow label="From"     value={crud.current.name} />
              <DetailRow label="Email"    value={<a href={`mailto:${crud.current.email}`} className="text-primary underline">{crud.current.email}</a>} />
              <DetailRow label="Subject"  value={crud.current.subject} />
              <DetailRow label="Received" value={crud.current.time} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60 font-bold mb-2">Message</p>
              <div className="p-4 rounded-2xl bg-surface-variant/30 text-on-surface text-sm leading-relaxed whitespace-pre-wrap">
                {crud.current.body}
              </div>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/20 text-primary font-bold text-sm hover:bg-primary/30 transition">
              <Icon name="reply" className="text-[18px]" /> Reply
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Name">
                <input className={inputCls} value={crud.current.name} onChange={(e) => crud.update({ name: e.target.value })} />
              </Field>
              <Field label="Email">
                <input className={inputCls} value={crud.current.email} onChange={(e) => crud.update({ email: e.target.value })} />
              </Field>
            </div>
            <Field label="Subject">
              <input className={inputCls} value={crud.current.subject} onChange={(e) => crud.update({ subject: e.target.value })} />
            </Field>
            <Field label="Body">
              <textarea rows={6} className={inputCls} value={crud.current.body} onChange={(e) => crud.update({ body: e.target.value, preview: e.target.value.slice(0, 100) })} />
            </Field>
            <label className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] cursor-pointer">
              <input type="checkbox" checked={crud.current.unread} onChange={(e) => crud.update({ unread: e.target.checked })} className="accent-primary w-4 h-4" />
              <span className="text-sm text-on-surface">Mark as unread</span>
            </label>
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
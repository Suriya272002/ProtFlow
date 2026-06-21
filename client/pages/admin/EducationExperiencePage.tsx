import {
  Icon,
  PageHeader,
  Field,
  inputCls,
  RowActions,
  Modal,
  ModalFooter,
  ConfirmDelete,
  DetailRow,
  useCrud,
} from "../shared";

type ListItem = { id?: number | string; a: string; b: string; c: string; d?: string };

function ListEditor({
  title,
  subtitle,
  icon,
  items,
  columns,
}: {
  title: string;
  subtitle: string;
  icon: string;
  items: ListItem[];
  columns: [string, string, string];
}) {
  const crud = useCrud<ListItem>(items);
  const blank: ListItem = { a: "", b: "", c: "", d: "" };

  return (
    <>
      <PageHeader
        title={title}
        subtitle={subtitle}
        action={
          <button
            onClick={() => crud.open("create", blank)}
            className="bg-primary text-on-primary font-bold px-5 py-3 rounded-full glow-primary hover:scale-105 transition-transform flex items-center gap-2"
          >
            <Icon name="add" className="text-[18px]" /> Add Entry
          </button>
        }
      />

      <div className="glass-panel rounded-3xl overflow-hidden">
        <div className="hidden md:grid grid-cols-[1fr_1fr_180px_140px] gap-4 px-6 py-4 border-b border-outline-variant/30 text-xs uppercase tracking-widest text-on-surface-variant opacity-60">
          <span>{columns[0]}</span>
          <span>{columns[1]}</span>
          <span>{columns[2]}</span>
          <span className="text-right">Actions</span>
        </div>

        {crud.items.map((it) => (
          <div
            key={it.id}
            className="grid grid-cols-1 md:grid-cols-[1fr_1fr_180px_140px] gap-2 md:gap-4 px-4 md:px-6 py-4 md:py-5 border-b border-outline-variant/20 hover:bg-white/[0.03] md:items-center"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Icon name={icon} className="text-primary shrink-0" />
              <span className="font-bold text-on-surface truncate">{it.a}</span>
            </div>
            <span className="text-on-surface-variant text-sm truncate">{it.b}</span>
            <span className="text-on-surface-variant text-xs opacity-70">{it.c}</span>
            <RowActions
              onView={() => crud.open("view", it)}
              onEdit={() => crud.open("edit", it)}
              onDelete={() => crud.setConfirm(it)}
            />
          </div>
        ))}

        {crud.items.length === 0 && (
          <div className="px-6 py-10 text-center text-on-surface-variant opacity-60 text-sm">
            No entries yet. Click <b className="text-primary">Add Entry</b> to create one.
          </div>
        )}
      </div>

      <Modal
        open={crud.mode !== null}
        onClose={crud.close}
        mode={crud.mode}
        icon={icon}
        title={
          crud.mode === "view"
            ? `${title} Details`
            : crud.mode === "edit"
            ? `Edit ${title}`
            : `New ${title}`
        }
        footer={<ModalFooter mode={crud.mode} onClose={crud.close} onSave={crud.save} />}
      >
        {crud.current &&
          (crud.mode === "view" ? (
            <div className="grid grid-cols-2 gap-5">
              <DetailRow label={columns[0]} value={crud.current.a} />
              <DetailRow label={columns[1]} value={crud.current.b} />
              <DetailRow label={columns[2]} value={crud.current.c} />
              <DetailRow label="Description" value={crud.current.d} full />
            </div>
          ) : (
            <div className="space-y-4">
              <Field label={columns[0]}>
                <input className={inputCls} value={crud.current.a} onChange={(e) => crud.update({ a: e.target.value })} />
              </Field>
              <Field label={columns[1]}>
                <input className={inputCls} value={crud.current.b} onChange={(e) => crud.update({ b: e.target.value })} />
              </Field>
              <Field label={columns[2]}>
                <input className={inputCls} value={crud.current.c} onChange={(e) => crud.update({ c: e.target.value })} />
              </Field>
              <Field label="Description">
                <textarea rows={4} className={inputCls} value={crud.current.d || ""} onChange={(e) => crud.update({ d: e.target.value })} />
              </Field>
            </div>
          ))}
      </Modal>

      <ConfirmDelete
        open={!!crud.confirm}
        onClose={() => crud.setConfirm(null)}
        onConfirm={() => crud.confirm && crud.remove(crud.confirm)}
        name={crud.confirm?.a || ""}
      />
    </>
  );
}

/* ── Education ── */
const EDUCATION_DATA: ListItem[] = [
  { a: "MSc Computer Science",     b: "Stanford University", c: "2020 — 2022", d: "Specialized in HCI and computer graphics. Graduated with honors." },
  { a: "BSc Software Engineering", b: "UC Berkeley",         c: "2016 — 2020", d: "Top of class, Dean's List four years running." },
];

export function EducationPage() {
  return (
    <ListEditor
      title="Education"
      subtitle="Academic background shown on the user-side Education section."
      icon="school"
      items={EDUCATION_DATA}
      columns={["Degree", "Institution", "Year"]}
    />
  );
}

/* ── Experience ── */
const EXPERIENCE_DATA: ListItem[] = [
  { a: "Senior Frontend Engineer", b: "Vercel",  c: "2023 — Present", d: "Leading the design-systems team across Next.js dashboards." },
  { a: "UI Engineer",              b: "Linear",  c: "2021 — 2023",    d: "Shipped the timeline and roadmap surfaces used by 30k+ teams." },
  { a: "Junior Developer",         b: "Airbnb",  c: "2019 — 2021",    d: "Worked on the host onboarding experience and growth funnels." },
];

export function ExperiencePage() {
  return (
    <ListEditor
      title="Experience"
      subtitle="Work history shown on the user-side Experience section."
      icon="history"
      items={EXPERIENCE_DATA}
      columns={["Role", "Company", "Period"]}
    />
  );
}
import {
  Icon, PageHeader, Field, inputCls,
  RowActions, Modal, ModalFooter, ConfirmDelete, DetailRow, useCrud,
} from "../shared";

type Project = {
  id?: number | string;
  title: string; tag: string; img: string;
  desc: string; live: string; repo: string;
  tech: string; featured: boolean;
};

export function ProjectsPage() {
  const crud = useCrud<Project>([
    { title: "Nebula Dashboard", tag: "Web App",    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600", desc: "Analytics dashboard with realtime charts and 3D data viz.", live: "https://nebula.app",  repo: "https://github.com/alex/nebula", tech: "React, D3, Three.js",    featured: true },
    { title: "VR Configurator",  tag: "3D / WebGL", img: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=600", desc: "Immersive product configurator in WebXR.",              live: "https://vr.demo",   repo: "https://github.com/alex/vrc",   tech: "Three.js, WebXR",        featured: true },
    { title: "Brand System",     tag: "Design",     img: "https://images.unsplash.com/photo-1561070791-2526d30994b8?w=600", desc: "End-to-end identity and design tokens.",              live: "",                  repo: "",                              tech: "Figma, Tokens Studio",   featured: false },
    { title: "AI Studio",        tag: "SaaS",       img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600", desc: "Prompt-driven creative tools for marketers.",         live: "https://ai.studio", repo: "",                              tech: "Next.js, OpenAI",        featured: true },
  ]);
  const blank: Project = { title: "", tag: "", img: "", desc: "", live: "", repo: "", tech: "", featured: false };

  return (
    <>
      <PageHeader
        title="Projects"
        subtitle="Curate every project card shown on the user-side Projects section."
        action={
          <button
            onClick={() => crud.open("create", blank)}
            className="bg-primary text-on-primary font-bold px-5 py-3 rounded-full glow-primary hover:scale-105 transition-transform flex items-center gap-2"
          >
            <Icon name="add" className="text-[18px]" /> New Project
          </button>
        }
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {crud.items.map((p) => (
          <div key={p.id} className="glass-panel rounded-3xl overflow-hidden group flex flex-col">
            <div className="aspect-video bg-surface-variant/40 overflow-hidden relative">
              {p.img
                ? <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                : <div className="w-full h-full flex items-center justify-center text-on-surface-variant"><Icon name="image" /></div>
              }
              {p.featured && (
                <span className="absolute top-3 left-3 text-[10px] uppercase font-bold bg-primary text-on-primary px-2 py-0.5 rounded-full tracking-wider">
                  Featured
                </span>
              )}
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <p className="text-xs uppercase tracking-widest text-primary mb-1">{p.tag}</p>
              <h3 className="font-bold text-on-surface mb-1">{p.title}</h3>
              <p className="text-xs text-on-surface-variant opacity-60 mb-3 line-clamp-2">{p.tech}</p>
              <div className="flex justify-end gap-1 mt-auto">
                <RowActions
                  onView={() => crud.open("view", p)}
                  onEdit={() => crud.open("edit", p)}
                  onDelete={() => crud.setConfirm(p)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={crud.mode !== null}
        onClose={crud.close}
        mode={crud.mode}
        icon="work"
        maxWidth="max-w-3xl"
        title={crud.mode === "view" ? "Project Details" : crud.mode === "edit" ? "Edit Project" : "New Project"}
        footer={<ModalFooter mode={crud.mode} onClose={crud.close} onSave={crud.save} />}
      >
        {crud.current && (crud.mode === "view" ? (
          <div className="space-y-5">
            {crud.current.img && (
              <div className="aspect-video rounded-2xl overflow-hidden bg-surface-variant/40">
                <img src={crud.current.img} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="grid grid-cols-2 gap-5">
              <DetailRow label="Title"      value={crud.current.title} />
              <DetailRow label="Tag"        value={crud.current.tag} />
              <DetailRow label="Tech"       value={crud.current.tech} />
              <DetailRow label="Featured"   value={crud.current.featured ? "Yes" : "No"} />
              <DetailRow label="Live URL"   value={crud.current.live ? <a href={crud.current.live} className="text-primary underline" target="_blank" rel="noreferrer">{crud.current.live}</a> : ""} />
              <DetailRow label="Repository" value={crud.current.repo ? <a href={crud.current.repo} className="text-primary underline" target="_blank" rel="noreferrer">{crud.current.repo}</a> : ""} />
              <DetailRow label="Description" value={crud.current.desc} full />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Title">
                <input className={inputCls} value={crud.current.title} onChange={(e) => crud.update({ title: e.target.value })} />
              </Field>
              <Field label="Tag / Category">
                <input className={inputCls} value={crud.current.tag} onChange={(e) => crud.update({ tag: e.target.value })} />
              </Field>
            </div>
            <Field label="Cover Image URL">
              <input className={inputCls} value={crud.current.img} onChange={(e) => crud.update({ img: e.target.value })} />
            </Field>
            <Field label="Description">
              <textarea rows={3} className={inputCls} value={crud.current.desc} onChange={(e) => crud.update({ desc: e.target.value })} />
            </Field>
            <Field label="Tech Stack">
              <input className={inputCls} value={crud.current.tech} onChange={(e) => crud.update({ tech: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Live URL">
                <input className={inputCls} value={crud.current.live} onChange={(e) => crud.update({ live: e.target.value })} />
              </Field>
              <Field label="Repository URL">
                <input className={inputCls} value={crud.current.repo} onChange={(e) => crud.update({ repo: e.target.value })} />
              </Field>
            </div>
            <label className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] cursor-pointer">
              <input type="checkbox" checked={crud.current.featured} onChange={(e) => crud.update({ featured: e.target.checked })} className="accent-primary w-4 h-4" />
              <span className="text-sm text-on-surface">Feature this project on the homepage</span>
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
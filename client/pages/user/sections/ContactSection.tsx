import { useState } from "react";
import { Icon } from "../components/Icon";
import { publicApi } from "../../../lib/admin-api";
import type { AboutData, CustomizationData } from "../lib/types";

interface ContactSectionProps {
  about: AboutData | null;
  customization: CustomizationData | null;
}

export function ContactSection({ about, customization }: ContactSectionProps) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", body: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.body) return;
    setSending(true);
    try {
      await publicApi.sendContact(form);
      setSent(true);
      setForm({ name: "", email: "", subject: "", body: "" });
    } catch {}
    setSending(false);
  };

  return (
    <section id="contact" className="py-stack-xl px-margin-desktop bg-surface">
      <div className="max-w-5xl mx-auto glass-card rounded-[40px] p-12 md:p-20 relative overflow-hidden">
        {/* Decorative blurs */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-secondary/20 rounded-full blur-[120px]" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Left: contact info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-primary font-label-sm text-label-sm tracking-widest uppercase">
                Contact
              </span>
              <h2 className="font-headline-xl text-headline-xl glow-text">
                Let's Work Together
              </h2>
            </div>
            <p className="text-on-surface-variant text-body-lg">
              Have a vision for a project? I'm currently available for freelance work and collaborations.
            </p>

            <div className="space-y-6">
              {about?.email && (
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl glass-card flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Icon name="mail" />
                  </div>
                  <div>
                    <p className="text-label-sm text-on-surface-variant/60 uppercase">Email Me</p>
                    <p className="text-body-lg font-medium">{about.email}</p>
                  </div>
                </div>
              )}
              {about?.phone && (
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl glass-card flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                    <Icon name="call" />
                  </div>
                  <div>
                    <p className="text-label-sm text-on-surface-variant/60 uppercase">Call Me</p>
                    <p className="text-body-lg font-medium">{about.phone}</p>
                  </div>
                </div>
              )}
            </div>

            {customization?.socialLinks && customization.socialLinks.length > 0 && (
              <div className="flex gap-4 pt-6">
                {customization.socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.label}
                    className="w-12 h-12 rounded-full glass-card flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all duration-300"
                  >
                    <Icon name={s.icon} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Right: form */}
          <form className="space-y-4" onSubmit={submitContact}>
            {sent && (
              <div className="px-4 py-3 rounded-xl bg-primary/15 text-primary text-sm font-medium">
                ✓ Message sent! I'll get back to you soon.
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-label-sm font-label-sm uppercase opacity-60 ml-2 block">
                  Name
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full bg-background/50 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-primary transition-colors text-body-md"
                  placeholder="John Doe"
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <label className="text-label-sm font-label-sm uppercase opacity-60 ml-2 block">
                  Email
                </label>
                <input
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full bg-background/50 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-primary transition-colors text-body-md"
                  placeholder="john@example.com"
                  type="email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-label-sm font-label-sm uppercase opacity-60 ml-2 block">
                Subject
              </label>
              <input
                value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                className="w-full bg-background/50 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-primary transition-colors text-body-md"
                placeholder="Project Inquiry"
                type="text"
              />
            </div>
            <div className="space-y-2">
              <label className="text-label-sm font-label-sm uppercase opacity-60 ml-2 block">
                Message
              </label>
              <textarea
                value={form.body}
                onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                className="w-full bg-background/50 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-primary transition-colors text-body-md resize-none"
                placeholder="How can I help you?"
                rows={4}
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="w-full py-5 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold shadow-[0_0_20px_rgba(214,186,255,0.3)] hover:scale-[1.02] active:scale-95 transition-all text-body-lg disabled:opacity-60 disabled:scale-100"
            >
              {sending ? "Sending…" : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

import { Icon } from "../components/Icon";
import type { ProjectItem } from "../lib/types";

const FALLBACK_PROJECTS: ProjectItem[] = [
  {
    id: 1, title: "Neural Network Viz", tag: "Three.js",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuArqctNa1Hi8EAk5zwyy2-OA_zIft0kgVR_FrmxRE-l6wHiB5pIhmxWa1Glxk8XOGGX1ODfg5FcSbIXAfxst5lXD6yZl7fgFMZMFvueAnKJiBqF8trGTFrqT_aP_aT01SjaOvqDFfp4jNRwDcQfboJBf8MKFH4rB1cqaDfR1qGm11IrstH9P3TnDN-ICofjwvsBJUMMvFNevjckvdmfTm--P_fQIe1TBIK-GD3xJ8d-xaQ8jvuZoCGIt_KcFd7P-etPFB8pw2tXLVay",
    desc: "An interactive 3D visualization tool for complex neural network architectures.",
    live: "#", repo: "#", tech: "React, D3, Three.js", featured: true,
  },
  {
    id: 2, title: "Crypto Pulse", tag: "React Native",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkjPmMBJQGpmrucuM8dRjBNAxrzKwIqInqz3mh-Gsd9MbhtoVad28zrk4v1172zQ8RnLLTZ2tJBxqrvHUkVRaMCfJ1KEMtnW4QPs_xcexmzezVPbwW9BaXeyUWeqeZIDOVnvk0CH9mxdEqxKF1b20fy9RnfZ_gPk0xceIHJ4wfysW2Q35WOPTidkR0yCgQ8LBHZWhSrKK00j3lNOMxaa7vM49js7RJU-_B9EuRPMtcenYCycCW7gXM-HbZeWJ6KTZhyv0opyDKMDLT",
    desc: "Real-time cryptocurrency tracking with personalized alerts.",
    live: "#", repo: "#", tech: "React Native, Redux", featured: true,
  },
  {
    id: 3, title: "Luxe Furniture", tag: "Next.js",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDP3a_JCKLJm1NhMCem4ci7SEyuDf5aovgIjrwRzAm6z3HXWl95ZUhgZUESP2gh0vsNlPwqfGXnNtcxXWnhIYSiXLvLF3XTR9aZ7YBNj2tU8QjhQKcn26ei-UQLd3ZOqop9-QfBeFCxZbVGyeStzGiKS4a3DXFHoTz9iT5u7dhpcM6-ZqIYllnVYjONSmWG2dcgvl7w76_MXkijjm2Qun5XB-0vySqbFc4zBycAWDa9-4ga1dquqD3kVCKgr_iuTcaxlCTwXBhKgmeH",
    desc: "High-performance e-commerce platform with 3D product previews.",
    live: "#", repo: "#", tech: "Next.js, Three.js", featured: false,
  },
];

const TAG_COLORS = ["primary", "secondary", "tertiary"];

interface ProjectsSectionProps {
  projects: ProjectItem[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const list = projects.length > 0 ? projects : FALLBACK_PROJECTS;

  return (
    <section id="projects" className="py-stack-xl px-margin-desktop">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-4">
            <span className="text-primary font-label-sm text-label-sm tracking-widest uppercase">
              Portfolio
            </span>
            <h2 className="font-headline-xl text-headline-xl glow-text">Featured Projects</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {list.map((p, i) => {
            const tc = TAG_COLORS[i % TAG_COLORS.length];
            return (
              <div
                key={p.id}
                className="group relative rounded-3xl overflow-hidden glass-card border border-white/5 hover:border-primary/40 transition-all duration-500 tilt-card reveal"
              >
                <div className="aspect-video w-full overflow-hidden relative">
                  <img
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    src={p.img}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    {p.live && (
                      <a
                        href={p.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center"
                      >
                        <Icon name="link" />
                      </a>
                    )}
                    {p.repo && (
                      <a
                        href={p.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl text-white flex items-center justify-center"
                      >
                        <Icon name="code" />
                      </a>
                    )}
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-headline-md text-headline-md group-hover:text-primary transition-colors">
                      {p.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full bg-${tc}/10 text-${tc} text-label-sm`}>
                      {p.tag}
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-body-md line-clamp-2">{p.desc}</p>
                  <p className="text-label-sm text-on-surface-variant/50">{p.tech}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

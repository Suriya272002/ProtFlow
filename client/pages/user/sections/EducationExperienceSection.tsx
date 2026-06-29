import type { EducationItem, ExperienceItem } from "../lib/types";

const FALLBACK_EDUCATION: EducationItem[] = [
  { id: 0, a: "B.Sc Computer Science", b: "Stanford University", c: "2018 - 2022", d: "Focused on software engineering and computer graphics." },
];
const FALLBACK_EXPERIENCE: ExperienceItem[] = [
  { id: 0, a: "Senior 3D Developer", b: "TechnoVerse Solutions", c: "2023 - Present", d: "Leading frontend team in building high-fidelity 3D dashboards." },
];

interface EducationExperienceSectionProps {
  education: EducationItem[];
  experience: ExperienceItem[];
}

function GradeBar({ value, desc }: { value: number | null; desc: string }) {
  return (
    <>
      {desc && <p className="text-body-md text-on-surface-variant/70 mt-3">{desc}</p>}
      {value !== null && (
        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-xs text-on-surface-variant/60">
            <span>Grade</span>
            <span className="text-primary font-bold">{value}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary-container"
              style={{ width: `${value}%` }}
            />
          </div>
        </div>
      )}
    </>
  );
}

export function EducationExperienceSection({
  education,
  experience,
}: EducationExperienceSectionProps) {
  const eduList  = education.length  > 0 ? education  : FALLBACK_EDUCATION;
  const expList  = experience.length > 0 ? experience : FALLBACK_EXPERIENCE;

  return (
    <section
      id="education"
      className="py-stack-xl px-margin-desktop bg-surface-container-lowest/80 relative"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-10">
        {/* Education */}
        <div className="space-y-12">
          <div className="space-y-4">
            <span className="text-primary font-label-sm text-label-sm tracking-widest uppercase">
              Qualifications
            </span>
            <h2 className="font-headline-xl text-headline-xl glow-text">Education</h2>
          </div>
          <div className="space-y-8 border-l-2 border-white/10 ml-4 pl-12 relative">
            {eduList.map((e) => {
              const hasPct = e.d?.includes("||");
              const desc   = hasPct ? e.d.split("||")[0] : e.d;
              const pct    = hasPct ? parseInt(e.d.split("||")[1]) : null;
              return (
                <div key={e.id} className="relative group">
                  <div className="absolute -left-[61px] top-0 w-6 h-6 rounded-full bg-background border-4 border-primary group-hover:scale-125 transition-transform" />
                  <span className="text-label-sm font-label-sm text-primary uppercase">{e.c}</span>
                  <h3 className="font-headline-md text-headline-md mt-2">{e.a}</h3>
                  <p className="text-on-surface-variant font-medium">{e.b}</p>
                  {e.d && <GradeBar value={pct} desc={desc} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Experience */}
        <div className="space-y-12">
          <div className="space-y-4">
            <span className="text-secondary font-label-sm text-label-sm tracking-widest uppercase">
              Professional Journey
            </span>
            <h2 className="font-headline-xl text-headline-xl glow-text">Experience</h2>
          </div>
          <div className="space-y-8 border-l-2 border-white/10 ml-4 pl-12 relative">
            {expList.map((e) => (
              <div key={e.id} className="relative group">
                <div className="absolute -left-[61px] top-0 w-6 h-6 rounded-full bg-background border-4 border-secondary group-hover:scale-125 transition-transform" />
                <span className="text-label-sm font-label-sm text-secondary uppercase">{e.c}</span>
                <h3 className="font-headline-md text-headline-md mt-2">{e.a}</h3>
                <p className="text-on-surface-variant font-medium">{e.b}</p>
                {e.d && (
                  <p className="text-body-md text-on-surface-variant/70 mt-3">{e.d}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

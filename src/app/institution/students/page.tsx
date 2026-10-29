"use client";

import { Card, PageTitle, SkillBar } from "@/components/ui";
import { useStore } from "@/lib/store";
import { overallReadiness, recommendRoles } from "@/lib/matching";

export default function InstitutionStudents() {
  const { state } = useStore();

  return (
    <>
      <PageTitle
        kicker="Cohort monitor"
        title="Student skill development & participation"
        subtitle="Profiles, readiness scores, internship activity, and suggested career tracks."
      />
      <div className="space-y-4">
        {state.students.map((p) => {
          const u = state.users.find((x) => x.id === p.userId);
          const apps = state.applications.filter((a) => a.applicantId === p.userId);
          const role = recommendRoles(p)[0];
          const top = [...p.skills].sort((a, b) => b.level - a.level)[0];
          return (
            <Card key={p.userId}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">{u?.name}</h3>
                  <p className="text-sm text-slate-400">
                    {p.program} · {p.year} · CGPA {p.cgpa}
                  </p>
                  <p className="mt-1 text-sm text-teal-200">
                    Best fit: {role.title} ({role.fit}%) · {apps.length} applications
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-[family-name:var(--font-serif)] text-3xl">{overallReadiness(p)}%</p>
                  <p className="text-xs uppercase text-slate-400">readiness</p>
                </div>
              </div>
              {top && (
                <div className="mt-4 max-w-md">
                  <SkillBar
                    name={`Top skill · ${state.skills.find((s) => s.id === top.skillId)?.name}`}
                    level={top.level}
                  />
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </>
  );
}

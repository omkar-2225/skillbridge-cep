"use client";

import { Card, PageTitle, SkillBar } from "@/components/ui";
import { useStore } from "@/lib/store";
import { recommendPrograms, recommendRoles } from "@/lib/matching";

export default function MappingPage() {
  const { user, state } = useStore();
  const profile = state.students.find((s) => s.userId === user?.id);
  if (!profile) return null;
  const roles = recommendRoles(profile);
  const programs = recommendPrograms(profile, state.programs);
  const tech = profile.skills.filter((s) =>
    state.skills.find((k) => k.id === s.skillId)?.category === "technical"
  );
  const soft = profile.skills.filter((s) =>
    state.skills.find((k) => k.id === s.skillId)?.category === "soft"
  );

  return (
    <>
      <PageTitle
        kicker="Skill mapping"
        title="Your skill DNA and career map"
        subtitle="Strengths and gaps are scored against current industry role templates and learning programs."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Technical skills</h2>
          <div className="space-y-3">
            {tech.map((s) => (
              <SkillBar
                key={s.skillId}
                name={state.skills.find((k) => k.id === s.skillId)?.name ?? s.skillId}
                level={s.level}
                warn={s.level < 55}
              />
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Soft skills</h2>
          <div className="space-y-3">
            {soft.map((s) => (
              <SkillBar
                key={s.skillId}
                name={state.skills.find((k) => k.id === s.skillId)?.name ?? s.skillId}
                level={s.level}
                warn={s.level < 55}
              />
            ))}
          </div>
        </Card>
      </div>
      <h2 className="mt-8 mb-3 text-lg font-semibold">Recommended roles & industries</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {roles.map((r) => (
          <Card key={r.key}>
            <p className="text-sm text-teal-300">{r.industry}</p>
            <h3 className="mt-1 text-xl font-semibold">{r.title}</h3>
            <p className="mt-2 font-[family-name:var(--font-serif)] text-3xl text-amber-200">{r.fit}%</p>
            <p className="mt-2 text-sm text-slate-400">
              Close next: {r.missing.map((id) => state.skills.find((s) => s.id === id)?.name).join(", ") || "Ready"}
            </p>
          </Card>
        ))}
      </div>
      <h2 className="mt-8 mb-3 text-lg font-semibold">Personalized learning</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {programs.map((p) => (
          <Card key={p.id}>
            <p className="chip">{p.level} · gap score {p.relevance}</p>
            <h3 className="mt-3 text-lg font-semibold">{p.title}</h3>
            <p className="text-sm text-slate-400">
              {p.provider} · {p.duration} · {p.format}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{p.description}</p>
          </Card>
        ))}
      </div>
    </>
  );
}

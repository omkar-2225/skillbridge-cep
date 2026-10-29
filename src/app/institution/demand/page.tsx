"use client";

import { Card, PageTitle } from "@/components/ui";
import { useStore } from "@/lib/store";
import { overallReadiness } from "@/lib/matching";

export default function DemandPage() {
  const { state } = useStore();
  const rows = state.skills.map((sk) => {
    const demand = state.opportunities.filter((o) => o.requiredSkills.includes(sk.id)).length;
    const supply = Math.round(
      state.students.reduce((sum, st) => sum + (st.skills.find((x) => x.skillId === sk.id)?.level ?? 0), 0) /
        Math.max(state.students.length, 1)
    );
    return { ...sk, demand, supply, gap: demand * 10 - supply };
  }).sort((a, b) => b.gap - a.gap);

  const placement = state.applications.filter((a) => {
    const o = state.opportunities.find((x) => x.id === a.opportunityId);
    return o?.type === "job";
  });

  return (
    <>
      <PageTitle
        kicker="Policy & T&P"
        title="Skill demand vs campus supply"
        subtitle="Use this view to plan FDPs, electives, and industry learning programs."
      />
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs uppercase text-slate-400">Mean readiness</p>
          <p className="mt-2 text-3xl">
            {Math.round(
              state.students.reduce((s, p) => s + overallReadiness(p), 0) / Math.max(state.students.length, 1)
            )}
            %
          </p>
        </Card>
        <Card>
          <p className="text-xs uppercase text-slate-400">Placement pipeline</p>
          <p className="mt-2 text-3xl">{placement.length}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase text-slate-400">Live industry programs</p>
          <p className="mt-2 text-3xl">{state.programs.length}</p>
        </Card>
      </div>
      <div className="overflow-x-auto glass rounded-2xl">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="px-4 py-3">Skill</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Openings</th>
              <th className="px-4 py-3">Avg student level</th>
              <th className="px-4 py-3">Priority gap</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-white/10">
                <td className="px-4 py-3">{r.name}</td>
                <td className="px-4 py-3 capitalize">{r.category}</td>
                <td className="px-4 py-3">{r.demand}</td>
                <td className="px-4 py-3">{r.supply}%</td>
                <td className="px-4 py-3 text-amber-200">{r.gap}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

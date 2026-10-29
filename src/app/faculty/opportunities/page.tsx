"use client";

import { OpportunityCard } from "@/components/opportunity-card";
import { Card, PageTitle } from "@/components/ui";
import { useStore } from "@/lib/store";

export default function FacultyOpps() {
  const { user, state, apply } = useStore();
  const list = state.opportunities.filter((o) => o.audience !== "student");
  const mine = state.applications.filter((a) => a.applicantId === user?.id);

  return (
    <>
      <PageTitle
        kicker="Faculty internships & FDPs"
        title="Industrial training, consultancy, and research"
        subtitle="Apply to programs designed for academicians. Track offers, mentor feedback, and completion."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {list.map((o) => (
          <OpportunityCard key={o.id} opp={o} onApply={() => apply(o.id)} />
        ))}
      </div>
      <h2 className="mt-8 mb-3 text-lg font-semibold">Your pipeline</h2>
      {mine.map((a) => {
        const o = state.opportunities.find((x) => x.id === a.opportunityId);
        return (
          <Card key={a.id} className="mb-3 flex justify-between">
            <div>
              <p className="font-medium">{o?.title}</p>
              <p className="text-sm text-slate-400">{a.status} · {a.appliedAt}</p>
            </div>
            <span className="chip">{a.progress}%</span>
          </Card>
        );
      })}
    </>
  );
}

"use client";

import { Card, PageTitle, Stat } from "@/components/ui";
import { useStore } from "@/lib/store";

export default function IndustryHome() {
  const { state } = useStore();
  const apps = state.applications.filter((a) => a.role === "student");
  const shortlisted = apps.filter((a) => ["shortlisted", "interview", "offered"].includes(a.status));

  return (
    <>
      <PageTitle
        kicker="Industry portal"
        title="Hire for skills, not just resumes"
        subtitle="Post internships and jobs, shortlist by skill compatibility, and run campus collaborations."
      />
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Live openings" value={state.opportunities.filter((o) => o.audience !== "faculty").length} />
        <Stat label="Student applications" value={apps.length} />
        <Stat label="In pipeline" value={shortlisted.length} />
        <Stat label="Learning programs" value={state.programs.length} />
      </div>
      <Card className="mt-6">
        <h2 className="mb-3 font-semibold">Recent applicants</h2>
        <div className="space-y-2">
          {apps.slice(0, 6).map((a) => {
            const u = state.users.find((x) => x.id === a.applicantId);
            const o = state.opportunities.find((x) => x.id === a.opportunityId);
            return (
              <div key={a.id} className="flex justify-between rounded-xl border border-white/10 px-3 py-2 text-sm">
                <span>
                  {u?.name} → {o?.title}
                </span>
                <span className="text-teal-300">
                  {a.matchScore}% · {a.status}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}

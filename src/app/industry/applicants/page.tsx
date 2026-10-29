"use client";

import { Card, PageTitle } from "@/components/ui";
import { useStore } from "@/lib/store";
import type { ApplicationStatus } from "@/lib/types";

const STATUSES: ApplicationStatus[] = ["applied", "shortlisted", "interview", "offered", "rejected", "completed"];

export default function ApplicantsPage() {
  const { state, setStatus } = useStore();
  const rows = state.applications
    .filter((a) => a.role === "student")
    .sort((a, b) => b.matchScore - a.matchScore);

  return (
    <>
      <PageTitle
        kicker="Recruitment"
        title="Shortlist by skill compatibility"
        subtitle="Ranked applicants, eligibility context, and stage management for internships and placements."
      />
      <div className="space-y-3">
        {rows.map((a) => {
          const student = state.users.find((u) => u.id === a.applicantId);
          const profile = state.students.find((s) => s.userId === a.applicantId);
          const opp = state.opportunities.find((o) => o.id === a.opportunityId);
          return (
            <Card key={a.id} className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="font-semibold">
                  {student?.name}{" "}
                  <span className="text-teal-300">· {a.matchScore}% skill fit</span>
                </p>
                <p className="text-sm text-slate-400">
                  {profile?.program} · CGPA {profile?.cgpa} · {opp?.title}
                </p>
                <p className="mt-1 text-xs text-slate-500">Documents: {profile?.resumeUrl}</p>
              </div>
              <select
                className="field w-44"
                value={a.status}
                onChange={(e) => setStatus(a.id, e.target.value as ApplicationStatus)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Card>
          );
        })}
      </div>
    </>
  );
}

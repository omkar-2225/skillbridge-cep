"use client";

import { Card, PageTitle, Stat } from "@/components/ui";
import { useStore } from "@/lib/store";

export default function FacultyHome() {
  const { user, state } = useStore();
  const apps = state.applications.filter((a) => a.applicantId === user?.id);
  const facultyOpps = state.opportunities.filter((o) => o.audience !== "student");

  return (
    <>
      <PageTitle
        kicker="Academician portal"
        title="Industry exposure for faculty"
        subtitle="Faculty internships, FDPs, consultancy, and collaborative research — aligned with current industry practice."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="Open faculty programs" value={facultyOpps.length} />
        <Stat label="Your applications" value={apps.length} />
        <Stat label="Collaborations" value={state.collaborations.length} />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {facultyOpps.slice(0, 4).map((o) => (
          <Card key={o.id}>
            <p className="chip">{o.type.replace("-", " ")}</p>
            <h3 className="mt-3 text-lg font-semibold">{o.title}</h3>
            <p className="text-sm text-teal-200">{o.company}</p>
            <p className="mt-2 text-sm text-slate-400">{o.description}</p>
          </Card>
        ))}
      </div>
    </>
  );
}

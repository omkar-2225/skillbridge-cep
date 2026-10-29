"use client";

import { Card, PageTitle } from "@/components/ui";
import { useStore } from "@/lib/store";

export default function FacultyCollab() {
  const { user, state, enrollCollab } = useStore();
  return (
    <>
      <PageTitle
        kicker="Industry–academia collaboration"
        title="Mentorship, workshops, and joint projects"
        subtitle="Co-create curriculum, host guest lectures, and partner on live industry problems."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {state.collaborations.map((c) => (
          <Card key={c.id}>
            <p className="chip">{c.type}</p>
            <h3 className="mt-3 text-lg font-semibold">{c.title}</h3>
            <p className="text-sm text-slate-400">
              {c.host} · {c.date}
            </p>
            <p className="mt-2 text-sm text-slate-300">{c.description}</p>
            <button className="btn btn-primary mt-4" onClick={() => enrollCollab(c.id)}>
              {c.enrolled.includes(user?.id ?? "") ? "Participating" : "Join"}
            </button>
          </Card>
        ))}
      </div>
    </>
  );
}

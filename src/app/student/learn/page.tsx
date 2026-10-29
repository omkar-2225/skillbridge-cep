"use client";

import { Card, PageTitle } from "@/components/ui";
import { useStore } from "@/lib/store";
import { recommendPrograms } from "@/lib/matching";

export default function LearnPage() {
  const { user, state, enrollCollab } = useStore();
  const profile = state.students.find((s) => s.userId === user?.id);
  const programs = profile ? recommendPrograms(profile, state.programs) : state.programs.map((p) => ({ ...p, relevance: 0 }));

  return (
    <>
      <PageTitle
        kicker="Industry learning"
        title="Programs, mentorship, and live collaboration"
        subtitle="Close skill gaps before you apply. Enroll in workshops, challenges, and mentorship circles."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {programs.map((p) => (
          <Card key={p.id}>
            <p className="chip">{p.provider}</p>
            <h3 className="mt-3 text-xl font-semibold">{p.title}</h3>
            <p className="mt-2 text-sm text-slate-400">
              {p.duration} · {p.format} · {p.level}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{p.description}</p>
          </Card>
        ))}
      </div>
      <h2 className="mt-8 mb-3 text-lg font-semibold">Campus × industry events</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {state.collaborations.map((c) => (
          <Card key={c.id}>
            <p className="chip">{c.type}</p>
            <h3 className="mt-3 text-lg font-semibold">{c.title}</h3>
            <p className="text-sm text-slate-400">
              {c.host} · {c.date} · {c.enrolled.length}/{c.seats} seats
            </p>
            <p className="mt-2 text-sm text-slate-300">{c.description}</p>
            <button className="btn btn-primary mt-4" onClick={() => enrollCollab(c.id)}>
              {c.enrolled.includes(user?.id ?? "") ? "Enrolled" : "Enroll"}
            </button>
          </Card>
        ))}
      </div>
    </>
  );
}

"use client";

import { FormEvent, useState } from "react";
import { Card, PageTitle } from "@/components/ui";
import { useStore } from "@/lib/store";

export default function IndustryPrograms() {
  const { state, postProgram } = useStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    postProgram({
      title,
      provider: "Nexus Labs",
      skills: ["js", "react", "comm"],
      duration: "4 weeks",
      format: "Hybrid workshop",
      description,
      level: "intermediate",
    });
    setTitle("");
    setDescription("");
  }

  return (
    <>
      <PageTitle
        kicker="Learning programs"
        title="Publish training before hiring"
        subtitle="Certification courses, workshops, and mentorship initiatives that close in-demand skill gaps."
      />
      <Card className="mb-6 max-w-2xl">
        <form className="space-y-3" onSubmit={submit}>
          <input className="field" required placeholder="Program title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea className="field min-h-24" required placeholder="What students will learn" value={description} onChange={(e) => setDescription(e.target.value)} />
          <button className="btn btn-primary" type="submit">
            Publish program
          </button>
        </form>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        {state.programs.map((p) => (
          <Card key={p.id}>
            <h3 className="font-semibold">{p.title}</h3>
            <p className="text-sm text-slate-400">
              {p.provider} · {p.duration}
            </p>
            <p className="mt-2 text-sm text-slate-300">{p.description}</p>
          </Card>
        ))}
      </div>
    </>
  );
}

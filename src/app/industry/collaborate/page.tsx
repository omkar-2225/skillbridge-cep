"use client";

import { FormEvent, useState } from "react";
import { Card, PageTitle } from "@/components/ui";
import { useStore } from "@/lib/store";
import type { Collaboration } from "@/lib/types";

export default function IndustryCollab() {
  const { state, postCollab } = useStore();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<Collaboration["type"]>("workshop");
  const [description, setDescription] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    postCollab({
      title,
      type,
      host: "Nexus Labs",
      date: "2026-12-01",
      description,
      seats: 40,
    });
    setTitle("");
    setDescription("");
  }

  return (
    <>
      <PageTitle kicker="Collaborate" title="Mentorship, lectures, challenges, live projects" />
      <Card className="mb-6 max-w-2xl">
        <form className="space-y-3" onSubmit={submit}>
          <input className="field" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Initiative title" />
          <select className="field" value={type} onChange={(e) => setType(e.target.value as Collaboration["type"])}>
            <option value="mentorship">Mentorship</option>
            <option value="workshop">Workshop</option>
            <option value="guest-lecture">Guest lecture</option>
            <option value="challenge">Innovation challenge</option>
            <option value="live-project">Live project</option>
            <option value="research">Research partnership</option>
          </select>
          <textarea className="field min-h-24" required value={description} onChange={(e) => setDescription(e.target.value)} />
          <button className="btn btn-primary" type="submit">
            Publish
          </button>
        </form>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        {state.collaborations.map((c) => (
          <Card key={c.id}>
            <p className="chip">{c.type}</p>
            <h3 className="mt-2 font-semibold">{c.title}</h3>
            <p className="text-sm text-slate-400">
              {c.enrolled.length} enrolled / {c.seats}
            </p>
            <p className="mt-2 text-sm text-slate-300">{c.description}</p>
          </Card>
        ))}
      </div>
    </>
  );
}

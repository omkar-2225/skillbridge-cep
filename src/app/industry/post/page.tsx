"use client";

import { FormEvent, useState } from "react";
import { Card, PageTitle } from "@/components/ui";
import { useStore } from "@/lib/store";
import type { OpportunityType } from "@/lib/types";

export default function PostOpening() {
  const { state, postOpportunity } = useStore();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<OpportunityType>("internship");
  const [location, setLocation] = useState("Bengaluru");
  const [stipend, setStipend] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState<string[]>(["js", "react"]);
  const [saved, setSaved] = useState(false);

  function toggle(id: string) {
    setSkills((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    postOpportunity({
      type,
      title,
      company: "Nexus Labs",
      location,
      mode: "hybrid",
      stipend,
      duration: type === "job" ? "Full-time" : "8 weeks",
      deadline: "2026-12-31",
      description,
      requiredSkills: skills,
      eligibility: "As per institute norms",
      openings: 5,
      audience: type === "fdp" || type === "faculty-internship" || type === "consultancy" || type === "research" ? "faculty" : "student",
    });
    setSaved(true);
    setTitle("");
    setDescription("");
  }

  return (
    <>
      <PageTitle kicker="Recruit" title="Post an internship, job, or faculty program" />
      <Card className="max-w-3xl">
        <form className="space-y-3" onSubmit={submit}>
          <input className="field" required placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <select className="field" value={type} onChange={(e) => setType(e.target.value as OpportunityType)}>
            <option value="internship">Internship</option>
            <option value="job">Job</option>
            <option value="apprenticeship">Apprenticeship</option>
            <option value="project">Live project</option>
            <option value="fdp">Faculty Development Program</option>
            <option value="faculty-internship">Faculty internship</option>
            <option value="consultancy">Consultancy</option>
            <option value="research">Research collaboration</option>
          </select>
          <input className="field" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
          <input className="field" placeholder="Stipend / CTC" value={stipend} onChange={(e) => setStipend(e.target.value)} />
          <textarea className="field min-h-28" required placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <p className="text-sm text-slate-400">Required skills</p>
          <div className="flex flex-wrap gap-2">
            {state.skills.map((s) => (
              <button
                type="button"
                key={s.id}
                onClick={() => toggle(s.id)}
                className={`chip ${skills.includes(s.id) ? "bg-teal-400/20" : ""}`}
              >
                {s.name}
              </button>
            ))}
          </div>
          <button className="btn btn-primary" type="submit">
            Publish opening
          </button>
          {saved && <p className="text-sm text-teal-300">Posted. Students and faculty will see matches immediately.</p>}
        </form>
      </Card>
    </>
  );
}

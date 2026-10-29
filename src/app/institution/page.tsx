"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, PageTitle, Stat } from "@/components/ui";
import { useStore } from "@/lib/store";
import { overallReadiness } from "@/lib/matching";

export default function InstitutionHome() {
  const { state } = useStore();
  const students = state.students;
  const avgReady = Math.round(
    students.reduce((s, p) => s + overallReadiness(p), 0) / Math.max(students.length, 1)
  );
  const internApps = state.applications.filter((a) => {
    const o = state.opportunities.find((x) => x.id === a.opportunityId);
    return o && o.type !== "job" && a.role === "student";
  });
  const jobApps = state.applications.filter((a) => {
    const o = state.opportunities.find((x) => x.id === a.opportunityId);
    return o?.type === "job";
  });
  const offered = state.applications.filter((a) => a.status === "offered" || a.status === "completed").length;

  const demand = state.skills
    .map((sk) => ({
      name: sk.name.split(" ")[0],
      demand: state.opportunities.filter((o) => o.requiredSkills.includes(sk.id)).length,
    }))
    .sort((a, b) => b.demand - a.demand)
    .slice(0, 8);

  return (
    <>
      <PageTitle
        kicker="Institution analytics"
        title="Skill development, internships, placements"
        subtitle="Monitor readiness, participation, and recruitment outcomes for data-driven T&P decisions."
      />
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Avg placement readiness" value={`${avgReady}%`} />
        <Stat label="Internship applications" value={internApps.length} />
        <Stat label="Placement applications" value={jobApps.length} />
        <Stat label="Offers / completions" value={offered} />
      </div>
      <Card className="mt-6 h-80">
        <h2 className="mb-4 font-semibold">Industry skill demand (openings mentioning each skill)</h2>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={demand}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="name" stroke="#8aa0b5" fontSize={12} />
            <YAxis stroke="#8aa0b5" allowDecimals={false} />
            <Tooltip
              contentStyle={{ background: "#0d1b2a", border: "1px solid rgba(126,184,218,0.2)" }}
            />
            <Bar dataKey="demand" fill="#2dd4bf" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </>
  );
}

"use client";

import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Building2,
  CheckCircle2,
  GraduationCap,
  LineChart,
  Users,
} from "lucide-react";
import { Logo } from "@/components/ui";
import { ThemeToggle } from "@/components/theme-toggle";

const features = [
  {
    icon: Brain,
    title: "Skill assessment & profiling",
    text: "Questionnaires and aptitude checks generate a verified skill profile with technical and soft-skill gaps.",
  },
  {
    icon: LineChart,
    title: "Intelligent matching",
    text: "Recommendations map students to roles, industries, internships, and learning programs.",
  },
  {
    icon: Building2,
    title: "Internships & placements",
    text: "Industries post openings; students apply, track status, and recruiters shortlist by skill fit.",
  },
  {
    icon: GraduationCap,
    title: "Faculty immersion",
    text: "Academicians explore FDPs, industrial training, consultancy, and joint research.",
  },
  {
    icon: Users,
    title: "Collaboration workspace",
    text: "Mentorship, workshops, guest lectures, live projects, and innovation challenges.",
  },
  {
    icon: CheckCircle2,
    title: "Institution analytics",
    text: "Dashboards for skill development, internship participation, and placement readiness.",
  },
];

export default function HomePage() {
  return (
    <div className="grid-bg min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login" className="btn btn-ghost">
            Sign in
          </Link>
          <Link href="/register" className="btn btn-primary">
            Create account
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-16 pt-10">
        <p className="chip">Academia–Industry Collaboration Portal</p>
        <h1 className="mt-5 max-w-4xl font-[family-name:var(--font-serif)] text-4xl leading-tight md:text-6xl">
          Close the skill gap. Match talent to opportunity. Build careers with evidence.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-slate-300">
          SKILLBRIDGE is an intelligent skill-profiling and opportunity matching ecosystem
          connecting students, industries, academicians, and institutions — from assessment to
          internship to placement.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/register" className="btn btn-primary">
            Enter the portal <ArrowRight size={16} />
          </Link>
          <Link href="/login" className="btn btn-ghost">
            Use a demo role
          </Link>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-4">
          {[
            ["4 roles", "Student, faculty, industry, institution"],
            ["Skill DNA", "Technical, soft, and domain scores"],
            ["Match engine", "Fit scores against live openings"],
            ["Digital portfolio", "Verified skills, projects, internships"],
          ].map(([k, v]) => (
            <div key={k} className="glass rounded-2xl p-5">
              <p className="text-teal-300">{k}</p>
              <p className="mt-2 text-sm text-slate-400">{v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <h2 className="font-[family-name:var(--font-serif)] text-3xl">Platform capabilities</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <article key={f.title} className="glass rounded-2xl p-5">
              <f.icon className="text-teal-300" size={22} />
              <h3 className="mt-3 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{f.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

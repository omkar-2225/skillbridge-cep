"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { Card, PageTitle } from "@/components/ui";
import { ROADMAPS } from "@/lib/roadmaps-data";
import { useStore } from "@/lib/store";

export default function RoadmapsPage() {
  const { user, state } = useStore();
  const profile = state.students.find((s) => s.userId === user?.id);
  const isFirstYear = profile?.year === "1st Year";

  // Filter: "all" | "first-year" | "basic-stack" | "specialization"
  const [filter, setFilter] = useState<string>(isFirstYear ? "first-year" : "all");
  const [expandedRoadmapId, setExpandedRoadmapId] = useState<string>(
    isFirstYear ? "first-year-foundation" : "basic-required-stack"
  );
  const [checkedTopics, setCheckedTopics] = useState<Record<string, boolean>>({});

  const filteredRoadmaps = useMemo(() => {
    if (filter === "all") return ROADMAPS;
    return ROADMAPS.filter((r) => r.category === filter);
  }, [filter]);

  function toggleTopic(topicKey: string) {
    setCheckedTopics((prev) => ({
      ...prev,
      [topicKey]: !prev[topicKey],
    }));
  }

  return (
    <>
      <PageTitle
        kicker="Curated Career Navigation"
        title="Engineering Roadmaps &amp; Required Stacks"
        subtitle="Step-by-step learning tracks tailored from 1st Year foundational basics to industry-standard tech stacks and placement interview prep."
      />

      {/* Special 1st Year Banner */}
      {isFirstYear && (
        <div className="mb-6 rounded-2xl border border-teal-500/30 bg-teal-950/30 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-500/20 text-teal-300 ring-1 ring-teal-500/30">
                <GraduationCap size={22} />
              </span>
              <div>
                <span className="chip border-teal-400/30 bg-teal-400/10 text-teal-200">
                  Welcome 1st Year Student
                </span>
                <h3 className="mt-1 text-base font-semibold text-slate-100">
                  Start with the 1st Year Foundation Roadmap (No Resume Needed)
                </h3>
                <p className="mt-1 text-xs text-slate-300">
                  Focus on computational logic, C/Python syntax, Git, and quantitative aptitude. Build your first project before 2nd year!
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setFilter("first-year");
                setExpandedRoadmapId("first-year-foundation");
              }}
              className="btn btn-primary text-xs"
            >
              Open 1st Year Roadmap
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`btn text-xs ${filter === "all" ? "btn-primary" : "btn-ghost"}`}
        >
          All Roadmaps ({ROADMAPS.length})
        </button>
        <button
          onClick={() => setFilter("first-year")}
          className={`btn text-xs ${
            filter === "first-year"
              ? "btn-primary"
              : "btn-ghost border-teal-500/30 text-teal-300"
          }`}
        >
          🎓 1st Year Foundation Track
        </button>
        <button
          onClick={() => setFilter("basic-stack")}
          className={`btn text-xs ${filter === "basic-stack" ? "btn-primary" : "btn-ghost"}`}
        >
          💻 Basic Required Stack (Universal)
        </button>
        <button
          onClick={() => setFilter("specialization")}
          className={`btn text-xs ${filter === "specialization" ? "btn-primary" : "btn-ghost"}`}
        >
          🚀 Web, DSA &amp; AI Tracks
        </button>
      </div>

      {/* Roadmaps List */}
      <div className="space-y-6">
        {filteredRoadmaps.map((rm) => {
          const isExpanded = expandedRoadmapId === rm.id;
          const allTopics = rm.milestones.flatMap((m) => m.topics);
          const completedCount = allTopics.filter((t) => checkedTopics[`${rm.id}-${t}`]).length;
          const progressPct = Math.round((completedCount / (allTopics.length || 1)) * 100);

          return (
            <Card
              key={rm.id}
              className={`transition-all ${
                rm.category === "first-year" ? "border-teal-500/40 bg-slate-900/70" : ""
              }`}
            >
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`chip ${
                        rm.category === "first-year"
                          ? "border-teal-500/40 bg-teal-500/15 text-teal-200"
                          : "border-blue-500/40 bg-blue-500/15 text-blue-200"
                      }`}
                    >
                      {rm.badge}
                    </span>
                    <span className="chip text-[10px] text-slate-400">{rm.forYear}</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-100">{rm.title}</h2>
                  <p className="max-w-3xl text-sm leading-relaxed text-slate-300">{rm.summary}</p>
                </div>

                <button
                  onClick={() => setExpandedRoadmapId(isExpanded ? "" : rm.id)}
                  className="btn btn-ghost text-xs gap-1"
                >
                  {isExpanded ? "Collapse View" : "Explore Roadmap"}
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {/* Basic Required Stack Chips */}
              <div className="mt-4 border-t border-white/5 pt-3">
                <p className="text-xs font-semibold text-slate-400">
                  Basic Required Tech Stack &amp; Core Tools:
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {rm.basicRequiredStack.map((stk) => (
                    <span
                      key={stk}
                      className="chip bg-slate-900/90 text-[11px] font-medium text-teal-300"
                    >
                      <Sparkles size={11} className="text-teal-400" /> {stk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>
                  Topics completed: <strong className="text-teal-300">{completedCount}</strong> of{" "}
                  {allTopics.length}
                </span>
                <span className="font-semibold text-teal-300">{progressPct}% Complete</span>
              </div>
              <div className="bar mt-1.5">
                <span style={{ width: `${progressPct}%` }} />
              </div>

              {/* Expanded Milestones Content */}
              {isExpanded && (
                <div className="mt-6 space-y-5 border-t border-white/10 pt-5">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                    Phased Milestones &amp; Action Plan
                  </h3>

                  <div className="grid gap-4">
                    {rm.milestones.map((m, idx) => (
                      <div
                        key={m.id}
                        className="rounded-2xl border border-white/10 bg-black/25 p-4 transition-all"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="chip border-teal-500/30 text-teal-300">
                            Milestone {idx + 1} · {m.timeframe}
                          </span>
                          <div className="flex gap-1">
                            {m.requiredSkills.map((sk) => (
                              <span key={sk} className="chip text-[10px] bg-slate-900">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>

                        <h4 className="mt-2 text-base font-semibold text-slate-100">{m.title}</h4>
                        <p className="mt-1 text-xs text-slate-300">{m.description}</p>

                        {/* Interactive Topics Checklist */}
                        <div className="mt-3">
                          <p className="text-[11px] font-semibold text-slate-400">
                            Key Concepts (Click to mark completed):
                          </p>
                          <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
                            {m.topics.map((t) => {
                              const tKey = `${rm.id}-${t}`;
                              const isChecked = Boolean(checkedTopics[tKey]);
                              return (
                                <button
                                  key={t}
                                  type="button"
                                  onClick={() => toggleTopic(tKey)}
                                  className={`flex items-start gap-2 rounded-xl p-2 text-left text-xs transition-colors ${
                                    isChecked
                                      ? "bg-teal-500/15 text-teal-200 border border-teal-500/30"
                                      : "bg-white/5 text-slate-300 hover:bg-white/10 border border-transparent"
                                  }`}
                                >
                                  <CheckCircle2
                                    size={15}
                                    className={`mt-0.5 shrink-0 ${
                                      isChecked ? "text-teal-400" : "text-slate-500"
                                    }`}
                                  />
                                  <span className={isChecked ? "line-through opacity-80" : ""}>
                                    {t}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Project Suggestion */}
                        <div className="mt-3.5 rounded-xl border border-teal-500/20 bg-teal-950/20 p-3 text-xs">
                          <span className="font-semibold text-teal-300">
                            Recommended Milestone Project:
                          </span>{" "}
                          <span className="text-slate-200">{m.suggestedProject}</span>
                        </div>

                        {/* Resources */}
                        <div className="mt-3">
                          <p className="text-[11px] font-semibold text-slate-400">
                            Recommended Free Resources:
                          </p>
                          <div className="mt-1 flex flex-wrap gap-2 text-xs">
                            {m.recommendedResources.map((res) => (
                              <span
                                key={res}
                                className="flex items-center gap-1 text-slate-300 hover:text-teal-300"
                              >
                                <BookOpen size={12} className="text-teal-400" /> {res}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* CTA Footer */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900/50 p-5">
        <div>
          <h3 className="font-semibold text-slate-100">Ready to verify what you have learned?</h3>
          <p className="text-xs text-slate-400">
            Take your 10-Question Skill &amp; Aptitude Assessment or try a company Round 0 test.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/student/assessment" className="btn btn-primary text-xs">
            Take Skill &amp; Aptitude Assessment <ArrowRight size={14} />
          </Link>
          <Link href="/student/internships" className="btn btn-ghost text-xs">
            Browse Jobs &amp; Round 0 Tests
          </Link>
        </div>
      </div>
    </>
  );
}

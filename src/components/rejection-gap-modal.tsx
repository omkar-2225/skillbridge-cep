"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  ExternalLink,
  GraduationCap,
  Play,
  Sparkles,
  Video,
  X,
  XCircle,
  Youtube,
} from "lucide-react";
import { getRejectionRemediationPlan } from "@/lib/recommendations-data";
import type { Opportunity, ZeroRoundResult } from "@/lib/types";

interface RejectionGapModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity;
  zeroRoundResult?: ZeroRoundResult;
  feedback?: string;
}

export function RejectionGapModal({
  isOpen,
  onClose,
  opportunity,
  zeroRoundResult,
  feedback,
}: RejectionGapModalProps) {
  const plan = useMemo(() => {
    return getRejectionRemediationPlan({
      opportunityTitle: opportunity.title,
      company: opportunity.company,
      requiredSkills: opportunity.requiredSkills,
      zeroRoundResult,
    });
  }, [opportunity, zeroRoundResult]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/85 p-4 backdrop-blur-md">
      <div className="glass max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-rose-500/40 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="chip border-rose-500/40 bg-rose-500/10 text-rose-300">
                <XCircle size={13} /> Post-Rejection Gap Analysis
              </span>
              <span className="chip border-teal-500/30 text-teal-300">
                Targeted Recovery Plan
              </span>
            </div>
            <h2 className="mt-2 text-2xl font-bold text-slate-100">
              Fill the Gap: {opportunity.title} at {opportunity.company}
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Specific courses, YouTube tutorials, and action steps to master required competencies before re-applying.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {/* Rejection Diagnostic Card */}
          <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-rose-400 shrink-0 mt-0.5" size={20} />
              <div className="space-y-1.5">
                <h3 className="text-sm font-semibold text-rose-200">
                  Why this application was not selected
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {feedback || plan.reason}
                </p>

                {zeroRoundResult && (
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                    <span className="chip border-rose-500/30 text-rose-300 bg-rose-950/40">
                      Overall Score: {zeroRoundResult.totalScore}%
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Easy Round: <strong>{zeroRoundResult.easyScore}%</strong> (Min 35% needed) ·
                      Medium Round: <strong>{zeroRoundResult.mediumScore ?? "N/A"}%</strong> (Min 75% needed) ·
                      Hard Round: <strong>{zeroRoundResult.hardScore ?? "N/A"}%</strong>
                    </span>
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-rose-500/20">
                  <span className="text-[11px] font-semibold text-rose-300">
                    Required skills for this company where gaps were identified:
                  </span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {plan.gapSkills.map((sk) => (
                      <span key={sk} className="chip bg-rose-950/60 text-[10px] text-rose-200 border-rose-500/30">
                        {sk.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3-Step Fast Track Recovery Plan */}
          <div>
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Sparkles size={16} className="text-teal-400" /> 3-Step Fast-Track Plan to Bridge the Gap
            </h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {plan.fastTrackPlan.map((step) => (
                <div
                  key={step.stepNumber}
                  className="rounded-2xl border border-white/10 bg-slate-900/60 p-4"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="chip border-teal-500/30 text-teal-300">Step {step.stepNumber}</span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Calendar size={11} className="text-teal-400" /> {step.estimatedDays}
                    </span>
                  </div>
                  <h4 className="mt-2 text-sm font-semibold text-slate-100">{step.title}</h4>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">{step.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Targeted Courses & YouTube Playlists for each gap skill */}
          <div className="space-y-5">
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <GraduationCap size={18} className="text-teal-400" /> Recommended Courses &amp; YouTube Playlists
            </h3>

            {plan.remediations.map((rem) => (
              <div
                key={rem.skillId}
                className="rounded-2xl border border-white/10 bg-slate-900/50 p-5 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="chip border-teal-500/30 bg-teal-500/10 text-teal-300 font-semibold">
                      Skill Gap: {rem.skillName}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">Curated specifically for {opportunity.company}</span>
                </div>

                <p className="text-xs text-slate-300">{rem.gapSummary}</p>

                <div className="grid gap-4 lg:grid-cols-2">
                  {/* YouTube Tutorials */}
                  <div className="rounded-xl border border-red-500/20 bg-red-950/15 p-3.5 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-red-300">
                      <Youtube size={15} /> Free YouTube Crash Courses &amp; Playlists
                    </div>
                    {rem.youtubeVideos.map((yt) => (
                      <div
                        key={yt.title}
                        className="rounded-xl border border-white/10 bg-black/30 p-3 hover:border-red-500/40 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-100">{yt.title}</p>
                          <span className="chip text-[9px] border-red-500/30 text-red-300 shrink-0">
                            {yt.duration}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Channel: <strong className="text-slate-300">{yt.channel}</strong> · {yt.level}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">{yt.description}</p>
                        <a
                          href={yt.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-red-400 hover:text-red-300 hover:underline"
                        >
                          <Play size={11} /> Watch Free on YouTube <ExternalLink size={10} />
                        </a>
                      </div>
                    ))}
                  </div>

                  {/* Certified / University Courses */}
                  <div className="rounded-xl border border-blue-500/20 bg-blue-950/15 p-3.5 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-300">
                      <Video size={15} /> University &amp; Industry Certified Courses
                    </div>
                    {rem.courses.map((c) => (
                      <div
                        key={c.title}
                        className="rounded-xl border border-white/10 bg-black/30 p-3 hover:border-blue-500/40 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-100">{c.title}</p>
                          <span className="chip text-[9px] border-blue-500/30 text-blue-300 shrink-0">
                            {c.isFree ? "Free Course" : "Certification"}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Platform: <strong className="text-slate-300">{c.platform}</strong> · {c.estimatedTime}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">{c.description}</p>
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 hover:underline"
                        >
                          Join Course <ExternalLink size={10} />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
            <Link href="/student/roadmaps" className="btn btn-primary text-xs gap-1.5">
              <BookOpen size={14} /> Open Skill Roadmap to Track Progress
            </Link>
            <button onClick={onClose} className="btn btn-ghost text-xs">
              Close Gap Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


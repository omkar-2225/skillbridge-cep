"use client";

import { CheckCircle2, MapPin, ShieldAlert, Sparkles, XCircle } from "lucide-react";
import { Card } from "./ui";
import type { Opportunity } from "@/lib/types";
import { useStore } from "@/lib/store";

export function OpportunityCard({
  opp,
  score,
  onApply,
}: {
  opp: Opportunity;
  score?: number;
  onApply?: () => void;
}) {
  const { user, state } = useStore();
  const application = state.applications.find(
    (a) => a.opportunityId === opp.id && a.applicantId === user?.id
  );
  const applied = Boolean(application);
  const zeroResult = application?.zeroRoundResult;

  const skillNames = opp.requiredSkills
    .map((id) => state.skills.find((s) => s.id === id)?.name)
    .filter(Boolean);

  return (
    <Card className="flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="chip">{opp.type.replace("-", " ")}</span>
            <h3 className="mt-3 text-lg font-semibold text-slate-100">{opp.title}</h3>
            <p className="text-sm font-medium text-teal-300">{opp.company}</p>
          </div>
          {score !== undefined && (
            <div className="rounded-2xl bg-teal-400/10 px-3 py-2 text-center ring-1 ring-teal-400/20">
              <p className="text-xl font-semibold text-teal-300">{score}%</p>
              <p className="text-[10px] uppercase tracking-wide text-slate-400">match</p>
            </div>
          )}
        </div>

        <p className="mt-3 text-sm leading-6 text-slate-400">{opp.description}</p>

        <p className="mt-3 flex items-center gap-2 text-xs text-slate-300">
          <MapPin size={13} className="text-teal-400" /> {opp.location} · {opp.mode} · {opp.duration}
        </p>
        {opp.stipend && <p className="mt-1 text-xs font-semibold text-amber-200">{opp.stipend}</p>}

        <div className="mt-3 flex flex-wrap gap-1">
          {skillNames.map((n) => (
            <span key={n} className="chip text-[10px] bg-slate-900/60">
              {n}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 border-t border-white/5 pt-4">
        {applied ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                {zeroResult?.passed ? (
                  <CheckCircle2 size={14} className="text-emerald-400" />
                ) : zeroResult ? (
                  <XCircle size={14} className="text-rose-400" />
                ) : (
                  <CheckCircle2 size={14} className="text-teal-400" />
                )}
                {zeroResult?.passed
                  ? `Round 0 Cleared (${zeroResult.totalScore}%)`
                  : zeroResult
                  ? `Round 0 Not Cleared (${zeroResult.totalScore}%)`
                  : "Application Submitted"}
              </span>
              <span className="chip uppercase text-[10px] text-teal-200">
                {application?.status}
              </span>
            </div>
            {zeroResult && (
              <p className="text-[11px] text-slate-400">
                Easy: {zeroResult.easyScore}% · Medium: {zeroResult.mediumScore ?? "—"}% · Hard: {zeroResult.hardScore ?? "—"}%
              </p>
            )}
          </div>
        ) : onApply ? (
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-[11px] text-teal-300">
              <ShieldAlert size={12} /> Requires Company Round 0 Proctored Test
            </div>
            <button className="btn btn-primary w-full text-xs" onClick={onApply}>
              <Sparkles size={14} /> Take Round 0 Screening &amp; Apply
            </button>
          </div>
        ) : null}
      </div>
    </Card>
  );
}

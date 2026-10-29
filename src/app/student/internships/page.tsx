"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, GraduationCap, XCircle } from "lucide-react";
import { OpportunityCard } from "@/components/opportunity-card";
import { Card, PageTitle } from "@/components/ui";
import { ZeroRoundModal } from "@/components/zero-round-modal";
import { RejectionGapModal } from "@/components/rejection-gap-modal";
import { useStore } from "@/lib/store";
import { matchOpportunity } from "@/lib/matching";
import type { Opportunity, ZeroRoundResult } from "@/lib/types";

export default function InternshipsPage() {
  const { user, state, applyWithZeroRound } = useStore();
  const profile = state.students.find((s) => s.userId === user?.id);

  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [selectedOppForGap, setSelectedOppForGap] = useState<{
    opp: Opportunity;
    zr?: ZeroRoundResult;
    feedback?: string;
  } | null>(null);

  const list = useMemo(
    () =>
      state.opportunities
        .filter((o) => o.audience !== "faculty" && o.type !== "job")
        .filter((o) => type === "all" || o.type === type)
        .filter((o) => `${o.title} ${o.company} ${o.location}`.toLowerCase().includes(q.toLowerCase()))
        .map((o) => ({ o, score: matchOpportunity(profile, o) }))
        .sort((a, b) => b.score - a.score),
    [state.opportunities, profile, q, type]
  );

  const mine = state.applications.filter((a) => a.applicantId === user?.id);

  function handleCompleteZeroRound(result: ZeroRoundResult) {
    if (!selectedOpp) return;
    applyWithZeroRound(selectedOpp.id, result);
    setSelectedOpp(null);
  }

  return (
    <>
      <PageTitle
        kicker="Internships &amp; Practical Training"
        title="Search, Verify Round 0, Apply &amp; Track"
        subtitle="Openings from industry partners require passing the company's adaptive Round 0 Screening Test. If rejected, access targeted courses and tutorials to bridge your skill gaps."
      />

      <div className="mb-5 flex flex-wrap gap-3">
        <input
          className="field max-w-sm"
          placeholder="Search title, company, city"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="field max-w-xs"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="all">All non-job openings</option>
          <option value="internship">Internships</option>
          <option value="apprenticeship">Apprenticeships</option>
          <option value="project">Live projects</option>
        </select>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {list.map(({ o, score }) => (
          <OpportunityCard
            key={o.id}
            opp={o}
            score={score}
            onApply={() => setSelectedOpp(o)}
          />
        ))}
      </div>

      <h2 className="mt-10 mb-3 text-lg font-semibold text-slate-100">
        Application Tracker &amp; Zero Round Status
      </h2>
      <div className="grid gap-3">
        {mine.length === 0 ? (
          <Card className="text-center py-8 text-slate-400">
            No applications submitted yet. Click &quot;Take Round 0 Screening &amp; Apply&quot; on any opening above!
          </Card>
        ) : (
          mine.map((a) => {
            const opp = state.opportunities.find((o) => o.id === a.opportunityId);
            if (!opp) return null;
            const zr = a.zeroRoundResult;
            const isRejected = a.status === "rejected" || (zr && !zr.passed);

            return (
              <Card key={a.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-100">{opp.title}</p>
                    <span className="chip text-[10px]">{opp.company}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Applied on {a.appliedAt} · Skill match {a.matchScore}%
                  </p>
                  {zr && (
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                      <span
                        className={`chip ${
                          zr.passed
                            ? "border-emerald-500/30 text-emerald-300 bg-emerald-950/20"
                            : "border-rose-500/30 text-rose-300 bg-rose-950/20"
                        }`}
                      >
                        {zr.passed ? (
                          <CheckCircle2 size={12} className="text-emerald-400" />
                        ) : (
                          <XCircle size={12} className="text-rose-400" />
                        )}
                        Round 0: {zr.totalScore}% overall
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Easy: {zr.easyScore}% · Medium: {zr.mediumScore ?? "N/A"}% · Hard:{" "}
                        {zr.hardScore ?? "N/A"}% (Switches: {zr.switchCount})
                      </span>
                    </div>
                  )}
                  {a.feedback && <p className="text-xs text-amber-200 mt-1">{a.feedback}</p>}

                  {/* POST-REJECTION COURSE & GAP REMEDIATION CTA */}
                  {isRejected && (
                    <div className="mt-2 pt-1">
                      <button
                        onClick={() =>
                          setSelectedOppForGap({ opp, zr, feedback: a.feedback })
                        }
                        className="btn btn-ghost border-rose-500/40 text-rose-300 text-xs py-1 px-3 gap-1.5 hover:bg-rose-950/30"
                      >
                        <GraduationCap size={13} className="text-rose-400" />
                        Fill the Gap: View Recommended Courses &amp; YouTube Tutorials
                      </button>
                    </div>
                  )}
                </div>

                <div className="w-48 text-right">
                  <p
                    className={`mb-1 text-xs font-semibold uppercase tracking-wider ${
                      isRejected ? "text-rose-400" : "text-teal-300"
                    }`}
                  >
                    {a.status}
                  </p>
                  <div className="bar">
                    <span
                      style={{
                        width: `${a.progress ?? 10}%`,
                        background: isRejected ? "#f87171" : undefined,
                      }}
                    />
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {selectedOpp && (
        <ZeroRoundModal
          opp={selectedOpp}
          isOpen={Boolean(selectedOpp)}
          onClose={() => setSelectedOpp(null)}
          onComplete={handleCompleteZeroRound}
        />
      )}

      {selectedOppForGap && (
        <RejectionGapModal
          isOpen={Boolean(selectedOppForGap)}
          onClose={() => setSelectedOppForGap(null)}
          opportunity={selectedOppForGap.opp}
          zeroRoundResult={selectedOppForGap.zr}
          feedback={selectedOppForGap.feedback}
        />
      )}
    </>
  );
}

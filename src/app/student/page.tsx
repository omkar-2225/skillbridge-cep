"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Edit3,
  FileCheck2,
  GraduationCap,
  Sparkles,
  XCircle,
} from "lucide-react";
import { Card, PageTitle, SkillBar, Stat } from "@/components/ui";
import { useStore } from "@/lib/store";
import { matchOpportunity, overallReadiness, recommendRoles } from "@/lib/matching";
import { UpdateProfileModal } from "@/components/update-profile-modal";

export default function StudentHome() {
  const { user, state } = useStore();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const profile = state.students.find((s) => s.userId === user?.id);
  const apps = state.applications.filter((a) => a.applicantId === user?.id);
  const readiness = profile ? overallReadiness(profile) : 0;
  const topRole = profile ? recommendRoles(profile)[0] : null;

  const isFirstYear = profile?.year === "1st Year";

  const recs = state.opportunities
    .filter((o) => o.audience !== "faculty")
    .map((o) => ({ o, score: matchOpportunity(profile, o) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const gaps = profile
    ? [...profile.skills].sort((a, b) => a.level - b.level).slice(0, 4)
    : [];

  const rejectedApp = apps.find(
    (a) => a.status === "rejected" || (a.zeroRoundResult && !a.zeroRoundResult.passed)
  );
  const rejectedOpp = rejectedApp
    ? state.opportunities.find((o) => o.id === rejectedApp.opportunityId)
    : null;

  return (
    <>
      <PageTitle
        kicker="Student ecosystem"
        title={`Welcome back, ${user?.name.split(" ")[0]}`}
        subtitle={`${profile?.collegeName || user?.org} · ${profile?.year || "Student"} · ${profile?.semester || "Sem 1"}`}
      />

      {/* Profile & Track Banner */}
      <div className="mb-6 rounded-2xl border border-teal-500/20 bg-gradient-to-r from-teal-950/40 to-slate-900/60 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-400/15 text-teal-300 ring-1 ring-teal-400/30">
              <GraduationCap size={24} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-100">{user?.name}</span>
                <span className="chip border-teal-400/30 bg-teal-400/10 text-teal-200">
                  {profile?.year || "Student"}
                </span>
                <span className="chip text-[10px] text-slate-300">
                  {profile?.semester || "Semester 1"}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-300">
                {isFirstYear ? (
                  <span className="text-teal-300 font-medium">
                    🎓 1st Year Track: No resume required. Building core CS &amp; aptitude foundations.
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <FileCheck2 size={13} className="text-teal-400" />
                    Resume Verified: {profile?.resumeFileName || profile?.resumeUrl || "Student_Resume.pdf"} (
                    {profile?.resumeSkills?.length || 4} skills identified)
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsUpdateModalOpen(true)}
              className="btn btn-ghost border-teal-500/40 text-teal-300 text-xs gap-1.5 hover:bg-teal-950/40"
            >
              <Edit3 size={13} /> Update Year &amp; Resume
            </button>
            <Link href="/student/assessment" className="btn btn-primary text-xs">
              <Sparkles size={14} /> {profile?.assessed && !profile?.needsReassessment ? "View Assessment" : "Take 10-Q Assessment"}
            </Link>
            <Link href="/student/roadmaps" className="btn btn-ghost text-xs">
              <Compass size={14} /> View Roadmaps
            </Link>
          </div>
        </div>
      </div>

      {/* Promoted / Needs Reassessment Banner */}
      {profile?.needsReassessment && (
        <div className="mb-6 rounded-2xl border border-teal-500/40 bg-teal-950/40 p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg shadow-teal-950/20">
          <div className="flex items-center gap-3">
            <Sparkles className="text-teal-400 shrink-0" size={20} />
            <div>
              <p className="text-sm font-semibold text-teal-200">
                Academic Profile Updated to {profile.year} ({profile.semester})!
              </p>
              <p className="text-xs text-slate-300">
                Your resume skills ({profile.resumeSkills?.map((s) => s.toUpperCase()).join(", ") || "Technical Stack"}) require verification. Take the 10-Question assessment to certify them.
              </p>
            </div>
          </div>
          <Link
            href="/student/assessment"
            className="btn btn-primary text-xs py-1.5 px-4 gap-1.5 shrink-0"
          >
            <Sparkles size={13} /> Take Resume Verification Test
          </Link>
        </div>
      )}

      {/* Post-Rejection Targeted Course & Gap-Filling Recovery Banner */}
      {rejectedApp && rejectedOpp && (
        <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-950/20 p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <XCircle className="text-rose-400 shrink-0" size={20} />
            <div>
              <p className="text-sm font-semibold text-rose-200">
                Post-Rejection Recovery Plan Available: {rejectedOpp.title} ({rejectedOpp.company})
              </p>
              <p className="text-xs text-slate-300">
                Targeted university courses and YouTube tutorials have been generated to fill the skill gaps required by {rejectedOpp.company}.
              </p>
            </div>
          </div>
          <Link
            href="/student/internships"
            className="btn btn-ghost border-rose-500/40 text-rose-300 text-xs py-1.5 px-3.5 hover:bg-rose-900/30"
          >
            Fill the Gap: View Courses &amp; YouTube Tutorials
          </Link>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <Stat
          label="Placement readiness"
          value={`${readiness}%`}
          hint={profile?.assessed ? "From verified assessment" : "Take assessment"}
        />
        <Stat
          label="Aptitude Score"
          value={profile?.aptitudeScore ? `${profile.aptitudeScore}%` : "Not verified"}
          hint="Quantitative &amp; Logical"
        />
        <Stat
          label="Active applications"
          value={apps.length}
          hint={apps.some((a) => a.zeroRoundResult?.passed) ? "Round 0 Cleared" : "Screening pending"}
        />
        <Stat
          label="Best role fit"
          value={topRole?.title ?? "—"}
          hint={topRole ? `${topRole.fit}% compatibility` : ""}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-100">Priority skill gaps</h2>
              <p className="text-xs text-slate-400">Based on your latest 10-question assessment</p>
            </div>
            <Link href="/student/assessment" className="text-xs text-teal-300 hover:underline">
              View Verified Results
            </Link>
          </div>
          <div className="space-y-4">
            {gaps.map((g) => (
              <SkillBar
                key={g.skillId}
                name={state.skills.find((s) => s.id === g.skillId)?.name ?? g.skillId}
                level={g.level}
                warn={g.level < 60}
              />
            ))}
          </div>
          <div className="mt-5 border-t border-white/5 pt-3">
            <Link
              href="/student/roadmaps"
              className="flex items-center justify-between text-xs text-teal-300 hover:underline"
            >
              <span>See recommended stacks to close these gaps</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-100">Recommended for you</h2>
            <Link href="/student/internships" className="text-xs text-teal-300 hover:underline">
              View all openings
            </Link>
          </div>
          <div className="space-y-3">
            {recs.map(({ o, score }) => {
              const app = state.applications.find(
                (a) => a.opportunityId === o.id && a.applicantId === user?.id
              );
              return (
                <div
                  key={o.id}
                  className="rounded-xl border border-white/10 p-3.5 transition-colors hover:bg-white/5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-slate-200">{o.title}</p>
                      <p className="text-xs text-slate-400">
                        {o.company} · {o.type} · {o.location}
                      </p>
                    </div>
                    <span className="chip border-teal-400/30 text-teal-300">{score}% match</span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Round 0: Easy (&ge;35%) &rarr; Med (&ge;75%) &rarr; 2 Hard
                    </span>
                    {app ? (
                      <span className="chip uppercase text-[10px] text-teal-200">
                        {app.status}
                      </span>
                    ) : (
                      <Link
                        href="/student/internships"
                        className="btn btn-primary py-1 px-2.5 text-[11px]"
                      >
                        Screening &amp; Apply
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {profile && (
        <UpdateProfileModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          profile={profile}
        />
      )}
    </>
  );
}

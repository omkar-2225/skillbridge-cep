"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Edit3,
  FileCheck2,
  GraduationCap,
  Info,
  PlusCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Card, PageTitle, SkillBar } from "@/components/ui";
import { useStore } from "@/lib/store";
import { UpdateProfileModal } from "@/components/update-profile-modal";

export default function PortfolioPage() {
  const { user, state } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const profile = state.students.find((s) => s.userId === user?.id);
  const internships = state.applications.filter(
    (a) => a.applicantId === user?.id
  );

  if (!profile || !user) return null;

  const isFirstYear = profile.year === "1st Year";

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <PageTitle
          kicker="Digital portfolio"
          title={user.name}
          subtitle={`${profile.collegeName || user.org} · ${profile.year} (${profile.semester || "Semester 1"}) · ${profile.program}`}
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary text-xs gap-1.5 self-start sm:self-auto"
        >
          <Edit3 size={13} /> Update Academic Year &amp; Resume
        </button>
      </div>

      {/* Academic Progression / Retest Required Banner */}
      {profile.needsReassessment && (
        <div className="mb-6 rounded-2xl border border-teal-500/40 bg-teal-950/40 p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg shadow-teal-950/30">
          <div className="flex items-center gap-3">
            <Sparkles className="text-teal-400 shrink-0" size={20} />
            <div>
              <p className="text-sm font-semibold text-teal-200">
                Academic Profile Updated to {profile.year} ({profile.semester})!
              </p>
              <p className="text-xs text-slate-300">
                Your resume skills ({profile.resumeSkills?.map((s) => s.toUpperCase()).join(", ") || "Technical Stack"}) have been extracted. Take the 10-Question Skill Assessment to verify these skills on your official profile.
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

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold text-slate-100">Student Profile &amp; Bio</h3>
            <div className="flex items-center gap-2">
              <span className="chip border-teal-500/30 text-teal-300">
                <GraduationCap size={13} /> {profile.year} · {profile.semester || "Semester 1"}
              </span>
              <button
                onClick={() => setIsModalOpen(true)}
                className="chip border-white/10 hover:border-teal-400 hover:text-teal-300 text-[11px] gap-1 transition cursor-pointer"
                title="Edit profile"
              >
                <Edit3 size={11} /> Edit
              </button>
            </div>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-slate-300">{profile.bio}</p>

          {/* Conditional Resume status */}
          <div className="mt-4 rounded-xl border p-3 text-xs">
            {isFirstYear ? (
              <div className="flex items-start gap-2 text-teal-300">
                <Info size={16} className="mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-teal-200">1st Year Track (Resume Optional)</span>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="text-[10px] text-teal-300 hover:underline"
                    >
                      Attach Resume / Promote Year
                    </button>
                  </div>
                  <p className="mt-0.5 text-slate-400">
                    First-year students are exempt from compulsory resumes. When you advance to 2nd, 3rd, or 4th year, adding a resume is mandatory to verify your technical skills.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-teal-200">
                  <div className="flex items-center gap-2">
                    <FileCheck2 size={16} />
                    <span>
                      Linked Resume: <strong className="text-white">{profile.resumeFileName || profile.resumeUrl}</strong>
                    </span>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-[10px] text-teal-300 hover:underline"
                  >
                    Update Resume
                  </button>
                </div>
                {profile.resumeSkills && profile.resumeSkills.length > 0 && (
                  <div>
                    <span className="text-[11px] text-slate-400">Skills extracted from resume:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {profile.resumeSkills.map((sk) => (
                        <span key={sk} className="chip bg-slate-900/60 text-[10px] text-teal-300">
                          {sk.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <h3 className="font-semibold text-slate-100">Verified Skills &amp; Competencies</h3>
            <Link href="/student/assessment" className="text-xs text-teal-300 hover:underline">
              {profile.needsReassessment ? "Verify Skills Now →" : "View Assessment →"}
            </Link>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {profile.skills
              .slice()
              .sort((a, b) => b.level - a.level)
              .slice(0, 8)
              .map((s) => (
                <SkillBar
                  key={s.skillId}
                  name={state.skills.find((k) => k.id === s.skillId)?.name ?? s.skillId}
                  level={s.level}
                />
              ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-100">Aptitude &amp; Round 0 Status</h3>
              <span className="chip border-purple-500/30 text-purple-300">
                Aptitude: {profile.aptitudeScore ? `${profile.aptitudeScore}%` : "Pending"}
              </span>
            </div>

            <ul className="mt-3 space-y-2.5 text-xs text-slate-300">
              {internships.length === 0 ? (
                <li className="text-slate-400">No applications or screening tests taken yet.</li>
              ) : (
                internships.map((a) => {
                  const o = state.opportunities.find((x) => x.id === a.opportunityId);
                  const zr = a.zeroRoundResult;
                  return (
                    <li
                      key={a.id}
                      className="rounded-xl border border-white/5 bg-slate-900/40 p-2.5 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-200">{o?.title}</span>
                        <span className="chip uppercase text-[10px] text-teal-300">
                          {a.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{o?.company}</p>
                      {zr && (
                        <p className="text-[11px] text-teal-300">
                          Round 0: {zr.totalScore}% (Easy: {zr.easyScore}%, Med: {zr.mediumScore ?? "—"}%, Hard: {zr.hardScore ?? "—"}%)
                        </p>
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-100">Gained Courses &amp; Certifications</h3>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-xs text-teal-300 hover:underline flex items-center gap-1"
              >
                <PlusCircle size={12} /> Add Course
              </button>
            </div>

            <ul className="mt-3 space-y-2 text-sm">
              {profile.certifications.length === 0 ? (
                <li className="text-xs text-slate-400">
                  No courses or certifications added yet. Click &ldquo;Add Course&rdquo; to record newly completed MOOCs.
                </li>
              ) : (
                profile.certifications.map((c) => (
                  <li key={c.id} className="flex justify-between gap-2">
                    <span>
                      {c.title}
                      <span className="block text-slate-400 text-xs">
                        {c.issuer} · {c.year}
                      </span>
                    </span>
                    {c.verified && (
                      <span className="chip">
                        <ShieldCheck size={12} /> verified
                      </span>
                    )}
                  </li>
                ))
              )}
            </ul>
          </Card>
        </div>
      </div>

      <h2 className="mt-8 mb-3 text-lg font-semibold text-slate-100">Projects &amp; Achievements</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {profile.projects.map((p) => (
          <Card key={p.id}>
            <h3 className="font-semibold text-slate-100">{p.title}</h3>
            <p className="mt-2 text-sm text-slate-400">{p.description}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {p.skills.map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>
          </Card>
        ))}
        <Card>
          <h3 className="font-semibold text-slate-100">Achievements</h3>
          <ul className="mt-3 list-disc pl-5 text-sm text-slate-300 space-y-1">
            {profile.achievements.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Profile Update Modal */}
      <UpdateProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        profile={profile}
      />
    </>
  );
}

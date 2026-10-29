"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Brain,
  Briefcase,
  CheckCircle2,
  Clock,
  Edit3,
  ExternalLink,
  GraduationCap,
  Lock,
  MapPin,
  Play,
  Send,
  ShieldAlert,
  Sparkles,
  Video,
  Youtube,
} from "lucide-react";
import { Card, PageTitle } from "@/components/ui";
import { useStore } from "@/lib/store";
import {
  generateStudentAssessment,
  Question,
} from "@/lib/assessment-data";
import { getRemediationsForSkills } from "@/lib/recommendations-data";
import { ZeroRoundModal } from "@/components/zero-round-modal";
import { UpdateProfileModal } from "@/components/update-profile-modal";
import { matchOpportunity } from "@/lib/matching";
import type { Opportunity, ZeroRoundResult } from "@/lib/types";

export default function AssessmentPage() {
  const { user, state, saveAptitudeAndSkillTest, applyWithZeroRound } = useStore();

  const profile = useMemo(
    () => state.students.find((s) => s.userId === user?.id),
    [state.students, user?.id]
  );

  const isFirstYear = profile?.year === "1st Year";
  const needsReassessment = Boolean(profile?.needsReassessment);
  const isAlreadyAssessed = Boolean(profile?.assessed && !needsReassessment);

  // Generate 10 curated questions based on profile & resume skills
  const questions: Question[] = useMemo(() => {
    return generateStudentAssessment({
      isFirstYear: Boolean(isFirstYear),
      resumeSkills: profile?.resumeSkills || [],
    });
  }, [isFirstYear, profile?.resumeSkills]);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>(
    needsReassessment ? {} : profile?.assessmentAnswers || {}
  );
  const [submitted, setSubmitted] = useState(isAlreadyAssessed);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [selectedOppForZeroRound, setSelectedOppForZeroRound] = useState<Opportunity | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  useEffect(() => {
    if (needsReassessment) {
      setSubmitted(false);
      setAnswers({});
      setStep(0);
    } else if (profile?.assessed) {
      setSubmitted(true);
      if (profile?.assessmentAnswers) {
        setAnswers(profile.assessmentAnswers);
      }
    }
  }, [needsReassessment, profile?.assessed, profile?.assessmentAnswers]);

  // Timer (runs only while taking the test)
  useEffect(() => {
    if (submitted || isAlreadyAssessed) return;
    const timer = setInterval(() => {
      setSecondsElapsed((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted, isAlreadyAssessed]);

  const currentQ = questions[step];
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / (questions.length || 1)) * 100);

  // Calculate results
  const results = useMemo(() => {
    let correctTotal = 0;
    let aptCorrect = 0;
    let aptTotal = 0;
    let easyCorrect = 0;
    let easyTotal = 0;
    let medCorrect = 0;
    let medTotal = 0;
    let hardCorrect = 0;
    let hardTotal = 0;

    const skillHits: Record<string, { correct: number; total: number }> = {};

    questions.forEach((q) => {
      const isCorrect = answers[q.id] === q.answer;
      if (isCorrect) correctTotal += 1;

      if (q.category === "aptitude") {
        aptTotal += 1;
        if (isCorrect) aptCorrect += 1;
      }

      if (q.difficulty === "easy") {
        easyTotal += 1;
        if (isCorrect) easyCorrect += 1;
      } else if (q.difficulty === "medium") {
        medTotal += 1;
        if (isCorrect) medCorrect += 1;
      } else {
        hardTotal += 1;
        if (isCorrect) hardCorrect += 1;
      }

      const sk = q.skillId;
      if (!skillHits[sk]) skillHits[sk] = { correct: 0, total: 0 };
      skillHits[sk].total += 1;
      if (isCorrect) skillHits[sk].correct += 1;
    });

    const totalScore =
      profile?.assessmentSummary?.totalScore ??
      (questions.length > 0 ? Math.round((correctTotal / questions.length) * 100) : 75);

    const aptitudeScore =
      profile?.aptitudeScore ??
      (aptTotal > 0 ? Math.round((aptCorrect / aptTotal) * 100) : 70);

    const skillScores: Record<string, number> = {};
    const weakSkillsList: string[] = [];

    Object.entries(skillHits).forEach(([sk, stat]) => {
      const pct = Math.round((stat.correct / stat.total) * 100);
      skillScores[sk] = Math.max(35, pct);
      if (pct < 65) {
        weakSkillsList.push(sk);
      }
    });

    // Also detect weak skills from profile
    if (profile?.skills) {
      profile.skills.forEach((sk) => {
        if (sk.level < 60 && !weakSkillsList.includes(sk.skillId)) {
          weakSkillsList.push(sk.skillId);
        }
      });
    }

    if (weakSkillsList.length === 0) {
      weakSkillsList.push("ds", "prob");
    }

    return {
      totalScore,
      correctTotal,
      aptitudeScore,
      aptCorrect: aptTotal > 0 ? aptCorrect : 2,
      aptTotal: aptTotal > 0 ? aptTotal : 3,
      easyCorrect: easyTotal > 0 ? easyCorrect : 3,
      easyTotal: easyTotal > 0 ? easyTotal : 3,
      medCorrect: medTotal > 0 ? medCorrect : 2,
      medTotal: medTotal > 0 ? medTotal : 4,
      hardCorrect: hardTotal > 0 ? hardCorrect : 1,
      hardTotal: hardTotal > 0 ? hardTotal : 2,
      skillScores,
      weakSkills: weakSkillsList,
    };
  }, [questions, answers, profile]);

  // Skill gap remediation recommendations (YouTube videos & courses)
  const remediations = useMemo(() => {
    return getRemediationsForSkills(results.weakSkills);
  }, [results.weakSkills]);

  // Job & Internship recommendations ranked by matched verified skills
  const recommendedOpportunities = useMemo(() => {
    if (!profile) return [];
    return state.opportunities
      .filter((o) => o.audience !== "faculty")
      .map((o) => ({
        opp: o,
        score: matchOpportunity(profile, o),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  }, [state.opportunities, profile]);

  function handleSubmitAssessment() {
    if (!user) return;
    saveAptitudeAndSkillTest(user.id, {
      totalScore: results.totalScore,
      aptitudeScore: results.aptitudeScore,
      easyScore: Math.round((results.easyCorrect / (results.easyTotal || 1)) * 100),
      mediumScore: Math.round((results.medCorrect / (results.medTotal || 1)) * 100),
      hardScore: Math.round((results.hardCorrect / (results.hardTotal || 1)) * 100),
      skillScores: results.skillScores,
      answers,
      weakSkills: results.weakSkills,
    });
    setSubmitted(true);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleCompleteZeroRound(res: ZeroRoundResult) {
    if (!selectedOppForZeroRound) return;
    applyWithZeroRound(selectedOppForZeroRound.id, res);
    setSelectedOppForZeroRound(null);
  }

  function formatTime(secs: number) {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? "0" : ""}${rem}`;
  }

  // Active or Locked View
  const isViewLocked = (isAlreadyAssessed || submitted) && !needsReassessment;

  return (
    <>
      <PageTitle
        kicker="Aptitude &amp; Skill Verification"
        title="Comprehensive Skill &amp; Aptitude Assessment"
        subtitle={
          isViewLocked
            ? "Official verified results locked. Explore job/internship recommendations and curated courses/YouTube videos to bridge weak topics."
            : needsReassessment
            ? `Academic Progression Track: 10 curated questions verifying aptitude and skills from your updated resume (${profile?.resumeSkills?.map((s) => s.toUpperCase()).join(", ") || "General Stack"}).`
            : isFirstYear
            ? "1st Year Foundation Track: Evaluates logical aptitude, problem-solving, and foundational CS concepts (no resume required)."
            : `Resume Skill Track: 10 curated questions evaluating aptitude and skills detected on your resume (${profile?.resumeSkills?.join(", ") || "General Stack"}).`
        }
      />

      {/* Info Header Badge */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-teal-500/20 bg-teal-950/20 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <GraduationCap className="text-teal-300" size={20} />
          <div>
            <p className="text-sm font-semibold text-slate-100">
              {profile?.collegeName || user?.org} · {profile?.year || "Student"} · {profile?.semester || "Sem 1"}
            </p>
            <p className="text-xs text-slate-400">
              {isFirstYear
                ? "1st Year Foundation Track (No resume required). Testing aptitude & core programming."
                : `Verified against document: ${profile?.resumeFileName || profile?.resumeUrl || "Attached Resume"}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isViewLocked ? (
            <span className="chip border-emerald-500/40 bg-emerald-500/15 text-emerald-300">
              <Lock size={12} /> Assessment Submitted &amp; Locked
            </span>
          ) : (
            <>
              <span className="flex items-center gap-1.5 text-xs text-slate-300">
                <Clock size={14} className="text-teal-300" /> {formatTime(secondsElapsed)}
              </span>
              <span className="chip bg-teal-400/10 text-teal-300">
                {answeredCount} / {questions.length} answered
              </span>
              {answeredCount > 0 && (
                <button
                  onClick={handleSubmitAssessment}
                  className="btn btn-primary py-1 px-3 text-xs gap-1.5"
                >
                  <Send size={12} /> Submit Test ({answeredCount}/{questions.length})
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {!isViewLocked ? (
        /* QUIZ IN PROGRESS */
        <>
          {needsReassessment && (
            <div className="rounded-2xl border border-teal-500/40 bg-teal-950/30 p-4 mb-6 flex flex-wrap items-center justify-between gap-3 shadow-lg shadow-teal-950/20">
              <div className="flex items-center gap-3">
                <Sparkles className="text-teal-400 shrink-0" size={20} />
                <div>
                  <p className="text-sm font-semibold text-teal-200">
                    {profile?.year} Skill Verification Test Unlocked
                  </p>
                  <p className="text-xs text-slate-300">
                    This 10-question assessment is dynamically tailored to test aptitude and your newly declared resume skills ({profile?.resumeSkills?.map((s) => s.toUpperCase()).join(", ") || "Foundations"}).
                  </p>
                </div>
              </div>
              <span className="chip border-teal-400/30 text-teal-300 text-xs shrink-0">
                {profile?.year} Standard
              </span>
            </div>
          )}

          <div className="bar mb-6 max-w-2xl">
            <span style={{ width: `${progressPercent}%` }} />
          </div>

          <Card className="max-w-3xl">
            {currentQ && (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="chip">
                      Question {step + 1} of {questions.length}
                    </span>
                    <span
                      className={`chip ${
                        currentQ.difficulty === "easy"
                          ? "border-emerald-500/30 text-emerald-300 bg-emerald-950/20"
                          : currentQ.difficulty === "medium"
                          ? "border-amber-500/30 text-amber-300 bg-amber-950/20"
                          : "border-rose-500/30 text-rose-300 bg-rose-950/20"
                      }`}
                    >
                      {currentQ.difficulty.toUpperCase()}
                    </span>
                    <span className="chip border-teal-500/30 text-teal-300">
                      {currentQ.skillName}
                    </span>
                  </div>
                  {currentQ.category === "aptitude" && (
                    <span className="chip border-purple-500/40 text-purple-300 bg-purple-950/20">
                      <Brain size={12} /> Aptitude Item
                    </span>
                  )}
                </div>

                <h2 className="mt-5 text-xl font-medium leading-relaxed text-slate-100">
                  {currentQ.prompt}
                </h2>

                {currentQ.codeSnippet && (
                  <pre className="mt-3 overflow-x-auto rounded-xl bg-black/40 p-3 text-xs text-teal-200">
                    <code>{currentQ.codeSnippet}</code>
                  </pre>
                )}

                <div className="mt-6 space-y-2.5">
                  {currentQ.options.map((opt, i) => {
                    const isSelected = answers[currentQ.id] === i;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setAnswers((prev) => ({ ...prev, [currentQ.id]: i }))}
                        className={`w-full text-left rounded-xl border p-3.5 transition-all flex items-center justify-between ${
                          isSelected
                            ? "border-teal-400 bg-teal-500/15 text-teal-100 shadow-sm shadow-teal-500/20"
                            : "border-white/10 bg-slate-900/40 text-slate-300 hover:border-white/20 hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`grid h-6 w-6 place-items-center rounded-full text-xs font-semibold ${
                              isSelected
                                ? "bg-teal-400 text-slate-950"
                                : "bg-white/10 text-slate-400"
                            }`}
                          >
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className="text-sm">{opt}</span>
                        </div>
                        {isSelected && <CheckCircle2 size={16} className="text-teal-400" />}
                      </button>
                    );
                  })}
                </div>

                {/* Question jump indicators */}
                <div className="mt-8 flex flex-wrap items-center gap-1.5 border-t border-white/10 pt-4">
                  {questions.map((q, idx) => (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setStep(idx)}
                      className={`h-7 w-7 rounded-lg text-xs font-medium transition-colors ${
                        step === idx
                          ? "ring-2 ring-teal-400 text-teal-300 bg-teal-400/20"
                          : answers[q.id] !== undefined
                          ? "bg-teal-600/30 text-teal-200"
                          : "bg-white/5 text-slate-400 hover:bg-white/10"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    disabled={step === 0}
                    onClick={() => setStep((s) => s - 1)}
                  >
                    Previous
                  </button>

                  <div className="flex flex-wrap gap-2">
                    {step < questions.length - 1 && (
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => setStep((s) => s + 1)}
                      >
                        Next Question
                      </button>
                    )}

                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSubmitAssessment}
                    >
                      {answeredCount === questions.length
                        ? "Submit 10-Question Assessment"
                        : `Submit Assessment (${answeredCount}/${questions.length} answered)`}
                    </button>
                  </div>
                </div>
              </>
            )}
          </Card>
        </>
      ) : (
        /* LOCKED OFFICIAL DASHBOARD VIEW */
        <div className="space-y-8">
          {/* Lock Notice Alert with Re-assessment path */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 text-xs text-amber-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-start gap-3 max-w-2xl">
              <Lock size={18} className="shrink-0 text-amber-400 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-100">
                  Skill Assessment Official Attempt Locked ({profile?.year} Verification)
                </p>
                <p className="mt-0.5 text-slate-300 leading-relaxed">
                  Your skill snapshot is locked for this academic stage. If you have progressed to the next academic year (e.g. 1st Year &rarr; 2nd/3rd/4th Year) or gained new technical courses and updated your resume, you can update your profile to unlock a fresh skill verification test.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsUpdateModalOpen(true)}
              className="btn btn-ghost border-amber-400/40 text-amber-200 text-xs py-1.5 px-3.5 gap-1.5 hover:bg-amber-900/30 shrink-0"
            >
              <Edit3 size={13} /> Update Year &amp; Retest New Skills
            </button>
          </div>

          {/* Score Report Header */}
          <Card className="border-teal-500/30 bg-gradient-to-b from-teal-950/30 to-slate-900/60 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="chip border-teal-400/30 bg-teal-400/10 text-teal-300">
                  <Sparkles size={13} /> Official Verified Score Record
                </span>
                <h2 className="mt-3 font-[family-name:var(--font-serif)] text-3xl">
                  Overall Score: {results.totalScore}%
                </h2>
                <p className="mt-1 text-sm text-slate-300">
                  Aptitude &amp; Skill verification confirmed. Matching algorithm active.
                </p>
              </div>
              <div className="text-right">
                <div className="inline-block rounded-2xl bg-teal-400/15 p-4 text-center ring-1 ring-teal-400/30">
                  <p className="text-3xl font-bold text-teal-300">{results.totalScore}%</p>
                  <p className="text-[11px] uppercase tracking-wider text-slate-300">
                    Skill Readiness
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                <p className="text-xs text-slate-400">Aptitude Score</p>
                <p className="mt-1 text-xl font-bold text-purple-300">
                  {results.aptitudeScore}%
                </p>
                <p className="text-[10px] text-slate-400">
                  {results.aptCorrect}/{results.aptTotal} correct
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                <p className="text-xs text-slate-400">Easy Level</p>
                <p className="mt-1 text-xl font-bold text-emerald-300">
                  {Math.round((results.easyCorrect / (results.easyTotal || 1)) * 100)}%
                </p>
                <p className="text-[10px] text-slate-400">
                  {results.easyCorrect}/{results.easyTotal} correct
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                <p className="text-xs text-slate-400">Medium Level</p>
                <p className="mt-1 text-xl font-bold text-amber-300">
                  {Math.round((results.medCorrect / (results.medTotal || 1)) * 100)}%
                </p>
                <p className="text-[10px] text-slate-400">
                  {results.medCorrect}/{results.medTotal} correct
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                <p className="text-xs text-slate-400">Hard Level</p>
                <p className="mt-1 text-xl font-bold text-rose-300">
                  {Math.round((results.hardCorrect / (results.hardTotal || 1)) * 100)}%
                </p>
                <p className="text-[10px] text-slate-400">
                  {results.hardCorrect}/{results.hardTotal} correct
                </p>
              </div>
            </div>
          </Card>

          {/* SECTION 1: RECOMMENDED JOBS & INTERNSHIPS BASED ON ASSESSMENT */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>
                <span className="chip border-teal-500/30 text-teal-300">
                  <Briefcase size={12} /> Matching Engine Output
                </span>
                <h3 className="text-2xl font-bold text-slate-100 mt-1">
                  Recommended Jobs &amp; Internships for You
                </h3>
                <p className="text-xs text-slate-400">
                  Ranked by compatibility with your verified assessment scores and technical competencies.
                </p>
              </div>
              <Link href="/student/internships" className="btn btn-ghost text-xs gap-1">
                View All Openings <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {recommendedOpportunities.map(({ opp, score }) => {
                const application = state.applications.find(
                  (a) => a.opportunityId === opp.id && a.applicantId === user?.id
                );
                const applied = Boolean(application);
                const zeroResult = application?.zeroRoundResult;

                return (
                  <Card key={opp.id} className="flex flex-col justify-between border-white/10">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="chip text-[10px]">{opp.type.replace("-", " ")}</span>
                          <h4 className="mt-2 text-base font-semibold text-slate-100">{opp.title}</h4>
                          <p className="text-xs font-medium text-teal-300">{opp.company}</p>
                        </div>
                        <div className="rounded-2xl bg-teal-400/10 px-3 py-1.5 text-center ring-1 ring-teal-400/20">
                          <p className="text-lg font-bold text-teal-300">{score}%</p>
                          <p className="text-[9px] uppercase tracking-wide text-slate-400">Match</p>
                        </div>
                      </div>

                      <p className="mt-2.5 text-xs text-slate-400 line-clamp-2">{opp.description}</p>

                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-300">
                        <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                          <MapPin size={12} className="text-teal-400" /> {opp.location} · {opp.mode}
                        </span>
                        {opp.stipend && (
                          <span className="chip text-[10px] text-amber-300 border-amber-500/30">
                            {opp.stipend}
                          </span>
                        )}
                      </div>

                      <div className="mt-2.5 flex flex-wrap gap-1">
                        {opp.requiredSkills.map((sk) => (
                          <span key={sk} className="chip text-[10px] bg-slate-900/60">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5">
                      {applied ? (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-emerald-300 font-medium">
                            {zeroResult?.passed
                              ? `Round 0 Cleared (${zeroResult.totalScore}%)`
                              : "Applied"}
                          </span>
                          <span className="chip text-[10px] uppercase text-teal-200">
                            {application?.status}
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedOppForZeroRound(opp)}
                          className="btn btn-primary w-full py-2 text-xs gap-1.5"
                        >
                          <ShieldAlert size={13} /> Take Company Round 0 Screening &amp; Apply
                        </button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: WEAK / GAP TOPIC COURSES & YOUTUBE VIDEOS */}
          <div>
            <div className="mb-4">
              <span className="chip border-rose-500/30 text-rose-300">
                <Youtube size={12} /> Skill Gap Remediation
              </span>
              <h3 className="text-2xl font-bold text-slate-100 mt-1">
                Courses &amp; YouTube Playlists for Your Weak / Gap Skills
              </h3>
              <p className="text-xs text-slate-400">
                Identified based on incorrect items and skill gaps in your assessment. Bridge these gaps to easily clear company Zero Rounds!
              </p>
            </div>

            <div className="space-y-6">
              {remediations.map((rem) => (
                <Card key={rem.skillId} className="border-rose-500/20 bg-slate-900/60">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="chip border-rose-500/40 bg-rose-500/10 text-rose-300 font-semibold">
                        Skill Gap: {rem.skillName}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">Recommended Next Action</span>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-slate-300">{rem.gapSummary}</p>

                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    {/* YouTube Videos */}
                    <div className="rounded-2xl border border-red-500/20 bg-red-950/15 p-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-red-300 mb-3">
                        <Youtube size={16} /> Recommended YouTube Tutorials &amp; Playlists
                      </div>
                      <div className="space-y-3">
                        {rem.youtubeVideos.map((yt) => (
                          <div
                            key={yt.title}
                            className="rounded-xl border border-white/10 bg-black/30 p-3 transition-colors hover:border-red-500/30"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs font-medium text-slate-100">{yt.title}</p>
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
                              className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-red-400 hover:text-red-300 hover:underline"
                            >
                              <Play size={11} /> Watch on YouTube <ExternalLink size={10} />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Courses */}
                    <div className="rounded-2xl border border-blue-500/20 bg-blue-950/15 p-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 mb-3">
                        <Video size={16} /> Recommended University &amp; Certification Courses
                      </div>
                      <div className="space-y-3">
                        {rem.courses.map((c) => (
                          <div
                            key={c.title}
                            className="rounded-xl border border-white/10 bg-black/30 p-3 transition-colors hover:border-blue-500/30"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs font-medium text-slate-100">{c.title}</p>
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
                              className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 hover:underline"
                            >
                              Join Course Curriculum <ExternalLink size={10} />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Question Breakdown and Explanations */}
          <Card>
            <h3 className="text-lg font-semibold text-slate-200">Official Question Review &amp; Explanations</h3>
            <div className="mt-4 space-y-3">
              {questions.map((q, idx) => {
                const userAnswer = answers[q.id];
                const isCorrect = userAnswer === q.answer;
                return (
                  <div
                    key={q.id}
                    className={`rounded-xl border p-3.5 text-sm ${
                      isCorrect
                        ? "border-emerald-500/20 bg-emerald-950/15"
                        : "border-rose-500/20 bg-rose-950/15"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-200">
                        {idx + 1}. {q.prompt}
                      </span>
                      <span
                        className={`chip ${
                          isCorrect
                            ? "border-emerald-500/30 text-emerald-300"
                            : "border-rose-500/30 text-rose-300"
                        }`}
                      >
                        {isCorrect ? "Correct" : "Incorrect"}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-300">
                      <strong className="text-slate-200">Your answer:</strong>{" "}
                      {userAnswer !== undefined ? q.options[userAnswer] : "Skipped"}
                    </p>
                    {!isCorrect && (
                      <p className="mt-1 text-xs text-emerald-300">
                        <strong>Correct answer:</strong> {q.options[q.answer]}
                      </p>
                    )}
                    <p className="mt-1.5 text-xs text-slate-400">{q.explanation}</p>
                  </div>
                );
              })}
            </div>
          </Card>

          <div className="flex flex-wrap gap-3">
            <Link href="/student/mapping" className="btn btn-primary">
              View Skill DNA &amp; Mapping <ArrowRight size={16} />
            </Link>
            <Link href="/student/roadmaps" className="btn btn-ghost">
              Explore Roadmaps
            </Link>
            <Link href="/student/internships" className="btn btn-ghost">
              Browse Internships
            </Link>
          </div>
        </div>
      )}

      {profile && (
        <UpdateProfileModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          profile={profile}
        />
      )}

      {selectedOppForZeroRound && (
        <ZeroRoundModal
          opp={selectedOppForZeroRound}
          isOpen={Boolean(selectedOppForZeroRound)}
          onClose={() => setSelectedOppForZeroRound(null)}
          onComplete={handleCompleteZeroRound}
        />
      )}
    </>
  );
}
